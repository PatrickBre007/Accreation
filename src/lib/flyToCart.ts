export type FlyToCartOptions = {
  sourceEl: HTMLElement
  targetEl: HTMLElement
  reducedMotion?: boolean
}

export function flyToCart({ sourceEl, targetEl, reducedMotion }: FlyToCartOptions) {
  if (typeof window === 'undefined') return
  if (reducedMotion) return

  // Quick “selection” feedback on click.
  try {
    sourceEl.animate(
      [
        { transform: 'translate3d(0,0,0) scale(1)', filter: 'saturate(1)' },
        { transform: 'translate3d(0,-2px,0) scale(1.01)', filter: 'saturate(1.08)' },
        { transform: 'translate3d(0,0,0) scale(1)', filter: 'saturate(1)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)' },
    )
  } catch {
    // ignore
  }

  const sourceRect = sourceEl.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()

  if (!Number.isFinite(sourceRect.left) || !Number.isFinite(targetRect.left)) return

  const startCenterX = sourceRect.left + sourceRect.width / 2
  const startCenterY = sourceRect.top + sourceRect.height / 2
  const endCenterX = targetRect.left + targetRect.width / 2
  const endCenterY = targetRect.top + targetRect.height / 2

  const dx = endCenterX - startCenterX
  const dy = endCenterY - startCenterY
  const distance = Math.hypot(dx, dy)

  // Animate the product image (visible + clear), then shrink into the cart.
  const startW = Math.max(1, sourceRect.width)
  const startH = Math.max(1, sourceRect.height)
  const startScale = 1
  const endScale = 0.14

  const computed = window.getComputedStyle(sourceEl)
  const borderRadius = computed.borderRadius || '14px'

  let imageSrc: string | null = null
  if (sourceEl instanceof HTMLImageElement) {
    imageSrc = sourceEl.currentSrc || sourceEl.src
  } else {
    const img = sourceEl.querySelector('img') as HTMLImageElement | null
    imageSrc = img ? img.currentSrc || img.src : null
  }

  // Container moves & scales; inner content stays “card-like”.
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = `${sourceRect.left}px`
  container.style.top = `${sourceRect.top}px`
  container.style.width = `${startW}px`
  container.style.height = `${startH}px`
  container.style.margin = '0'
  container.style.pointerEvents = 'none'
  container.style.zIndex = '9999'
  container.style.transformOrigin = 'center center'
  container.style.willChange = 'transform, opacity, filter'

  const glow = document.createElement('div')
  glow.style.position = 'absolute'
  glow.style.inset = '-14px'
  glow.style.borderRadius = `calc(${borderRadius} + 14px)`
  glow.style.background =
    'radial-gradient(900px circle at 20% 10%, hsl(var(--metal-gold) / 0.22), transparent 55%), radial-gradient(900px circle at 85% 35%, hsl(var(--metal-copper) / 0.18), transparent 60%), radial-gradient(900px circle at 40% 90%, hsl(var(--metal-silver) / 0.16), transparent 60%)'
  glow.style.filter = 'blur(14px)'
  glow.style.opacity = '0.0'

  const node = document.createElement('div')
  node.style.width = '100%'
  node.style.height = '100%'
  node.style.borderRadius = borderRadius
  node.style.overflow = 'hidden'
  node.style.boxShadow = '0 28px 70px -48px rgba(0,0,0,0.7)'
  node.style.background = imageSrc
    ? `center / cover no-repeat url(${JSON.stringify(imageSrc).slice(1, -1)})`
    : computed.backgroundColor

  const sheen = document.createElement('div')
  sheen.style.position = 'absolute'
  sheen.style.inset = '0'
  sheen.style.borderRadius = borderRadius
  sheen.style.pointerEvents = 'none'
  sheen.style.background =
    'linear-gradient(120deg, transparent 15%, rgba(255,255,255,0.06), transparent 35%, rgba(255,255,255,0.04), transparent 60%)'
  sheen.style.opacity = '0.0'

  container.appendChild(glow)
  container.appendChild(node)
  container.appendChild(sheen)
  document.body.appendChild(container)

  const midX = dx * 0.55
  const midY = dy * 0.35 - Math.min(80, distance * 0.08)

  const duration = Math.max(820, Math.min(1500, 820 + distance * 0.6))

  // Animate the glow + sheen for a more premium feel.
  glow.animate([{ opacity: 0 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }], {
    duration,
    easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
    fill: 'forwards',
  })

  sheen.animate([{ opacity: 0 }, { opacity: 0.55, offset: 0.4 }, { opacity: 0 }], {
    duration,
    easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
    fill: 'forwards',
  })

  const animation = container.animate(
    [
      {
        transform: `translate3d(0px, 0px, 0) scale(${startScale})`,
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate3d(${midX}px, ${midY}px, 0) scale(${0.72})`,
        opacity: 0.98,
        offset: 0.7,
      },
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${endScale})`,
        opacity: 0,
        offset: 1,
      },
    ],
    {
      duration,
      easing: 'cubic-bezier(0.15, 0.9, 0.2, 1)',
      fill: 'forwards',
    },
  )

  animation.onfinish = () => {
    container.remove()

    // “Landing” feedback on the cart.
    try {
      targetEl.animate(
        [
          { transform: 'translate3d(0,0,0) scale(1)' },
          { transform: 'translate3d(0,-1px,0) scale(1.06)' },
          { transform: 'translate3d(0,0,0) scale(1)' },
        ],
        { duration: 360, easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)' },
      )
    } catch {
      // ignore
    }
  }

  animation.oncancel = () => {
    container.remove()
  }
}
