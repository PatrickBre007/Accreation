import type { IncomingMessage, ServerResponse } from 'node:http'

export function json(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

export function text(res: ServerResponse, status: number, message: string) {
  res.statusCode = status
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(message)
}

export function getBaseUrl(req: IncomingMessage) {
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) || 'https'
  const host = (req.headers['x-forwarded-host'] as string | undefined) || req.headers.host
  if (!host) return ''
  return `${proto}://${host}`
}

export async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<unknown> {
  if (req.body !== undefined) return req.body

  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve())
    req.on('error', reject)
  })

  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
