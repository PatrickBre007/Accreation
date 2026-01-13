import { json } from './_lib/http'

export const config = { runtime: 'nodejs' } as const

export default function handler(_req: unknown, res: import('node:http').ServerResponse) {
  json(res, 200, { ok: true })
}
