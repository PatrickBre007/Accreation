import { fetchFeaturedProducts } from '../_lib/sanity'
import { json, text } from '../_lib/http'

export const config = { runtime: 'nodejs' } as const

type ApiReq = import('node:http').IncomingMessage & {
  query?: Record<string, string | string[] | undefined>
  method?: string
}

export default async function handler(req: ApiReq, res: import('node:http').ServerResponse) {
  try {
    const query = req.query ?? {}
    const limitRaw = Number(query.limit ?? 6)
    const products = await fetchFeaturedProducts(limitRaw)
    json(res, 200, products)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore interno'
    text(res, 500, msg)
  }
}
