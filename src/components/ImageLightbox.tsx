import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function ImageLightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean
  src: string
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/70 backdrop-blur"
        onClick={onClose}
        aria-label="Chiudi"
      />
      <div className="pointer-events-none absolute inset-0 bg-metal-sheen opacity-20" />

      <div className="relative z-10 grid h-full w-full place-items-center p-4">
        <div className="pointer-events-auto relative overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 text-lg font-semibold leading-none text-foreground backdrop-blur transition hover:bg-muted"
          >
            ×
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[82vh] w-auto max-w-[92vw] object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
