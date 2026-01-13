import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, NavLink } from 'react-router-dom'
import { formatEurFromCents } from '../lib/format'
import { useCartStore } from '../store/cart'

type ReceiptItem = {
  description: string
  quantity: number
  amountTotal: number
}

type Receipt = {
  paymentStatus: string
  customerName?: string
  customerEmail?: string
  address?: string
  items: ReceiptItem[]
  amountTotal: number
  currency: string
}

export function SuccessPage() {
  const clear = useCartStore((s) => s.clear)
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')

  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hasSession = useMemo(() => Boolean(sessionId), [sessionId])

  useEffect(() => {
    if (!sessionId) return

    let cancelled = false

    fetch(`/api/receipt?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return (await res.json()) as Receipt
      })
      .then((data) => {
        if (cancelled) return
        setReceipt(data)
        clear()
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Impossibile caricare ricevuta')
      })

    return () => {
      cancelled = true
    }
  }, [clear, sessionId])

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-20" />
        <div className="relative">
          <h1 className="text-3xl font-semibold tracking-tight">Ricevuta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Grazie! Qui trovi il riepilogo dell’acquisto.
          </p>
        </div>
      </section>

      {!hasSession ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Sessione Stripe mancante.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {error}
        </div>
      ) : null}

      {receipt ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Stato pagamento: </span>
              <span className="font-semibold">{receipt.paymentStatus}</span>
            </div>

            {receipt.customerName ? (
              <div className="text-sm">
                <span className="text-muted-foreground">Cliente: </span>
                <span className="font-semibold">{receipt.customerName}</span>
              </div>
            ) : null}

            {receipt.address ? (
              <div className="text-sm">
                <span className="text-muted-foreground">Indirizzo: </span>
                <span className="font-semibold">{receipt.address}</span>
              </div>
            ) : null}

            <div className="mt-4 divide-y divide-border rounded-xl border border-border">
              {receipt.items.map((it, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{it.description}</div>
                    <div className="text-xs text-muted-foreground">
                      Quantità: {it.quantity}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold">
                    {formatEurFromCents(it.amountTotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Totale pagato</div>
              <div className="text-lg font-semibold">
                {formatEurFromCents(receipt.amountTotal)}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <NavLink
        to="/prodotti"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline hover:opacity-90"
      >
        Torna ai prodotti
      </NavLink>
    </div>
  )
}
