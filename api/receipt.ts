import Stripe from 'stripe'
import { json, text } from './_lib/http.js'
import { getStripe } from './_lib/stripe.js'

export const config = { runtime: 'nodejs' } as const

type ApiReq = import('node:http').IncomingMessage & {
  query?: Record<string, string | string[] | undefined>
  method?: string
}

function unwrapStripeResponse<T>(value: unknown): T {
  const maybe = value as { data?: unknown }
  return (maybe && 'data' in maybe && maybe.data ? maybe.data : value) as T
}

export default async function handler(req: ApiReq, res: import('node:http').ServerResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    text(res, 405, 'Method Not Allowed')
    return
  }

  try {
    const stripe = getStripe()
    if (!stripe) {
      text(res, 500, 'Server non configurato: STRIPE_SECRET_KEY mancante')
      return
    }

    const session_id = String(req.query?.session_id ?? '')
    if (!session_id) {
      text(res, 400, 'session_id mancante')
      return
    }

    const sessionResp = await stripe.checkout.sessions.retrieve(session_id)
    const lineItemsResp = await stripe.checkout.sessions.listLineItems(session_id)

    const session = unwrapStripeResponse<Stripe.Checkout.Session>(sessionResp)
    const lineItems = unwrapStripeResponse<Stripe.ApiList<Stripe.LineItem>>(lineItemsResp)

    const addressObj =
      session.collected_information?.shipping_details?.address ??
      session.customer_details?.address

    const address = addressObj
      ? [
          addressObj.line1,
          addressObj.line2,
          addressObj.postal_code,
          addressObj.city,
          addressObj.state,
          addressObj.country,
        ]
          .filter(Boolean)
          .join(', ')
      : undefined

    json(res, 200, {
      paymentStatus: session.payment_status,
      customerName:
        session.collected_information?.shipping_details?.name ??
        session.customer_details?.name ??
        undefined,
      customerEmail: session.customer_details?.email ?? undefined,
      address,
      items: lineItems.data.map((li) => ({
        description: li.description ?? 'Articolo',
        quantity: li.quantity ?? 1,
        amountTotal: li.amount_total ?? 0,
      })),
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? 'eur',
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore interno'
    text(res, 500, msg)
  }
}
