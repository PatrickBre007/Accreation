import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCartStore, cartTotalCents } from '../store/cart'
import { formatEurFromCents } from '../lib/format'

type CheckoutResponse = { url: string }

export function CartPage() {
  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = useMemo(() => cartTotalCents(items), [items])

  async function checkout() {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Checkout fallito')
      }

      const data = (await res.json()) as CheckoutResponse
      window.location.assign(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout fallito')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-20" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Carrello</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Controlla quantità e procedi al pagamento con Stripe.
            </p>
          </div>
          <NavLink
            to="/prodotti"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background/10 px-4 py-2 text-sm font-semibold text-foreground no-underline backdrop-blur transition hover:bg-muted"
          >
            Continua acquisti
          </NavLink>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="text-sm font-semibold">Il carrello è vuoto</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Aggiungi un prodotto per procedere al checkout.
          </div>
          <div className="mt-5">
            <NavLink
              to="/prodotti"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline hover:opacity-90"
            >
              Vai ai prodotti
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur"
              >
                <div className="flex gap-4 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{item.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatEurFromCents(item.priceCents)} cad.
                        </div>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg border border-border bg-background/10 px-3 py-2 text-xs font-semibold text-muted-foreground backdrop-blur transition hover:bg-muted hover:text-foreground"
                        onClick={() => removeItem(item.productId)}
                      >
                        Rimuovi
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex items-center rounded-xl border border-border bg-background/10 p-1 backdrop-blur">
                        <button
                          type="button"
                          className="grid h-9 w-10 place-items-center rounded-lg text-sm font-semibold text-foreground/90 transition hover:bg-muted"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          aria-label="Diminuisci quantità"
                        >
                          −
                        </button>
                        <div className="min-w-10 px-2 text-center text-sm font-semibold">
                          {item.quantity}
                        </div>
                        <button
                          type="button"
                          className="grid h-9 w-10 place-items-center rounded-lg text-sm font-semibold text-foreground/90 transition hover:bg-muted"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          aria-label="Aumenta quantità"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Subtotale</div>
                        <div className="text-base font-semibold">
                          {formatEurFromCents(item.priceCents * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur lg:sticky lg:top-28">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Totale</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">
                  {formatEurFromCents(total)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">IVA incl.</div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background/10 p-4 text-xs text-muted-foreground">
              Pagamento sicuro tramite Stripe Checkout.
            </div>

            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              onClick={checkout}
              disabled={submitting}
            >
              {submitting ? 'Reindirizzamento…' : 'Compra ora'}
            </button>

            {error ? (
              <div className="mt-3 rounded-xl border border-border bg-background/10 p-3 text-xs text-muted-foreground">
                {error}
              </div>
            ) : null}
          </aside>
        </div>
      )}
    </div>
  )
}
