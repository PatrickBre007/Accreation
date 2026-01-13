import Stripe from 'stripe'
import { z } from 'zod'
import { json, readJsonBody, text, getBaseUrl } from './_lib/http.js'
import { fetchProductsByIds } from './_lib/sanity.js'
import { getStripe } from './_lib/stripe.js'

export const config = { runtime: 'nodejs' } as const

type ApiReq = import('node:http').IncomingMessage & {
  query?: Record<string, string | string[] | undefined>
  method?: string
  body?: unknown
}

const CheckoutBodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
})

function unwrapStripeResponse<T>(value: unknown): T {
  const maybe = value as { data?: unknown }
  return (maybe && 'data' in maybe && maybe.data ? maybe.data : value) as T
}

function getFrontendUrl(req: ApiReq) {
  const fromEnv = (process.env.FRONTEND_URL ?? '').trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  const inferred = getBaseUrl(req)
  return inferred.replace(/\/$/, '')
}

export default async function handler(req: ApiReq, res: import('node:http').ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    text(res, 405, 'Method Not Allowed')
    return
  }

  try {
    const stripe = getStripe()
    if (!stripe) {
      text(res, 500, 'Server non configurato: STRIPE_SECRET_KEY mancante')
      return
    }

    const body = await readJsonBody(req)
    const parsed = CheckoutBodySchema.safeParse(body)
    if (!parsed.success) {
      text(res, 400, 'Body non valido')
      return
    }

    const ids = parsed.data.items.map((i) => i.productId)
    const products = await fetchProductsByIds(ids)
    const productById = new Map(products.map((p) => [p.id, p]))

    for (const it of parsed.data.items) {
      if (!productById.has(it.productId)) {
        text(res, 400, 'Prodotto non trovato in catalogo')
        return
      }
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = parsed.data.items.map(
      (it) => {
        const p = productById.get(it.productId)!
        const unitAmount = p.priceCents

        if (!unitAmount || unitAmount <= 0) {
          throw new Error('Prezzo prodotto non valido')
        }

        return {
          quantity: it.quantity,
          price_data: {
            currency: 'eur',
            unit_amount: unitAmount,
            product_data: {
              name: p.title,
              description: p.description,
              images: p.imageUrl ? [p.imageUrl] : undefined,
              metadata: {
                sanityProductId: p.id,
              },
            },
          },
        }
      },
    )

    const FRONTEND_URL = getFrontendUrl(req)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/carrello`,
      shipping_address_collection: { allowed_countries: ['IT'] },
      phone_number_collection: { enabled: true },
    })

    const createdSession = unwrapStripeResponse<Stripe.Checkout.Session>(session)
    if (!createdSession.url) {
      text(res, 500, 'Impossibile creare sessione Stripe')
      return
    }

    json(res, 200, { url: createdSession.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore interno'
    text(res, 500, msg)
  }
}
