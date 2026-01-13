import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

export function Tilt({
  children,
  className,
  maxTilt = 10,
  perspective = 900,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  perspective?: number
}) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)

  const style = useMemo(() => {
    if (reduced) return undefined
    return {
      transformStyle: 'preserve-3d' as const,
      perspective: `${perspective}px`,
    }
  }, [perspective, reduced])

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    const tiltY = (px - 0.5) * (maxTilt * 2)
    const tiltX = (0.5 - py) * (maxTilt * 2)

    el.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
    el.style.setProperty('--tilt-s', '1.02')
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', `0deg`)
    el.style.setProperty('--tilt-y', `0deg`)
    el.style.setProperty('--tilt-s', '1')
  }

  return (
    <div
      ref={ref}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={[
        'tilt3d',
        'transition-transform duration-300',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}
