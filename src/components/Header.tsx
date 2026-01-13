import { NavLink } from 'react-router-dom'
import { cartItemsCount, useCartStore } from '../store/cart'
import logoUrl from '../assets/media/logo/ChatGPT Image 13 gen 2026, 15_24_08.png'

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6l-2-3H1" />
      <path d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  )
}

const linkBase =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full border px-3 py-1.5 text-sm font-semibold no-underline hover:no-underline ' +
  'motion-safe:transition motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 active:translate-y-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[220%] before:rotate-12 ' +
  'before:bg-gradient-to-r before:from-transparent before:via-emerald-200/18 before:to-transparent before:opacity-0 ' +
  'motion-safe:before:transition motion-safe:before:duration-700 motion-safe:before:ease-out ' +
  'motion-safe:hover:before:translate-x-[320%] motion-safe:hover:before:opacity-100 motion-reduce:before:hidden'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return (
    linkBase +
    ' border-emerald-400/15 bg-emerald-400/5 text-foreground/75 hover:border-emerald-300/25 hover:bg-emerald-300/10 hover:text-foreground' +
    (isActive
      ? ' border-emerald-300/30 bg-emerald-300/12 text-foreground'
      : '')
  )
}

export function Header() {
  const items = useCartStore((s) => s.items)
  const count = cartItemsCount(items)

  return (
    <header className="relative z-10 border-b border-border bg-background/70 backdrop-blur transition [box-shadow:0_0_0_0_rgba(0,0,0,0)] [background-color:color-mix(in_hsl,hsl(var(--background))_70%,transparent)] [box-shadow:0_18px_40px_-28px_hsl(var(--foreground)/0.28)] [opacity:calc(0.92+var(--scrolled)*0.08)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-5 sm:py-5">
        <NavLink to="/" className="group flex items-center gap-3 no-underline">
          <span className="relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20">
            <img
              src={logoUrl}
              alt="Logo AC Creation"
              className="h-14 w-14 object-contain [filter:drop-shadow(0_0_28px_rgba(16,185,129,0.95))_brightness(1.45)_contrast(1.25)] sm:h-18 sm:w-18"
              loading="eager"
              decoding="async"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.12em] drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
              AC CREATION
            </span>
            <span className="text-xs text-muted-foreground">
              pietre naturali e metalli
            </span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-3 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/prodotti" className={navLinkClass}>
            Prodotti
          </NavLink>
          <NavLink to="/contattaci" className={navLinkClass}>
            Contattaci
          </NavLink>
        </nav>

        <NavLink
          to="/carrello"
          data-cart-target
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-2 text-sm font-semibold text-foreground no-underline backdrop-blur motion-safe:transition motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 active:translate-y-0 hover:border-emerald-200/30 hover:bg-emerald-200/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[220%] before:rotate-12 before:bg-gradient-to-r before:from-transparent before:via-emerald-200/18 before:to-transparent before:opacity-0 motion-safe:before:transition motion-safe:before:duration-700 motion-safe:before:ease-out motion-safe:hover:before:translate-x-[320%] motion-safe:hover:before:opacity-100 motion-reduce:before:hidden"
        >
          <CartIcon />
          <span className="hidden sm:inline">Carrello</span>
          <span className="inline-flex min-w-6 items-center justify-center rounded-md border border-emerald-300/15 bg-emerald-300/10 px-2 py-0.5 text-xs text-foreground/80">
            {count}
          </span>
        </NavLink>
      </div>

      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 px-4 pb-4 sm:px-5 sm:pb-5 md:hidden">
        <NavLink to="/" className={navLinkClass} end>
          Home
        </NavLink>
        <NavLink to="/prodotti" className={navLinkClass}>
          Prodotti
        </NavLink>
        <NavLink to="/contattaci" className={navLinkClass}>
          Contattaci
        </NavLink>
      </nav>
    </header>
  )
}
