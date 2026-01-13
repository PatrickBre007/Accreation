import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(options?: {
  rootMargin?: string
  threshold?: number
  once?: boolean
}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const visible = Boolean(entry?.isIntersecting)
        if (visible) {
          setInView(true)
          if (options?.once !== false) observer.disconnect()
        } else if (options?.once === false) {
          setInView(false)
        }
      },
      {
        root: null,
        rootMargin: options?.rootMargin ?? '0px 0px -10% 0px',
        threshold: options?.threshold ?? 0.15,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.once, options?.rootMargin, options?.threshold])

  return { ref, inView }
}
