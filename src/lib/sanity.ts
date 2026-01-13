export type Product = {
  id: string
  title: string
  description: string
  priceCents: number
  imageUrl?: string
  category?: string
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()

function getApiUrl(pathname: string) {
  if (!apiBaseUrl) return pathname
  const base = apiBaseUrl.replace(/\/$/, '')
  return `${base}${pathname}`
}

async function fetchProductsFromApi(limit?: number): Promise<Product[]> {
  const url =
    typeof limit === 'number'
      ? `/api/products/featured?limit=${encodeURIComponent(limit)}`
      : '/api/products'
  const res = await fetch(getApiUrl(url))
  if (!res.ok) throw new Error(`API ${res.status}`)
  return (await res.json()) as Product[]
}

export async function fetchProducts(): Promise<Product[]> {
  return fetchProductsFromApi()
}

export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {
  return fetchProductsFromApi(limit)
}
