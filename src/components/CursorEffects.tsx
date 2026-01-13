import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

function isInteractivePointer() {
  // Avoid showing cursor FX on touch-first devices.
  return typeof window !== 'undefined' && window.matchMedia('(pointer:fine)').matches
}

export function CursorEffects() {
  const reduced = usePrefersReducedMotion()
  const glowRef = useRef<HTMLDivElement | null>(null)
  const ripplesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (reduced) return
    if (!isInteractivePointer()) return

    let hideTimer: number | null = null
    let raf = 0
    let lastX = 0
    let lastY = 0

    const setGlowVisible = (visible: boolean) => {
      const el = glowRef.current
      if (!el) return
      el.dataset.visible = visible ? 'true' : 'false'
    }

    const setGlowPos = (x: number, y: number) => {
      const el = glowRef.current
      if (!el) return
      el.style.setProperty('--cursor-x', `${x}px`)
      el.style.setProperty('--cursor-y', `${y}px`)
    }

    const schedulePos = (x: number, y: number) => {
      lastX = x
      lastY = y
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setGlowPos(lastX, lastY))
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return

      schedulePos(e.clientX, e.clientY)
      setGlowVisible(true)

      if (hideTimer) window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => setGlowVisible(false), 550)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return

      setGlowVisible(true)
      if (hideTimer) window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => setGlowVisible(false), 650)

      const host = ripplesRef.current
      if (!host) return

      const ripple = document.createElement('div')
      ripple.className = 'cursor-ripple'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`

      const remove = () => ripple.remove()
      ripple.addEventListener('animationend', remove, { once: true })
      host.appendChild(ripple)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    return () => {
      if (hideTimer) window.clearTimeout(hideTimer)
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [reduced])

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={glowRef} className="cursor-glow" data-visible="false" />
      <div ref={ripplesRef} className="cursor-ripples" />
    </div>
  )
}
