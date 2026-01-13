import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState } from 'react'
import type { Product } from '../lib/sanity'
import { ImageLightbox } from './ImageLightbox'

export function ProductsCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [lightbox, setLightbox] = useState<{
    open: boolean
    src: string
    alt: string
  }>({ open: false, src: '', alt: '' })

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    if (!emblaApi) return

    const update = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }

    update()
    emblaApi.on('reInit', update)
    emblaApi.on('select', update)
    return () => {
      emblaApi.off('reInit', update)
      emblaApi.off('select', update)
    }
  }, [emblaApi])

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Nessun prodotto in evidenza (configura Sanity).
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <div
          className="overflow-hidden rounded-xl border border-border bg-card/70 backdrop-blur"
          ref={emblaRef}
        >
          <div className="flex">
            {products.map((p) => (
              <div
                key={p.id}
                className="min-w-0 flex-[0_0_100%] p-4 lg:flex-[0_0_33.333%]"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-card/60">
                  <div className="aspect-[4/3] bg-muted">
                    {p.imageUrl ? (
                      <button
                        type="button"
                        className="h-full w-full"
                        onClick={() =>
                          setLightbox({ open: true, src: p.imageUrl!, alt: p.title })
                        }
                        aria-label="Apri immagine"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        Immagine mancante
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border bg-background/30 p-4 backdrop-blur">
                    <div className="text-sm font-semibold">{p.title}</div>
                    {p.description ? (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {p.description}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 lg:hidden">
          <button
            type="button"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-lg font-semibold text-foreground backdrop-blur transition hover:bg-muted disabled:opacity-40"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Prodotti precedenti"
            disabled={!canPrev}
          >
            ‹
          </button>
          <button
            type="button"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-lg font-semibold text-foreground backdrop-blur transition hover:bg-muted disabled:opacity-40"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Prodotti successivi"
            disabled={!canNext}
          >
            ›
          </button>
        </div>
      </div>

      {lightbox.open ? (
        <ImageLightbox
          open={lightbox.open}
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox({ open: false, src: '', alt: '' })}
        />
      ) : null}
    </>
  )
}
