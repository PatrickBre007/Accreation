import { useEffect } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

export function ScrollEffects() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    let raf = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0
        document.documentElement.style.setProperty('--scrollY', String(y))
        document.documentElement.style.setProperty(
          '--scrolled',
          y > 8 ? '1' : '0',
        )
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return null
}
