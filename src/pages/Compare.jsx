import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Minus, Scale, ShoppingBag, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import { cn, money } from '../lib/utils'
import { Appear, SmartImage, SplitText, Stars } from '../components/ui/Primitives'

const ROWS = [
  { key: 'price', label: 'Price', render: (p) => <span className="font-display text-2xl">{money(p.price)}</span> },
  {
    key: 'compareAt',
    label: 'Was',
    render: (p) => (p.compareAt ? <span className="text-mute line-through">{money(p.compareAt)}</span> : <Dash />),
  },
  { key: 'rating', label: 'Rating', render: (p) => <Stars value={p.rating} size={13} showValue /> },
  { key: 'reviews', label: 'Reviews', render: (p) => <span className="text-soft">{p.reviews}</span> },
  { key: 'category', label: 'Category', render: (p) => <span className="text-soft">{p.category}</span> },
  { key: 'gender', label: 'Made for', render: (p) => <span className="text-soft">{p.gender}</span> },
  { key: 'material', label: 'Material', render: (p) => <span className="text-sm leading-relaxed text-soft">{p.material}</span> },
  { key: 'fit', label: 'Fit', render: (p) => <span className="text-sm leading-relaxed text-soft">{p.fit}</span> },
  { key: 'care', label: 'Care', render: (p) => <span className="text-sm leading-relaxed text-soft">{p.care}</span> },
  {
    key: 'colors',
    label: 'Colours',
    render: (p) => (
      <span className="flex flex-wrap gap-1.5">
        {p.colors.map((c) => (
          <span key={c.name} title={c.name} className="h-5 w-5 rounded-full border border-line" style={{ background: c.hex }} />
        ))}
      </span>
    ),
  },
  {
    key: 'sizes',
    label: 'Sizes',
    render: (p) => <span className="text-sm text-soft">{p.sizes.join(' · ')}</span>,
  },
  {
    key: 'badge',
    label: 'Collection',
    render: (p) =>
      p.badge ? (
        <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bg">
          {p.badge}
        </span>
      ) : (
        <Dash />
      ),
  },
  {
    key: 'shipping',
    label: 'Free shipping',
    render: (p) =>
      p.price >= 250 ? <Check size={17} className="text-jade" /> : <span className="text-xs text-mute">Over $250</span>,
  },
]

export default function Compare() {
  const { compareItems, toggleCompare, clearCompare, addToCart } = useStore()

  if (compareItems.length === 0) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="grid h-24 w-24 place-items-center rounded-full border border-line"
        >
          <Scale size={30} className="text-mute" />
        </motion.div>
        <h1 className="mt-8 font-display text-5xl tracking-tight">Nothing to compare</h1>
        <p className="mt-3 max-w-sm text-[15px] text-soft">
          Add up to four pieces from any product card and see them side by side — material, fit, care, the lot.
        </p>
        <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">
          Pick some pieces <ArrowRight size={16} />
        </Link>
      </section>
    )
  }

  const cols = compareItems.length

  return (
    <section className="container-x py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            Side by side
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1] tracking-[-0.035em]">
            <SplitText text="Compare, properly." />
          </h1>
          <p className="mt-3 max-w-lg text-[15px] text-soft">
            {cols} of 4 slots used. Everything we publish about each piece, in one table.
          </p>
        </div>
        <button onClick={clearCompare} className="btn btn-ghost">
          Clear all
        </button>
      </div>

      <div className="mt-12 overflow-x-auto pb-4">
        <div className="min-w-[720px]">
          {/* product heads */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${cols}, minmax(180px, 1fr))` }}>
            <div />
            <AnimatePresence initial={false}>
              {compareItems.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative"
                >
                  <button
                    onClick={() => toggleCompare(p)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-bg/85 backdrop-blur transition-colors hover:bg-ink hover:text-bg"
                  >
                    <X size={15} />
                  </button>
                  <Link to={`/product/${p.slug}`} className="block overflow-hidden rounded-2xl">
                    <SmartImage
                      id={p.images[0]}
                      alt={p.name}
                      w={500}
                      className="aspect-[4/5] w-full"
                      imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.06]"
                    />
                  </Link>
                  <Link to={`/product/${p.slug}`}>
                    <h2 className="mt-4 font-display text-xl leading-tight tracking-tight transition-colors hover:text-brand">
                      {p.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-xs text-mute">{p.subtitle}</p>
                  <button onClick={() => addToCart(p)} className="btn btn-primary mt-4 w-full !py-2.5 text-[13px]">
                    <ShoppingBag size={14} /> Add to bag
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* rows */}
          <div className="mt-10 border-t border-line">
            {ROWS.map((row, i) => (
              <Appear
                key={row.key}
                from={{ opacity: 0, y: 12 }}
                to={{ opacity: 1, y: 0 }}
                duration={0.45}
                delay={i * 0.03}
                className={cn('grid items-center gap-4 border-b border-line py-5', i % 2 === 1 && 'bg-ink/2')}
                style={{ gridTemplateColumns: `140px repeat(${cols}, minmax(180px, 1fr))` }}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">{row.label}</span>
                {compareItems.map((p) => (
                  <div key={p.id}>{row.render(p)}</div>
                ))}
              </Appear>
            ))}
          </div>
        </div>
      </div>

      {cols < 4 && (
        <div className="mt-12">
          <p className="eyebrow mb-5">Add another — {4 - cols} slot{4 - cols === 1 ? '' : 's'} left</p>
          <div className="flex flex-wrap gap-3">
            {products
              .filter((p) => !compareItems.some((c) => c.id === p.id))
              .slice(0, 8)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleCompare(p)}
                  className="group flex items-center gap-3 rounded-2xl border border-line p-2 pr-4 transition-colors hover:border-line2"
                >
                  <SmartImage id={p.images[0]} alt={p.name} w={120} className="h-12 w-10 rounded-lg" />
                  <span className="text-left">
                    <span className="block text-[13px] font-semibold">{p.name}</span>
                    <span className="block text-[11px] text-mute">{money(p.price)}</span>
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Dash() {
  return <Minus size={15} className="text-mute/50" />
}
