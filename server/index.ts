import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { z } from 'zod'
import { createClient } from '@sanity/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables regardless of where the process is started from.
// - Prefer project root `.env`
// - Allow optional `server/.env` to override
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, './.env') })

const PORT = Number(process.env.PORT ?? 8787)
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY in environment')
}

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null

function unwrapStripeResponse<T>(value: unknown): T {
  const maybe = value as { data?: unknown }
  return (maybe && 'data' in maybe && maybe.data ? maybe.data : value) as T
}

const sanityProjectId = process.env.SANITY_PROJECT_ID
const sanityDataset = process.env.SANITY_DATASET ?? 'production'
const sanityApiVersion = process.env.SANITY_API_VERSION ?? '2025-01-01'
const sanityReadToken = process.env.SANITY_READ_TOKEN

function getSanityClient() {
  if (!sanityProjectId) return null
  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: true,
    token: sanityReadToken,
  })
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

const app = express()

app.use(
  cors({
    origin: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/products', async (_req, res) => {
  try {
    const sanity = getSanityClient()
    if (!sanity) {
      res.status(500).send('Server non configurato: SANITY_PROJECT_ID mancante')
      return
    }

    const query = `*[_type=="product"] | order(_createdAt desc) {
      "id": _id,
      "title": name,
      description,
      price,
      category,
      "imageUrl": image.asset->url
    }`

    const products = await sanity.fetch<SanityProduct[]>(query)

    res.json(
      products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        priceCents: eurToCents(p.price),
        imageUrl: p.imageUrl,
        category: p.category,
      })),
    )
  } catch (e) {
    console.error(e)
    res.status(500).send('Errore interno')
  }
})

app.get('/api/products/featured', async (req, res) => {
  try {
    const sanity = getSanityClient()
    if (!sanity) {
      res.status(500).send('Server non configurato: SANITY_PROJECT_ID mancante')
      return
    }

    const limitRaw = Number(req.query.limit ?? 6)
    const limit = Number.isFinite(limitRaw) ? Math.min(24, Math.max(1, Math.floor(limitRaw))) : 6

    const query = `*[_type=="product"] | order(_createdAt desc)[0...$limit] {
      "id": _id,
      "title": name,
      description,
      price,
      category,
      "imageUrl": image.asset->url
    }`

    const products = await sanity.fetch<SanityProduct[]>(query, { limit })

    res.json(
      products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        priceCents: eurToCents(p.price),
        imageUrl: p.imageUrl,
        category: p.category,
      })),
    )
  } catch (e) {
    console.error(e)
    res.status(500).send('Errore interno')
  }
})

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

app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) {
      res.status(500).send('Server non configurato: STRIPE_SECRET_KEY mancante')
      return
    }

    const parsed = CheckoutBodySchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).send('Body non valido')
      return
    }

    const sanity = getSanityClient()
    if (!sanity) {
      res.status(500).send('Server non configurato: SANITY_PROJECT_ID mancante')
      return
    }

    const ids = parsed.data.items.map((i) => i.productId)

    const query = `*[_type=="product" && _id in $ids]{
      "id": _id,
      "title": name,
      description,
      price,
      "imageUrl": image.asset->url
    }`

    const products = await sanity.fetch<SanityProduct[]>(query, { ids })

    const productById = new Map(products.map((p) => [p.id, p]))

    for (const it of parsed.data.items) {
      if (!productById.has(it.productId)) {
        res.status(400).send('Prodotto non trovato in catalogo')
        return
      }
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      parsed.data.items.map((it) => {
        const p = productById.get(it.productId)!
        const unitAmount = eurToCents(p.price)

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
      })

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
      res.status(500).send('Impossibile creare sessione Stripe')
      return
    }

    res.json({ url: createdSession.url })
  } catch (e) {
    console.error(e)
    res.status(500).send('Errore interno')
  }
})

app.get('/api/receipt', async (req, res) => {
  try {
    if (!stripe) {
      res.status(500).send('Server non configurato: STRIPE_SECRET_KEY mancante')
      return
    }

    const session_id = String(req.query.session_id ?? '')
    if (!session_id) {
      res.status(400).send('session_id mancante')
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

    res.json({
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
    console.error(e)
    res.status(500).send('Errore interno')
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
