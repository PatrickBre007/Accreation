export type ApiProduct = {
  id: string
  title: string
  description: string
  priceCents: number
  imageUrl?: string
  category?: string
}

type SanityProduct = {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string
  category?: string
}

function eurToCents(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.round(value * 100))
}

type SanityQueryResponse<T> = {
  result: T
}

function getSanityConfig() {
  const projectId = (process.env.SANITY_PROJECT_ID ?? '').trim()
  const dataset = (process.env.SANITY_DATASET ?? 'production').trim()
  const apiVersion = (process.env.SANITY_API_VERSION ?? '2025-01-01').trim()
  const token = (process.env.SANITY_READ_TOKEN ?? '').trim()

  if (!projectId) throw new Error('SANITY_PROJECT_ID mancante')
  return { projectId, dataset, apiVersion, token }
}

async function sanityQuery<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  const { projectId, dataset, apiVersion, token } = getSanityConfig()

  const base = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
  const url = new URL(base)
  url.searchParams.set('query', query)

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(`$${k}`, JSON.stringify(v))
    }
  }

  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(txt || `Sanity API ${res.status}`)
  }

  const data = (await res.json()) as SanityQueryResponse<T>
  return data.result
}

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const query = `*[_type=="product"] | order(_createdAt desc) {
    "id": _id,
    "title": name,
    description,
    price,
    category,
    "imageUrl": image.asset->url
  }`

  const products = await sanityQuery<SanityProduct[]>(query)
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    priceCents: eurToCents(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
  }))
}

export async function fetchFeaturedProducts(limit: number): Promise<ApiProduct[]> {
  const safe = Number.isFinite(limit) ? Math.min(24, Math.max(1, Math.floor(limit))) : 6

  const query = `*[_type=="product"] | order(_createdAt desc)[0...$limit] {
    "id": _id,
    "title": name,
    description,
    price,
    category,
    "imageUrl": image.asset->url
  }`

  const products = await sanityQuery<SanityProduct[]>(query, { limit: safe })
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    priceCents: eurToCents(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
  }))
}

export async function fetchProductsByIds(ids: string[]): Promise<ApiProduct[]> {
  const query = `*[_type=="product" && _id in $ids]{
    "id": _id,
    "title": name,
    description,
    price,
    category,
    "imageUrl": image.asset->url
  }`

  const products = await sanityQuery<SanityProduct[]>(query, { ids })
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    priceCents: eurToCents(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
  }))
}
