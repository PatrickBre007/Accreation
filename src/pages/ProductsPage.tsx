import { useEffect, useState } from 'react'
import { fetchProducts, type Product } from '../lib/sanity'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'

type PriceFilter = 'all' | 'under10' | '10to20' | '20to30' | '30to40' | 'over40'

const CATEGORY_LABELS: Record<string, string> = {
  bracciale: 'Bracciali',
  collana: 'Collane',
  orecchini: 'Orecchini',
  anello: 'Anelli',
}

function chipClass(active: boolean) {
  return (
    'group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold no-underline ' +
    'motion-safe:transition motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 active:translate-y-0 ' +
    'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[240%] before:rotate-12 ' +
    'before:bg-gradient-to-r before:from-transparent before:via-emerald-200/18 before:to-transparent before:opacity-0 ' +
    'motion-safe:before:transition motion-safe:before:duration-700 motion-safe:before:ease-out ' +
    'motion-safe:hover:before:translate-x-[340%] motion-safe:hover:before:opacity-100 ' +
    (active
      ? 'border-emerald-200/40 bg-[radial-gradient(140px_circle_at_30%_30%,rgba(16,185,129,0.22),transparent_60%)] text-foreground shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_0_26px_rgba(16,185,129,0.18)]'
      : 'border-emerald-400/15 bg-background/10 text-foreground/80 hover:border-emerald-300/25 hover:bg-emerald-300/8 hover:text-foreground')
  )
}

function matchesPrice(priceCents: number, filter: PriceFilter) {
  const v = priceCents / 100
  if (filter === 'all') return true
  if (filter === 'under10') return v < 10
  if (filter === '10to20') return v >= 10 && v <= 20
  if (filter === '20to30') return v > 20 && v <= 30
  if (filter === '30to40') return v > 30 && v <= 40
  return v > 40
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  )
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState<string>('all')
  const [price, setPrice] = useState<PriceFilter>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([])
          setError('Impossibile caricare i prodotti in questo momento.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!filtersOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFiltersOpen(false)
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [filtersOpen])

  const filteredProducts = products.filter((p) => {
    const okCategory = category === 'all' || (p.category ?? '') === category
    const okPrice = matchesPrice(p.priceCents, price)
    return okCategory && okPrice
  })

  const activeFilterCount = (category === 'all' ? 0 : 1) + (price === 'all' ? 0 : 1)

  return (
    <div className="flex flex-col gap-6">
      <Reveal variant="blur" durationMs={1100}>
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-25" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rotate-12 rounded-[3rem] bg-metal-gold/10 blur-[1px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 -rotate-12 rounded-full bg-metal-silver/10 blur-[1px]" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Prodotti</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Creazioni con pietre naturali e metalli, aggiornate dal catalogo.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/18 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-emerald-200/12"
              onClick={() => setFiltersOpen(true)}
            >
              <FilterIcon />
              Filtri
              {activeFilterCount > 0 ? (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full border border-emerald-300/18 bg-emerald-300/12 px-2 py-0.5 text-xs text-foreground/85">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </section>
      </Reveal>

      {!loading && error ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {error} Verifica che l’API sia attiva e che il server abbia configurato Sanity
          (<span className="font-semibold">SANITY_PROJECT_ID</span>,{' '}
          <span className="font-semibold">SANITY_DATASET</span>,{' '}
          <span className="font-semibold">SANITY_READ_TOKEN</span> se dataset privato).
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-muted-foreground">Caricamento…</div>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Nessun prodotto trovato.
        </div>
      ) : null}

      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filtri">
          <button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur"
            onClick={() => setFiltersOpen(false)}
            aria-label="Chiudi"
          />

          <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-35" />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-xl overflow-hidden rounded-t-3xl border border-border bg-card/90 backdrop-blur sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <div className="text-sm font-semibold">Filtri</div>
                <div className="text-xs text-muted-foreground">
                  Scegli categoria e fascia prezzo.
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/10 text-foreground transition hover:bg-muted"
                onClick={() => setFiltersOpen(false)}
                aria-label="Chiudi"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="grid gap-6 px-5 py-5">
              <div className="grid gap-3">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  CATEGORIE
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={chipClass(category === 'all')}
                    onClick={() => setCategory('all')}
                  >
                    Tutti
                  </button>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => {
                    const hasAny = products.some((p) => (p.category ?? '') === value)
                    if (!hasAny) return null
                    return (
                      <button
                        key={value}
                        type="button"
                        className={chipClass(category === value)}
                        onClick={() => setCategory(value)}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  FASCIA PREZZO
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={chipClass(price === 'all')}
                    onClick={() => setPrice('all')}
                  >
                    Tutti
                  </button>
                  <button
                    type="button"
                    className={chipClass(price === 'under10')}
                    onClick={() => setPrice('under10')}
                  >
                    5€ – 10€
                  </button>
                  <button
                    type="button"
                    className={chipClass(price === '10to20')}
                    onClick={() => setPrice('10to20')}
                  >
                    10€ – 20€
                  </button>
                  <button
                    type="button"
                    className={chipClass(price === '20to30')}
                    onClick={() => setPrice('20to30')}
                  >
                    20€ – 30€
                  </button>
                  <button
                    type="button"
                    className={chipClass(price === '30to40')}
                    onClick={() => setPrice('30to40')}
                  >
                    30€ – 40€
                  </button>
                  <button
                    type="button"
                    className={chipClass(price === 'over40')}
                    onClick={() => setPrice('over40')}
                  >
                    Oltre 40€
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} prodotti
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-border bg-background/10 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                  onClick={() => {
                    setCategory('all')
                    setPrice('all')
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  onClick={() => setFiltersOpen(false)}
                >
                  Mostra
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
