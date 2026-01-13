import { fetchAllProducts } from './_lib/sanity'
import { json, text } from './_lib/http'

export const config = { runtime: 'nodejs' } as const

export default async function handler(_req: unknown, res: import('node:http').ServerResponse) {
  try {
    const products = await fetchAllProducts()
    json(res, 200, products)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore interno'
    text(res, 500, msg)
  }
}
