import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn, img as imgUrl, placeholder } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/* SmartImage — fades in, and degrades to a generated gradient on error */
/* ------------------------------------------------------------------ */
export function SmartImage({ id, alt = '', w = 900, className, imgClassName, imgStyle, priority = false, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const src = failed ? placeholder(id || alt) : imgUrl(id, w)

  return (
    <span className={cn('relative block overflow-hidden bg-bg2', className)} {...rest}>
      {!loaded && <span className="absolute inset-0 shimmer opacity-40" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed) setFailed(true)
          setLoaded(true)
        }}
        style={imgStyle}
        className={cn(
          'h-full w-full object-cover transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]',
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-105',
          imgClassName
        )}
      />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* useSafeInView                                                        */
/*                                                                      */
/* Framer's whileInView relies on IntersectionObserver. In some          */
/* embedded/headless webviews the observer never fires, which would      */
/* leave every revealed element permanently invisible. This hook adds a  */
/* timeout fallback so content ALWAYS ends up visible, whatever the      */
/* host browser does.                                                    */
/* ------------------------------------------------------------------ */
export function useSafeInView({ once = true, margin = '-70px', fallback = 700 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let observed = false
    let io

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          observed = true
          for (const e of entries) {
            if (e.isIntersecting) {
              setInView(true)
              if (once) io.disconnect()
            } else if (!once) {
              setInView(false)
            }
          }
        },
        { rootMargin: margin }
      )
      io.observe(el)
    }

    // If the observer never reported anything, reveal regardless.
    const t = setTimeout(() => {
      if (!observed) setInView(true)
    }, fallback)

    return () => {
      clearTimeout(t)
      io?.disconnect()
    }
  }, [once, margin, fallback])

  return [ref, inView]
}

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered entrance                                   */
/* ------------------------------------------------------------------ */
const dirMap = {
  up: { y: 42, x: 0 },
  down: { y: -42, x: 0 },
  left: { x: 52, y: 0 },
  right: { x: -52, y: 0 },
  none: { x: 0, y: 0 },
}

export function Reveal({ children, delay = 0, dir = 'up', className, once = true, blur = true, as = 'div' }) {
  const Comp = motion[as] || motion.div
  const offset = dirMap[dir] || dirMap.up
  const [ref, inView] = useSafeInView({ once })

  return (
    <Comp
      ref={ref}
      initial={{ opacity: 0, ...offset, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      animate={inView ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  )
}

/* Generic in-view element — a drop-in for `whileInView` motion elements. */
export function Appear({
  children,
  className,
  from = { opacity: 0, y: 34 },
  to = { opacity: 1, y: 0 },
  delay = 0,
  duration = 0.75,
  as = 'div',
  once = true,
  ...rest
}) {
  const Comp = motion[as] || motion.div
  const [ref, inView] = useSafeInView({ once })
  return (
    <Comp
      ref={ref}
      initial={from}
      animate={inView ? to : from}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/* Staggered container + item */
export function Stagger({ children, className, gap = 0.08, delay = 0 }) {
  const [ref, inView] = useSafeInView({ once: true })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 34, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}

/* ------------------------------------------------------------------ */
/* SplitText — per-character/word entrance for headlines                */
/* ------------------------------------------------------------------ */
export function SplitText({ text, className, delay = 0, stagger = 0.035, once = true }) {
  const words = String(text).split(' ')
  const [ref, inView] = useSafeInView({ once, margin: '-60px' })
  return (
    <span ref={ref} className={cn('inline', className)}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '108%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : { y: '108%', opacity: 0 }}
              transition={{ duration: 0.9, delay: delay + wi * stagger, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {/* The space has to sit OUTSIDE the inline-block, otherwise the
              browser gets no line-break opportunity and long headings
              overflow their container on narrow screens. */}
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Magnetic — element leans toward the cursor                           */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Tilt — 3D card tilt on pointer                                       */
/* ------------------------------------------------------------------ */
export function Tilt({ children, className, max = 9, glare = true }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const smx = useSpring(mx, { stiffness: 180, damping: 20 })
  const smy = useSpring(my, { stiffness: 180, damping: 20 })
  const rotateY = useTransform(smx, [0, 1], [-max, max])
  const rotateX = useTransform(smy, [0, 1], [max, -max])
  const gx = useTransform(smx, [0, 1], ['0%', '100%'])
  const gy = useTransform(smy, [0, 1], ['0%', '100%'])
  const glareBg = useMotionTemplate`radial-gradient(260px circle at ${gx} ${gy}, rgba(255,255,255,.20), transparent 62%)`

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={cn('relative', className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Counter — animates a number up when it scrolls into view             */
/* ------------------------------------------------------------------ */
export function Counter({ to, suffix = '', prefix = '', duration = 1.8, decimals = 0, className }) {
  const [ref, inView] = useSafeInView({ once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee — infinite horizontal scroller                               */
/* ------------------------------------------------------------------ */
export function Marquee({ children, speed = 30, className, pauseOnHover = true, reverse = false }) {
  return (
    <div className={cn('relative overflow-hidden mask-fade-x', pauseOnHover && 'marquee-paused', className)}>
      <div
        className="marquee-track flex w-max items-center"
        style={{ '--speed': `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stars                                                                */
/* ------------------------------------------------------------------ */
export function Stars({ value = 5, size = 13, className, showValue = false }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="inline-flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              'transition-colors',
              i < Math.round(value) ? 'fill-amber text-amber' : 'text-mute/40'
            )}
          />
        ))}
      </span>
      {showValue && <span className="text-xs font-semibold text-soft">{value.toFixed(1)}</span>}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* SectionHeading                                                       */
/* ------------------------------------------------------------------ */
export function SectionHeading({ eyebrow, title, copy, align = 'left', action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        align === 'between' && 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <Reveal dir="none">
            <span className="eyebrow">
              <span className="inline-block h-px w-6 bg-current opacity-60" />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <h2 className="mt-3 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          <SplitText text={title} />
        </h2>
        {copy && (
          <Reveal delay={0.15}>
            <p className="mt-4 text-[15px] leading-relaxed text-soft">{copy}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  )
}
