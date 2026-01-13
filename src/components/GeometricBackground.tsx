export function GeometricBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-hero-glow opacity-80" />

      {/* Geometric shapes */}
      <div className="absolute -left-28 -top-24 h-80 w-80 animate-floaty rounded-[4rem] bg-metal-gold/14 blur-[2px] [transform:translateY(calc(var(--scrollY)*0.02px))]" />
      <div className="absolute -right-28 top-16 h-96 w-96 animate-floaty rounded-[999px] bg-metal-copper/10 blur-[2px] [animation-delay:1.2s] [transform:translateY(calc(var(--scrollY)*0.03px))]" />
      <div className="absolute left-1/2 top-[26rem] h-72 w-72 -translate-x-1/2 rotate-6 rounded-[5rem] bg-metal-silver/12 blur-[2px] [animation-delay:2.4s] [transform:translate(-50%,0)_translateY(calc(var(--scrollY)*0.018px))]" />
    </div>
  )
}
