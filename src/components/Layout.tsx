import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { GeometricBackground } from './GeometricBackground'
import { CursorEffects } from './CursorEffects'
import { ScrollEffects } from './ScrollEffects'

export function Layout() {
  const { pathname } = useLocation()
  const hideFooter = pathname === '/contattaci' || pathname === '/carrello'

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <ScrollEffects />
      <GeometricBackground />
      <CursorEffects />
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-5 sm:py-12">
        <Outlet />
      </main>
      {!hideFooter ? (
        <div className="relative z-10">
          <Footer />
        </div>
      ) : null}
    </div>
  )
}
