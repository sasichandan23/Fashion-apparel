import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Ruler,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { bySlug, related, testimonials } from '../data/products'
import { useStore } from '../context/StoreContext'
import { cn, money } from '../lib/utils'
import NotFound from './NotFound'
import ProductCard from '../components/shop/ProductCard'
import QuickView from '../components/shop/QuickView'
import { Appear, Reveal, SectionHeading, SmartImage, Stagger, Stars } from '../components/ui/Primitives'

export default function Product() {
  const { slug } = useParams()
  const product = bySlug(slug)
  const { addToCart, toggleWish, toggleCompare, inWishlist, inCompare } = useStore()

  const [shot, setShot] = useState(0)
  const [color, setColor] = useState(0)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })
  const [quick, setQuick] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    setShot(0)
    setColor(0)
    setSize(null)
    setQty(1)
    setErr(false)
  }, [slug])

  if (!product) return <NotFound />

  const others = related(product, 4)
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  const wished = inWishlist(product.id)
  const compared = inCompare(product.id)

  const handleAdd = () => {
    if (!size) {
      setErr(true)
      return
    }
    addToCart(product, { size, color: product.colors[color].name, qty })
  }

  return (
    <>
      {/* breadcrumb */}
      <div className="container-x pt-8">
        <nav className="flex items-center gap-2 text-xs text-mute">
          <Link to="/" className="transition-colors hover:text-ink">Home</Link>
          <span>/</span>
          <Link to="/shop" className="transition-colors hover:text-ink">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="transition-colors hover:text-ink">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-12 py-10 lg:grid-cols-2 lg:gap-16">
        {/* ------------------------------ gallery ----------------------------- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-bg2"
            onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
            onMouseLeave={() => setZoom({ on: false, x: 50, y: 50 })}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setZoom({
                on: true,
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              })
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={shot}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <SmartImage
                  id={product.images[shot]}
                  alt={product.name}
                  w={1100}
                  priority
                  className="h-full w-full"
                  imgClassName={cn('transition-transform duration-300', zoom.on && 'scale-[1.75]')}
                  imgStyle={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
              {product.badge && (
                <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-bg">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-rose px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  −{discount}%
                </span>
              )}
            </div>
            <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
              Hover to zoom
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            {product.images.map((im, i) => (
              <button
                key={im + i}
                onClick={() => setShot(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  'relative aspect-[4/5] w-20 overflow-hidden rounded-xl transition-all duration-300',
                  i === shot ? 'ring-2 ring-brand ring-offset-2 ring-offset-bg' : 'opacity-55 hover:opacity-100'
                )}
              >
                <SmartImage id={im} alt="" w={200} className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------- detail ----------------------------- */}
        <div>
          <Reveal dir="right">
            <p className="eyebrow">{product.category} · Made for {product.gender}</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.03em]">
              {product.name}
            </h1>
            <p className="mt-2 text-[15px] text-soft">{product.subtitle}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Stars value={product.rating} showValue />
              <span className="text-xs text-mute">{product.reviews} reviews</span>
              <span className="h-3 w-px bg-line" />
              <span className="text-xs font-semibold text-jade">In stock — ships tomorrow</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl tracking-tight">{money(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="text-base text-mute line-through">{money(product.compareAt)}</span>
                  <span className="rounded-full bg-jade/15 px-2 py-0.5 text-xs font-bold text-jade">
                    Save {money(product.compareAt - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-soft">{product.desc}</p>
          </Reveal>

          {/* colour */}
          <div className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                Colour — <span className="text-ink">{product.colors[color].name}</span>
              </p>
            </div>
            <div className="flex gap-2.5">
              {product.colors.map((c, i) => (
                <motion.button
                  key={c.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setColor(i)}
                  aria-label={c.name}
                  title={c.name}
                  className={cn(
                    'h-10 w-10 rounded-full border-2 transition-all duration-300',
                    i === color ? 'border-ink' : 'border-line'
                  )}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* size */}
          <div className="mt-7">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Size</p>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-soft transition-colors hover:text-ink">
                <Ruler size={13} /> Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s)
                    setErr(false)
                  }}
                  className={cn('chip min-w-14 justify-center py-2.5', size === s && 'chip-active')}
                >
                  {s}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {err && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-xs font-semibold text-rose"
                >
                  Choose a size first.
                </motion.p>
              )}
            </AnimatePresence>
            <p className="mt-3 text-xs text-mute">Fit: {product.fit}</p>
          </div>

          {/* qty + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/5"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/5"
              >
                <Plus size={15} />
              </button>
            </div>

            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary min-w-[200px] flex-1 py-3.5"
            >
              <ShoppingBag size={17} /> Add to bag — {money(product.price * qty)}
            </motion.button>

            <button
              onClick={() => toggleWish(product)}
              aria-label="Save to wishlist"
              className={cn('btn btn-ghost !px-4 !py-3.5', wished && 'bg-ink text-bg')}
            >
              <Heart size={17} className={cn(wished && 'fill-current')} />
            </button>
            <button
              onClick={() => toggleCompare(product)}
              aria-label="Add to compare"
              className={cn('btn btn-ghost !px-4 !py-3.5', compared && 'bg-ink text-bg')}
            >
              <Scale size={17} />
            </button>
          </div>

          {/* trust */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, title: 'Free shipping', copy: 'On orders over $250' },
              { Icon: RefreshCw, title: '30-day returns', copy: 'Free, no questions' },
              { Icon: ShieldCheck, title: 'Repairs for life', copy: 'However long you own it' },
            ].map(({ Icon, title, copy }) => (
              <div key={title} className="rounded-2xl border border-line p-4">
                <Icon size={17} className="text-brand" />
                <p className="mt-2.5 text-[13px] font-semibold">{title}</p>
                <p className="text-xs text-mute">{copy}</p>
              </div>
            ))}
          </div>

          {/* accordions */}
          <div className="mt-9 divide-y divide-line border-y border-line">
            <Accordion title="Details & construction" defaultOpen>
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-soft">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {d}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Material & care">
              <dl className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-mute">Material</dt>
                  <dd className="text-soft">{product.material}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-mute">Care</dt>
                  <dd className="text-soft">{product.care}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-mute">Fit</dt>
                  <dd className="text-soft">{product.fit}</dd>
                </div>
              </dl>
            </Accordion>
            <Accordion title="Shipping & returns">
              <p className="text-sm leading-relaxed text-soft">
                Dispatched from Porto within one working day. Carbon-neutral delivery in 2–4 days across Europe, 4–7 days
                elsewhere. Free over $250, otherwise a flat $12. Returns are free for thirty days — the label is in the
                box.
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="container-x border-t border-line py-20">
        <SectionHeading eyebrow="Reviews" title={`${product.reviews} people have opinions.`} align="between" />
        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-line p-6">
            <p className="font-display text-6xl leading-none">{product.rating.toFixed(1)}</p>
            <Stars value={product.rating} size={15} className="mt-2" />
            <p className="mt-2 text-xs text-mute">Based on {product.reviews} verified purchases</p>
            <div className="mt-5 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : star === 2 ? 1 : 1
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-mute">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <Appear
                        from={{ width: 0 }}
                        to={{ width: `${pct}%` }}
                        duration={0.9}
                        className="h-full rounded-full bg-amber"
                      />
                    </div>
                    <span className="w-8 text-right text-mute">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Stagger className="grid gap-5 sm:grid-cols-2">
            {testimonials.slice(0, 4).map((t) => (
              <motion.figure
                key={t.name}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="rounded-2xl border border-line p-6"
              >
                <Stars value={t.rating} size={12} />
                <blockquote className="mt-3 text-sm leading-relaxed text-soft">“{t.quote}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <SmartImage id={t.avatar} alt={t.name} w={90} className="h-9 w-9 rounded-full" />
                  <div>
                    <p className="text-[13px] font-semibold">{t.name}</p>
                    <p className="text-[11px] text-mute">Verified purchase</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </Stagger>
        </div>
      </section>

      {/* related */}
      <section className="container-x border-t border-line py-20">
        <SectionHeading eyebrow="Goes with" title="Pairs well with this." align="between" />
        <Stagger className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={setQuick} />
          ))}
        </Stagger>
      </section>

      {/* sticky mobile bar */}
      <div className="glass fixed inset-x-0 bottom-0 z-[70] flex items-center gap-3 border-t px-4 py-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{product.name}</p>
          <p className="text-xs text-mute">{money(product.price)} · {size || 'Pick a size'}</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary shrink-0 px-5 py-2.5 text-[13px]">
          <ShoppingBag size={15} /> Add
        </button>
      </div>
      <div className="h-16 lg:hidden" />

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={17} className="text-mute" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
