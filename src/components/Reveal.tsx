import type { ReactNode } from 'react'
import { useInView } from '../lib/useInView'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

export function Reveal({
  children,
  className,
  variant,
  delayMs,
  durationMs,
  once,
  rootMargin,
}: {
  children: ReactNode
  className?: string
  variant?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur'
  delayMs?: number
  durationMs?: number
  once?: boolean
  rootMargin?: string
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({
    once: once ?? true,
    rootMargin,
  })

  const visible = reduced || inView

  const hiddenClass = (() => {
    switch (variant) {
      case 'down':
        return 'opacity-0 -translate-y-6'
      case 'left':
        return 'opacity-0 translate-x-6'
      case 'right':
        return 'opacity-0 -translate-x-6'
      case 'scale':
        return 'opacity-0 scale-[0.98]'
      case 'blur':
        return 'opacity-0 translate-y-4 blur-[6px]'
      case 'up':
      default:
        return 'opacity-0 translate-y-6'
    }
  })()

  const shownClass = variant === 'blur' ? 'opacity-100 translate-y-0 blur-0' : 'opacity-100 translate-y-0 translate-x-0 scale-100'

  return (
    <div
      ref={ref}
      className={[
        'transition will-change-transform',
        visible ? shownClass : hiddenClass,
        className ?? '',
      ].join(' ')}
      style={
        reduced
          ? undefined
          : {
              transitionDelay: delayMs ? `${delayMs}ms` : undefined,
              transitionDuration: `${durationMs ?? 900}ms`,
            }
      }
    >
      {children}
    </div>
  )
}
