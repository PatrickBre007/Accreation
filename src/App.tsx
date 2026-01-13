import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoadingScreen } from './components/LoadingScreen'
import { CartPage } from './pages/CartPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { SuccessPage } from './pages/SuccessPage'

export default function App() {
  const [splash, setSplash] = useState(() => {
    try {
      return sessionStorage.getItem('ac_splash_seen') !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!splash) return

    let cancelled = false
    const start = performance.now()
    const minMs = 900

    const done = async () => {
      try {
        // Keep the splash until fonts are ready (if supported), but never shorter than minMs.
        await (document as unknown as { fonts?: { ready: Promise<void> } }).fonts?.ready
      } catch {
        // ignore
      }

      const elapsed = performance.now() - start
      const wait = Math.max(0, minMs - elapsed)
      window.setTimeout(() => {
        if (cancelled) return
        setSplash(false)
        try {
          sessionStorage.setItem('ac_splash_seen', '1')
        } catch {
          // ignore
        }
      }, wait)
    }

    done()
    return () => {
      cancelled = true
    }
  }, [splash])

  return (
    <>
      <LoadingScreen active={splash} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/prodotti" element={<ProductsPage />} />
          <Route path="/contattaci" element={<ContactPage />} />
          <Route path="/carrello" element={<CartPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
