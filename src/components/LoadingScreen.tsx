import { useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import logoUrl from '../assets/media/logo/ChatGPT Image 13 gen 2026, 15_24_08.png'

export function LoadingScreen({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [rendered, setRendered] = useState(false)

  const phaseClass = active ? 'splash-in' : 'splash-out'

  const subtitle = useMemo(() => {
    return 'Natura e innovazione per realizzare gioielli.'
  }, [])

  if (reduced) {
    if (!active) return null
  } else {
    if (!active && !rendered) return null
  }

  return (
    <div
      className={
        'fixed inset-0 z-[9999] grid place-items-center bg-background ' +
        'px-6 py-10 text-foreground ' +
        phaseClass
      }
      onAnimationStart={(e) => {
        if (e.target !== e.currentTarget) return
        if (reduced) return
        if (active && !rendered) setRendered(true)
      }}
      onAnimationEnd={(e) => {
        if (e.target !== e.currentTarget) return
        if (reduced) return
        if (!active && e.animationName === 'splash-out') setRendered(false)
      }}
      role="status"
      aria-live="polite"
      aria-label="Caricamento"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/35 to-background/75" />

      {/* twinkles */}
      {reduced ? null : (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="twinkle absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-metal-gold/70" />
          <div
            className="twinkle absolute left-[70%] top-[22%] h-1.5 w-1.5 rounded-full bg-metal-silver/70"
            style={{ animationDelay: '900ms' }}
          />
          <div
            className="twinkle absolute left-[30%] top-[72%] h-2 w-2 rounded-full bg-metal-copper/60"
            style={{ animationDelay: '1400ms' }}
          />
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className={(reduced ? '' : 'animate-floaty ') + 'relative'}>
          <img
            src={logoUrl}
            alt="Logo AC Creation"
            className="h-24 w-24 object-contain [filter:drop-shadow(0_0_34px_rgba(16,185,129,0.95))_brightness(1.45)_contrast(1.25)] sm:h-28 sm:w-28"
            decoding="async"
            loading="eager"
          />
        </div>

        <div className="mt-5 text-sm font-semibold tracking-[0.18em]">AC CREATION</div>
        <div className="mt-2 max-w-prose text-sm text-muted-foreground">{subtitle}</div>

        <div className="mt-6 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-background/10">
            <div
              className={
                'h-full w-1/3 rounded-full bg-emerald-300/60 ' +
                (reduced ? '' : 'splash-bar')
              }
            />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Caricamento in corso…</div>
        </div>
      </div>
    </div>
  )
}
