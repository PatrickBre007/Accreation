import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { fetchFeaturedProducts, type Product } from '../lib/sanity'
import { ProductsCarousel } from '../components/ProductsCarousel'
import { Reveal } from '../components/Reveal'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import heroVideoFile from '../assets/media/video/video.mp4'
import step01Img from '../assets/media/images/Gemini_Generated_Image_ix74i8ix74i8ix74.png'
import step02Img from '../assets/media/images/Gemini_Generated_Image_jv7vqljv7vqljv7v.png'
import step03Img from '../assets/media/images/Gemini_Generated_Image_mrhwj1mrhwj1mrhw.png'
import step04Img from '../assets/media/images/Gemini_Generated_Image_ou4wizou4wizou4w.png'
import step05Img from '../assets/media/images/ChatGPT Image 6 gen 2026, 10_38_46.png'
import step06Img from '../assets/media/images/ChatGPT Image 8 gen 2026, 17_33_49.png'

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const reduced = usePrefersReducedMotion()

  const envHeroVideoUrl = (
    import.meta.env.VITE_HERO_VIDEO_URL as string | undefined
  )?.trim()
  const heroVideoUrl = envHeroVideoUrl ? envHeroVideoUrl : heroVideoFile
  const showVideo = heroVideoUrl.trim().length > 0

  useEffect(() => {
    let cancelled = false
    fetchFeaturedProducts(6)
      .then((data) => {
        if (!cancelled) setFeatured(data)
      })
      .catch(() => {
        if (!cancelled) setFeatured([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-12">
      {/* HERO — Impatto: natura + pietre */}
      <Reveal variant="blur" durationMs={1100}>
        <section className="relative -mx-4 min-h-[72vh] overflow-hidden border-y border-border bg-card/60 backdrop-blur sm:mx-0 sm:min-h-[68vh] sm:rounded-3xl sm:border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-30" />

          {/* Video background (opzionale) */}
          {showVideo ? (
            <video
              className={
                (reduced ? '' : 'hero-parallax ') +
                'absolute inset-0 h-full w-full object-cover opacity-85'
              }
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : null}

          {/* Darkening overlays for readability */}
          <div className="pointer-events-none absolute inset-0 bg-background/35" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/25 to-background/60" />

          <div className="relative grid gap-8 px-4 py-20 sm:p-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-muted-foreground">
                  AC CREATION
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-metal-gold/12 px-3 py-1 text-[11px] font-semibold text-foreground">
                  pietre naturali
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-metal-silver/10 px-3 py-1 text-[11px] font-semibold text-foreground">
                  ispirazione natura
                </span>
              </div>

              {/* Floating accent dots */}
              {reduced ? null : (
                <div className="pointer-events-none absolute right-6 top-6 hidden sm:block">
                  <div className="twinkle h-2 w-2 rounded-full bg-metal-gold/70" />
                  <div className="twinkle mt-8 h-1.5 w-1.5 rounded-full bg-metal-silver/70" style={{ animationDelay: '900ms' }} />
                  <div className="twinkle mt-10 h-2 w-2 rounded-full bg-metal-copper/60" style={{ animationDelay: '1400ms' }} />
                </div>
              )}

              <h1 className="mt-5 text-4xl font-semibold tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] sm:text-6xl">
                Pietre naturali.
                <span className="block text-foreground/80">
                  Natura che diventa luce.
                </span>
              </h1>

              <p className="mt-4 max-w-prose text-sm text-muted-foreground drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
                Pietre vere, venature irripetibili, riflessi morbidi. Gioielli
                handmade che nascono dalla pietra e si completano nel metallo.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <NavLink
                  to="/prodotti"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Scopri i nostri prodotti
                </NavLink>
                <NavLink
                  to="/contattaci"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-background/10 px-4 py-2 text-sm font-semibold text-foreground no-underline backdrop-blur transition hover:-translate-y-0.5 hover:bg-muted"
                >
                  Contattaci
                </NavLink>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                <Reveal variant="up" delayMs={0}>
                  <div
                    className={(reduced ? '' : 'animate-floaty ') + 'glow rounded-2xl border border-border bg-background/10 p-5 backdrop-blur'}
                    style={reduced ? undefined : { animationDelay: '0ms' }}
                  >
                    <div className="text-sm font-semibold">Pietre naturali</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Ogni pietra è diversa: colore, venature, energia.
                    </div>
                  </div>
                </Reveal>
                <Reveal variant="up" delayMs={120}>
                  <div
                    className={(reduced ? '' : 'animate-floaty ') + 'glow rounded-2xl border border-border bg-background/10 p-5 backdrop-blur'}
                    style={reduced ? undefined : { animationDelay: '500ms' }}
                  >
                    <div className="text-sm font-semibold">Texture e venature</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Colori reali, imperfezioni belle, energia naturale.
                    </div>
                  </div>
                </Reveal>
                <Reveal variant="up" delayMs={240}>
                  <div
                    className={(reduced ? '' : 'animate-floaty ') + 'glow rounded-2xl border border-border bg-background/10 p-5 backdrop-blur'}
                    style={reduced ? undefined : { animationDelay: '900ms' }}
                  >
                    <div className="text-sm font-semibold">Ogni pietra è unica</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Nessuna è uguale: scegli quella che ti somiglia.
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Prodotti</h2>
            <p className="text-sm text-muted-foreground">
              Una selezione di creazioni con pietre naturali.
            </p>
          </div>
          <NavLink
            to="/prodotti"
            className="text-sm font-semibold no-underline hover:underline"
          >
            Vedi tutti →
          </NavLink>
        </div>

        <ProductsCarousel products={featured} />
      </section>
      </Reveal>

      {/* RACCONTO — dark panel per spezzare il bianco */}
      <section className="grid gap-8 rounded-3xl border border-border bg-card/70 p-8 backdrop-blur md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Reveal variant="left">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Dalla pietra al gioiello
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Si parte dalla natura: scelta della pietra, palette e venature.
                Poi metallo, montatura e finitura: tutto fatto a mano.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3">
            <Reveal delayMs={0} variant="up">
              <div className="rounded-2xl border border-border bg-background/10 p-5 backdrop-blur">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  01
                </div>
                <div className="mt-1 text-sm font-semibold">Scelta della pietra</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Colore, venature, taglio: la pietra decide il carattere.
                </div>
              </div>
            </Reveal>
            <Reveal delayMs={120} variant="up">
              <div className="rounded-2xl border border-border bg-background/10 p-5 backdrop-blur">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  02
                </div>
                <div className="mt-1 text-sm font-semibold">Palette naturale</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Abbinamenti e contrasti: luce, profondità, equilibrio.
                </div>
              </div>
            </Reveal>
            <Reveal delayMs={240} variant="up">
              <div className="rounded-2xl border border-border bg-background/10 p-5 backdrop-blur">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  03
                </div>
                <div className="mt-1 text-sm font-semibold">Forma e montatura</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Metalli e linee pulite che esaltano la pietra, senza coprirla.
                </div>
              </div>
            </Reveal>
            <Reveal delayMs={360} variant="up">
              <div className="rounded-2xl border border-border bg-background/10 p-5 backdrop-blur">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  04
                </div>
                <div className="mt-1 text-sm font-semibold">Luce finale</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Lucidatura, controllo e micro-dettagli: l’ultimo 10% fa tutto.
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" delayMs={120}>
            <div className="flex flex-wrap items-center gap-3">
              <NavLink
                to="/prodotti"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline shadow-sm transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Esplora la collezione
              </NavLink>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-4">
          <Reveal variant="right" durationMs={1100}>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6">
              <div className="glow overflow-hidden rounded-2xl border border-border bg-background/10">
                <div className="aspect-[4/3]">
                  <img
                    src={step01Img}
                    alt="Scelta della pietra"
                    className="h-full w-full object-cover opacity-95"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="glow overflow-hidden rounded-2xl border border-border bg-background/10">
                <div className="aspect-[4/3]">
                  <img
                    src={step02Img}
                    alt="Palette naturale"
                    className="h-full w-full object-cover opacity-95"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="glow overflow-hidden rounded-2xl border border-border bg-background/10">
                <div className="aspect-[4/3]">
                  <img
                    src={step03Img}
                    alt="Forma e montatura"
                    className="h-full w-full object-cover opacity-95"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="glow overflow-hidden rounded-2xl border border-border bg-background/10">
                <div className="aspect-[4/3]">
                  <img
                    src={step04Img}
                    alt="Luce finale"
                    className="h-full w-full object-cover opacity-95"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="glow overflow-hidden rounded-2xl border border-border bg-background/10">
                <div className="aspect-[4/3]">
                  <img
                    src={step05Img}
                    alt="Dettagli lavorazione"
                    className="h-full w-full object-cover opacity-95"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="glow overflow-hidden rounded-2xl border border-border bg-background/10">
                <div className="aspect-[4/3]">
                  <img
                    src={step06Img}
                    alt="Dettagli gioiello"
                    className="h-full w-full object-cover opacity-95"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delayMs={120}>
            <div className="rounded-2xl border border-border bg-background/10 p-5 text-sm text-muted-foreground backdrop-blur">
              Dettagli, venature e riflessi: la parte “materica” del processo.
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 rounded-2xl border border-border bg-card/80 p-8 backdrop-blur md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold tracking-tight">Come lavoriamo</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Un processo semplice, trasparente, orientato alla qualità.
            </p>
          </div>
          <div className="grid gap-4 md:col-span-2">
            <Reveal variant="up" delayMs={0}>
              <div className="glow rounded-xl border border-border bg-background/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-background/80">
                <div className="text-sm font-semibold">1) Idee e bozzetti</div>
                <div className="text-xs text-muted-foreground">
                  Linee pulite, proporzioni, materiali.
                </div>
              </div>
            </Reveal>
            <Reveal variant="up" delayMs={120}>
              <div className="glow rounded-xl border border-border bg-background/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-background/80">
                <div className="text-sm font-semibold">2) Realizzazione</div>
                <div className="text-xs text-muted-foreground">
                  Assemblaggio manuale e finiture controllate.
                </div>
              </div>
            </Reveal>
            <Reveal variant="up" delayMs={240}>
              <div className="glow rounded-xl border border-border bg-background/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-background/80">
                <div className="text-sm font-semibold">3) Spedizione</div>
                <div className="text-xs text-muted-foreground">
                  Preparazione ordine e tracciamento.
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
