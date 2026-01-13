import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatEurFromCents } from '../lib/format'
import type { Product } from '../lib/sanity'
import { useCartStore } from '../store/cart'
import { ImageLightbox } from './ImageLightbox'
import { flyToCart } from '../lib/flyToCart'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [buying, setBuying] = useState(false)
  const [openImage, setOpenImage] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const imageRef = useRef<HTMLImageElement | null>(null)

  function animateAddToCart() {
    const target = document.querySelector('[data-cart-target]') as HTMLElement | null
    const source = imageRef.current

    if (!target || !source) return
    flyToCart({ sourceEl: source, targetEl: target, reducedMotion })
  }

  function addToCart() {
    animateAddToCart()
    addItem(
      {
        productId: product.id,
        title: product.title,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
      },
      1,
    )
  }

  async function buyNow() {
    setBuying(true)

    // Flow richiesto: prima nel carrello, poi checkout Stripe con totale e articoli.
    addItem(
      {
        productId: product.id,
        title: product.title,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
      },
      1,
    )

    navigate('/carrello')
  }

  return (
    <div className="glow">
      <div className="group overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur transition hover:shadow-sm">
        <div className="relative aspect-square w-full bg-muted">
          <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-40" />
          {product.imageUrl ? (
            <>
              <button
                type="button"
                className="relative h-full w-full"
                onClick={() => setOpenImage(true)}
                aria-label="Apri immagine"
              >
                <img
                  ref={imageRef}
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </button>

              <ImageLightbox
                open={openImage}
                src={product.imageUrl}
                alt={product.title}
                onClose={() => setOpenImage(false)}
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Immagine mancante
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{product.title}</div>
              <div className="text-xs text-muted-foreground">
                {product.description}
              </div>
            </div>
            <div className="whitespace-nowrap text-sm font-semibold">
              {formatEurFromCents(product.priceCents)}
            </div>
          </div>

          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background/10 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-muted"
              onClick={addToCart}
            >
              Aggiungi al carrello
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
              onClick={buyNow}
              disabled={buying}
            >
              {buying ? 'Apertura carrello…' : 'Compra ora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
