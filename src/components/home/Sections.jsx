import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowLeft, Leaf, PackageCheck, Quote, RefreshCw, Ruler, Truck } from 'lucide-react'
import { products, collections, lookbook, testimonials } from '../../data/products'
import { posts } from '../../data/journal'
import { cn, money } from '../../lib/utils'
import ProductCard from '../shop/ProductCard'
import {
  Appear,
  Counter,
  Magnetic,
  Marquee,
  Reveal,
  SectionHeading,
  SmartImage,
  SplitText,
  Stagger,
  Stars,
  Tilt,
  staggerItem,
} from '../ui/Primitives'

/* ============================== value marquee ============================= */
export function ValueBar() {
  const items = [
    { icon: Truck, text: 'Free carbon-neutral shipping over $250' },
    { icon: RefreshCw, text: '30-day returns, no questions asked' },
    { icon: Leaf, text: 'GOTS & OEKO-TEX certified fibres' },
    { icon: PackageCheck, text: 'Plastic-free packaging, always' },
    { icon: Ruler, text: 'Free tailoring on every order' },
  ]
  return (
    <section className="border-y border-line bg-bg2/60 py-5">
      <Marquee speed={34}>
        {items.map(({ icon: Icon, text }, i) => (
          <span key={i} className="flex items-center gap-2.5 whitespace-nowrap px-7 text-[13px] font-medium text-soft">
            <Icon size={15} className="text-brand" />
            {text}
            <span className="ml-5 text-mute">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  )
}

/* ============================== collections ============================== */
export function Collections() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading
        eyebrow="Browse"
        title="Four ways in."
        copy="Start where you are. Every piece is cut from the same short list of materials, so it all works together."
        align="between"
        action={
          <Link to="/shop" className="btn btn-ghost">
            All pieces <ArrowRight size={15} />
          </Link>
        }
      />

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((c) => {
          const params = new URLSearchParams(c.filter).toString()
          return (
            <motion.div key={c.id} variants={staggerItem} className="group perspective">
              <Tilt max={7}>
                <Link
                  to={`/shop?${params}`}
                  data-cursor="explore"
                  className="relative block overflow-hidden rounded-2xl"
                >
                  <SmartImage
                    id={c.image}
                    alt={c.title}
                    w={700}
                    className="aspect-[3/4] w-full"
                    imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="font-display text-3xl leading-none tracking-tight">{c.title}</h3>
                    <p className="mt-2 max-w-[22ch] text-sm text-white/80 opacity-0 transition-all duration-500 group-hover:opacity-100">
                      {c.copy}
                    </p>
                    <span className="mt-4 inline-flex translate-y-2 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      Explore <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Tilt>
            </motion.div>
          )
        })}
      </Stagger>
    </section>
  )
}

/* ============================ featured products =========================== */
const TABS = [
  { id: 'New', label: 'New arrivals' },
  { id: 'Bestseller', label: 'Bestsellers' },
  { id: 'Limited', label: 'Limited' },
  { id: 'Sale', label: 'Final cut' },
]

export function Featured({ onQuickView }) {
  const [tab, setTab] = useState('Bestseller')
  const list = products.filter((p) => p.badge === tab).slice(0, 4)
  const filled = list.length >= 4 ? list : [...list, ...products.filter((p) => p.badge !== tab)].slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-bg2/50 py-24 sm:py-32">
      <div className="pointer-events-none absolute right-[-15%] top-1/4 h-[50vh] w-[45vw] aurora opacity-25" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="The collection"
          title="Everything, edited down."
          copy="Twenty-eight pieces in total. We would rather make a few things you keep than a catalogue you scroll past."
          align="center"
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn('chip relative px-4 py-2', tab === t.id && 'text-bg')}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Stagger className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {filled.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onQuickView={onQuickView} />
              ))}
            </Stagger>
          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex justify-center">
          <Magnetic>
            <Link to="/shop" className="btn btn-ink px-8 py-3.5">
              View all 28 pieces <ArrowRight size={16} />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

/* =============================== editorial =============================== */
export function Editorial() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  const stats = [
    { to: 28, label: 'Pieces in the range', suffix: '' },
    { to: 6, label: 'Mills we work with', suffix: '' },
    { to: 94, label: 'Reorder rate', suffix: '%' },
    { to: 10, label: 'Year repair promise', suffix: 'yr' },
  ]

  return (
    <section ref={ref} className="container-x py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* images */}
        <div className="relative h-[420px] sm:h-[560px]">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 h-[72%] w-[62%] overflow-hidden rounded-2xl">
            <SmartImage id={lookbook[1].id} alt="Inside the studio" w={800} className="h-full w-full" />
          </motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-0 right-0 h-[62%] w-[52%] overflow-hidden rounded-2xl ring-8 ring-bg"
          >
            <SmartImage id={lookbook[4].id} alt="Fabric detail" w={700} className="h-full w-full" />
          </motion.div>
          <div className="glass absolute bottom-[8%] left-[4%] rounded-2xl px-5 py-4 shadow-xl">
            <p className="font-display text-3xl leading-none">
              <Counter to={1} decimals={0} />
              <span className="text-gradient">6</span>
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Years, one idea</p>
          </div>
        </div>

        {/* copy */}
        <div className="flex flex-col justify-center">
          <span className="eyebrow">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            Why we exist
          </span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
            <SplitText text="We make fewer things," />
            <br />
            <span className="text-gradient italic">
              <SplitText text="and we make them slowly." delay={0.12} />
            </span>
          </h2>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-soft">
              Every season the industry makes twice what it sells. We took the opposite bet: a permanent collection of
              twenty-eight pieces, remade only when the fabric improves. We publish the mill, the fibre and the person
              who cut it.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-soft">
              If something wears through, send it back. We repair it free, for as long as you own it.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <motion.div key={s.label} variants={staggerItem}>
                <p className="font-display text-4xl leading-none tracking-tight">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs leading-snug text-mute">{s.label}</p>
              </motion.div>
            ))}
          </Stagger>

          <Reveal delay={0.35}>
            <Link to="/about" className="btn btn-ghost mt-10 self-start">
              Read the full story <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* =============================== lookbook =============================== */
export function Lookbook() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-32%'])

  return (
    <section ref={ref} className="overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Lookbook"
          title="Winter 04 — in the wild."
          copy="Shot over three days in Porto with people who actually wear the clothes."
          align="between"
          action={
            <Link to="/journal" className="btn btn-ghost">
              The Journal <ArrowRight size={15} />
            </Link>
          }
        />
      </div>

      <motion.div style={{ x }} className="mt-14 flex gap-5 pl-5 sm:pl-8 lg:pl-10">
        {lookbook.map((l, i) => (
          <Appear
            key={l.id}
            as="figure"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            duration={0.8}
            delay={i * 0.06}
            className={cn(
              'group relative shrink-0 overflow-hidden rounded-2xl',
              i % 3 === 0 ? 'h-[420px] w-[300px] sm:h-[520px] sm:w-[380px]' : 'h-[360px] w-[260px] sm:h-[440px] sm:w-[320px] self-end'
            )}
          >
            <SmartImage
              id={l.id}
              alt={l.title}
              w={700}
              className="h-full w-full"
              imgClassName="transition-transform duration-[1.5s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-75">{l.label}</p>
              <p className="font-display text-2xl">{l.title}</p>
            </figcaption>
          </Appear>
        ))}
      </motion.div>
    </section>
  )
}

/* ============================= testimonials ============================= */
export function Testimonials() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const t = testimonials[i]

  const go = (d) => {
    setDir(d)
    setI((v) => (v + d + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative overflow-hidden border-y border-line bg-bg2/50 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[60vw] -translate-x-1/2 aurora opacity-25" />
      <div className="container-x relative max-w-4xl text-center">
        <span className="eyebrow justify-center">Wardrobe notes</span>

        <div className="relative mt-10 min-h-[280px] sm:min-h-[240px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={t.name}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: dir * -60, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Quote size={30} className="mx-auto mb-6 text-brand opacity-60" />
              <p className="font-display text-[clamp(1.35rem,3.1vw,2.1rem)] font-normal leading-[1.35] tracking-[-0.015em]">
                “{t.quote}”
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <SmartImage id={t.avatar} alt={t.name} w={120} className="h-11 w-11 rounded-full" />
                <div className="text-left">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-mute">{t.role}</p>
                </div>
                <Stars value={t.rating} size={12} className="ml-2" />
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous" className="btn btn-ghost !px-3 !py-3">
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDir(idx > i ? 1 : -1)
                  setI(idx)
                }}
                aria-label={`Go to review ${idx + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  idx === i ? 'w-7 bg-ink' : 'w-1.5 bg-mute/40 hover:bg-mute'
                )}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next" className="btn btn-ghost !px-3 !py-3">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ============================ journal preview ============================ */
export function JournalPreview() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading
        eyebrow="The Journal"
        title="Notes from the atelier."
        align="between"
        action={
          <Link to="/journal" className="btn btn-ghost">
            All entries <ArrowRight size={15} />
          </Link>
        }
      />
      <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
        {posts.slice(0, 3).map((p) => (
          <motion.article key={p.slug} variants={staggerItem} className="group">
            <Link to={`/journal/${p.slug}`} data-cursor="read">
              <div className="overflow-hidden rounded-2xl">
                <SmartImage
                  id={p.image}
                  alt={p.title}
                  w={700}
                  className="aspect-[16/11] w-full"
                  imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
                />
              </div>
              <p className="eyebrow mt-5">
                {p.tag} · {p.readTime}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-brand">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-soft">{p.excerpt}</p>
            </Link>
          </motion.article>
        ))}
      </Stagger>
    </section>
  )
}

/* ================================= CTA ================================= */
export function CtaBand() {
  const p = products.find((x) => x.slug === 'halden-cashmere-knit')
  return (
    <section className="container-x pb-4">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-bg sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
            <div className="absolute -left-[10%] top-[-40%] h-[70vh] w-[60%] aurora" />
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] opacity-70">Limited · 120 made</p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] tracking-[-0.03em]">
                <SplitText text="The cashmere everyone" />
                <br />
                <SplitText text="reorders in three colours." delay={0.12} />
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed opacity-75">
                Two-ply grade-A Mongolian cashmere, hand-linked at the shoulder. When this run is gone, it is gone until
                spring.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <Link to={`/product/${p.slug}`} className="btn btn-primary px-8 py-3.5">
                    Shop the knit — {money(p.price)} <ArrowRight size={16} />
                  </Link>
                </Magnetic>
                <Link
                  to="/shop"
                  className="btn px-7 py-3.5"
                  style={{ border: '1px solid rgba(255,255,255,.28)' }}
                >
                  See everything
                </Link>
              </div>
            </div>
            <div className="relative hidden h-[320px] lg:block">
              <Appear
                from={{ opacity: 0, scale: 0.92, rotate: 4 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                duration={1}
                className="absolute inset-0 overflow-hidden rounded-2xl"
              >
                <SmartImage id={p.images[0]} alt={p.name} w={800} className="h-full w-full" />
              </Appear>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
