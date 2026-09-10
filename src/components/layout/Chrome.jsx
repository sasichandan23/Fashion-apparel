import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { ArrowUp, Check, Info, TriangleAlert } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { cn } from '../../lib/utils'

/* ---------------------------- scroll progress ---------------------------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left"
      aria-hidden
    >
      <div className="h-full w-full bg-gradient-to-r from-brand via-rose to-amber" />
    </motion.div>
  )
}

/* ----------------------------- custom cursor ----------------------------- */
export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 320, damping: 26, mass: 0.5 })
  const [variant, setVariant] = useState('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    document.body.classList.add('custom-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      const interactive =
        e.target instanceof Element && e.target.closest('a, button, input, textarea, select, [role="button"]')
      setVariant(el?.getAttribute('data-cursor') || (interactive ? 'link' : 'default'))
    }
    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.body.classList.remove('custom-cursor')
    }
  }, [x, y, visible])

  const isText = variant !== 'default' && variant !== 'link'
  const size = isText ? 84 : variant === 'link' ? 52 : 30

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden lg:block" aria-hidden>
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0 }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{ width: size, height: size, opacity: variant === 'default' ? 0.75 : 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          className={cn(
            'flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-[0.16em] text-white',
            isText
              ? 'bg-gradient-to-br from-brand via-rose to-amber'
              : 'border border-ink/60 bg-ink/5 backdrop-blur-[2px] dark:border-white/50'
          )}
        >
          {isText && variant}
        </motion.div>
      </motion.div>
      <motion.div
        style={{ x, y }}
        animate={{ opacity: visible && !isText ? 1 : 0 }}
        className="absolute left-0 top-0"
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand to-rose" />
      </motion.div>
    </div>
  )
}

/* -------------------------------- preloader ------------------------------- */
const INTRO_MS = 1500

export function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    // Time-based so the intro always lasts exactly INTRO_MS, whatever the
    // frame rate or how many times effects are re-run in development.
    const start = performance.now()
    let raf

    const finish = () => {
      setProgress(100)
      setGone(true)
      done.current?.()
    }

    // rAF is suspended while a tab is in the background. Nobody is watching an
    // intro they cannot see, so skip straight to the site.
    if (document.hidden) {
      finish()
      return
    }

    const tick = (now) => {
      const p = Math.min((now - start) / INTRO_MS, 1)
      setProgress(Math.round((1 - Math.pow(1 - p, 2)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)

    // Hard safety net: if rAF is throttled (background tab), never trap the user.
    const bail = setTimeout(finish, INTRO_MS + 900)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(bail)
    }
  }, [])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: 'blur(14px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 aurora opacity-40" />
          <div className="relative flex flex-col items-center gap-7 px-6">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[13vw] font-normal leading-none tracking-[-0.03em] sm:text-7xl"
              >
                AURÉLIA
              </motion.h1>
            </div>
            <div className="h-px w-[min(70vw,320px)] overflow-hidden bg-line">
              <motion.div
                className="h-full bg-gradient-to-r from-brand via-rose to-amber"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="eyebrow"
            >
              Considered fashion · {Math.round(progress)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* --------------------------------- toasts -------------------------------- */
const toneIcon = { success: Check, warn: TriangleAlert, default: Info }

export function Toaster() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[150] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col items-center gap-2 sm:bottom-8">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const Icon = toneIcon[t.tone] || Info
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 26, scale: 0.94, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 14, scale: 0.96, filter: 'blur(6px)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="glass pointer-events-auto flex w-full items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
            >
              <span
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full text-white',
                  t.tone === 'success' && 'bg-jade',
                  t.tone === 'warn' && 'bg-amber',
                  (!t.tone || t.tone === 'default') && 'bg-gradient-to-br from-brand to-rose'
                )}
              >
                <Icon size={14} strokeWidth={3} />
              </span>
              <p className="text-sm font-medium">{t.message}</p>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------- back to top ------------------------------ */
export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="glass fixed bottom-6 right-5 z-[120] grid h-12 w-12 place-items-center rounded-full shadow-xl sm:right-8"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* --------------------------- scroll restoration --------------------------- */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
