import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import { StoreProvider } from './context/StoreContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/shop/CartDrawer'
import { BackToTop, CustomCursor, Preloader, ScrollProgress, ScrollToTop, Toaster } from './components/layout/Chrome'

import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Compare from './pages/Compare'
import About from './pages/About'
import Journal from './pages/Journal'
import JournalPost from './pages/JournalPost'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}

/**
 * Routes animate in on mount. We deliberately do NOT use `AnimatePresence
 * mode="wait"` here: that holds the incoming page back until the outgoing
 * one finishes animating, so any interrupted exit (a backgrounded tab
 * suspends rAF) would leave the site stuck on the previous page.
 */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/shop" element={<Page><Shop /></Page>} />
        <Route path="/product/:slug" element={<Page><Product /></Page>} />
        <Route path="/cart" element={<Page><Cart /></Page>} />
        <Route path="/checkout" element={<Page><Checkout /></Page>} />
        <Route path="/wishlist" element={<Page><Wishlist /></Page>} />
        <Route path="/compare" element={<Page><Compare /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/journal" element={<Page><Journal /></Page>} />
        <Route path="/journal/:slug" element={<Page><JournalPost /></Page>} />
        <Route path="/contact" element={<Page><Contact /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <StoreProvider>
      <Preloader onDone={() => setReady(true)} />
      <CustomCursor />
      <ScrollProgress />
      <ScrollToTop />

      <div className={ready ? 'opacity-100' : 'opacity-0'}>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>

      <CartDrawer />
      <Toaster />
      <BackToTop />
    </StoreProvider>
  )
}
