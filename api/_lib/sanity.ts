import { createClient } from '@sanity/client'

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

export function getSanityClient() {
  const sanityProjectId = process.env.SANITY_PROJECT_ID
  const sanityDataset = process.env.SANITY_DATASET ?? 'production'
  const sanityApiVersion = process.env.SANITY_API_VERSION ?? '2025-01-01'
  const sanityReadToken = process.env.SANITY_READ_TOKEN

  if (!sanityProjectId) return null

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: true,
    token: sanityReadToken,
  })
}

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const sanity = getSanityClient()
  if (!sanity) throw new Error('SANITY_PROJECT_ID mancante')

  const query = `*[_type=="product"] | order(_createdAt desc) {
    "id": _id,
    "title": name,
    description,
    price,
    category,
    "imageUrl": image.asset->url
  }`

  const products = await sanity.fetch<SanityProduct[]>(query)
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
  const sanity = getSanityClient()
  if (!sanity) throw new Error('SANITY_PROJECT_ID mancante')

  const safe = Number.isFinite(limit) ? Math.min(24, Math.max(1, Math.floor(limit))) : 6

  const query = `*[_type=="product"] | order(_createdAt desc)[0...$limit] {
    "id": _id,
    "title": name,
    description,
    price,
    category,
    "imageUrl": image.asset->url
  }`

  const products = await sanity.fetch<SanityProduct[]>(query, { limit: safe })
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
  const sanity = getSanityClient()
  if (!sanity) throw new Error('SANITY_PROJECT_ID mancante')

  const query = `*[_type=="product" && _id in $ids]{
    "id": _id,
    "title": name,
    description,
    price,
    category,
    "imageUrl": image.asset->url
  }`

  const products = await sanity.fetch<SanityProduct[]>(query, { ids })
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    priceCents: eurToCents(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
  }))
}
