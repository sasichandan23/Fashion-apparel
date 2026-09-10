import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'
import { products, testimonials } from '../../data/products'
import { money } from '../../lib/utils'
import { Magnetic, SmartImage, SplitText, Stars } from '../ui/Primitives'

const featured = products.find((p) => p.slug === 'atelier-wool-coat')
const second = products.find((p) => p.slug === 'solene-slip-dress')
const third = products.find((p) => p.slug === 'course-runner-low')

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 130])
  const yArt = useTransform(scrollYProgress, [0, 1], [0, -90])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // pointer parallax
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 120, damping: 22 })
  const sy = useSpring(py, { stiffness: 120, damping: 22 })
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }

  const layer = (depth) => ({
    x: useTransform(sx, [-1, 1], [-depth, depth]),
    y: useTransform(sy, [-1, 1], [-depth, depth]),
  })

  const l1 = layer(18)
  const l2 = layer(30)
  const l3 = layer(44)

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="grain relative min-h-[92vh] overflow-hidden pt-10 sm:pt-16 lg:min-h-[94vh]"
    >
      {/* ambient light */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[10%] top-[-15%] h-[60vh] w-[60vw] aurora opacity-70" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[55vh] w-[50vw] aurora opacity-50" style={{ animationDelay: '-6s' }} />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* ------------------------------ copy ------------------------------ */}
        <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 pt-6 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3.5 py-1.5 backdrop-blur"
          >
            <Sparkles size={13} className="text-brand" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Winter drop 04 — now live</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.8rem,7.4vw,5.6rem)] font-normal leading-[0.95] tracking-[-0.035em]">
            <SplitText text="Clothes that" delay={0.2} />
            <br />
            <SplitText text="outlive the" delay={0.32} />
            <br />
            <span className="text-gradient italic">
              <SplitText text="season." delay={0.46} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-lg text-[16px] leading-relaxed text-soft"
          >
            A small atelier making a small number of things properly — natural fibres, named mills, and repairs free for
            life. Built to be worn for a decade, not a summer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link to="/shop" className="btn btn-primary px-8 py-3.5" data-cursor="shop">
                Shop the collection <ArrowRight size={16} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link to="/about" className="btn btn-ghost px-7 py-3.5">
                Our story
              </Link>
            </Magnetic>
          </motion.div>

          {/* social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.15 }}
            className="mt-11 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {testimonials.slice(0, 4).map((t) => (
                <SmartImage
                  key={t.name}
                  id={t.avatar}
                  alt={t.name}
                  w={90}
                  className="h-10 w-10 rounded-full ring-2 ring-bg"
                />
              ))}
            </div>
            <div>
              <Stars value={5} size={13} />
              <p className="mt-0.5 text-xs text-soft">
                <b className="text-ink">4.9/5</b> from 2,840 considered wardrobes
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ------------------------------ art ------------------------------ */}
        <motion.div style={{ y: yArt, opacity: fade }} className="relative h-[500px] sm:h-[620px] lg:h-[660px]">
          {/* main */}
          <motion.div
            style={{ x: l1.x, y: l1.y }}
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[8%] top-0 h-[78%] w-[68%] overflow-hidden rounded-[2rem] shadow-2xl"
          >
            <Link to={`/product/${featured.slug}`} data-cursor="view" className="block h-full">
              <SmartImage id={featured.images[0]} alt={featured.name} w={900} priority className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">Limited · 60 made</p>
                <p className="font-display text-2xl">{featured.name}</p>
              </div>
            </Link>
          </motion.div>

          {/* secondary */}
          <motion.div
            style={{ x: l2.x, y: l2.y }}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[2%] right-[2%] h-[46%] w-[46%] overflow-hidden rounded-[1.6rem] shadow-2xl ring-1 ring-white/10"
          >
            <Link to={`/product/${second.slug}`} data-cursor="view" className="block h-full">
              <SmartImage id={second.images[0]} alt={second.name} w={700} className="h-full w-full" />
            </Link>
          </motion.div>

          {/* floating price card */}
          <motion.div
            style={{ x: l3.x, y: l3.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="anim-float absolute left-0 top-[58%] w-[210px]"
          >
            <Link
              to={`/product/${third.slug}`}
              className="glass flex items-center gap-3 rounded-2xl p-3 shadow-xl backdrop-blur-xl"
            >
              <SmartImage id={third.images[0]} alt={third.name} w={160} className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{third.name}</p>
                <p className="text-xs text-mute">{money(third.price)}</p>
              </div>
            </Link>
          </motion.div>

          {/* rotating seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute -right-2 top-[6%] h-24 w-24 sm:h-28 sm:w-28"
          >
            <svg viewBox="0 0 100 100" className="anim-spin-slow h-full w-full">
              <defs>
                <path id="seal" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
              </defs>
              <text className="fill-current text-[10.5px] font-bold uppercase tracking-[0.22em]">
                <textPath href="#seal">· Repairs free for life · Made to last ·</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand to-rose text-white">
                <Sparkles size={16} />
              </span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-mute">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-mute"
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.div>
    </section>
  )
}
