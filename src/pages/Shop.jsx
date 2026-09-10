import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, Rows3, SlidersHorizontal, X } from 'lucide-react'
import { products, categories } from '../data/products'
import { cn, money } from '../lib/utils'
import ProductCard from '../components/shop/ProductCard'
import QuickView from '../components/shop/QuickView'
import { Reveal, SplitText, Stagger } from '../components/ui/Primitives'

const GENDERS = ['All', 'Women', 'Men', 'Unisex']
const BADGES = ['All', 'New', 'Bestseller', 'Limited', 'Sale']
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'name', label: 'A–Z' },
]

const ALL_COLORS = [...new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values()]
const ALL_SIZES = [...new Set(products.flatMap((p) => p.sizes))]
const MAX_PRICE = Math.max(...products.map((p) => p.price))

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [quick, setQuick] = useState(null)
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('featured')
  const [price, setPrice] = useState(MAX_PRICE)
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = params.get('category') || 'All'
  const gender = params.get('gender') || 'All'
  const badge = params.get('badge') || 'All'
  const q = params.get('q') || ''

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const toggleIn = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let out = products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (gender !== 'All' && p.gender !== gender) return false
      if (badge !== 'All' && p.badge !== badge) return false
      if (p.price > price) return false
      if (colors.length && !p.colors.some((c) => colors.includes(c.name))) return false
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false
      if (term && !`${p.name} ${p.subtitle} ${p.category}`.toLowerCase().includes(term)) return false
      return true
    })

    out = [...out].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.rating - a.rating
      }
    })
    return out
  }, [category, gender, badge, q, price, colors, sizes, sort])

  const activeCount =
    (category !== 'All' ? 1 : 0) +
    (gender !== 'All' ? 1 : 0) +
    (badge !== 'All' ? 1 : 0) +
    (price < MAX_PRICE ? 1 : 0) +
    colors.length +
    sizes.length

  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: true })
    setPrice(MAX_PRICE)
    setColors([])
    setSizes([])
  }

  useEffect(() => {
    document.body.classList.toggle('no-scroll', filtersOpen)
  }, [filtersOpen])

  // Headline reflects whatever the shopper actually narrowed to.
  const badgeHeadings = {
    New: 'Just arrived.',
    Bestseller: 'The ones people reorder.',
    Limited: 'Limited runs.',
    Sale: 'Final cut.',
  }
  const headingText =
    badgeHeadings[badge] ||
    (category !== 'All' ? `${category}.` : gender !== 'All' ? `Made for ${gender.toLowerCase()}.` : 'Twenty-eight pieces.')
  const eyebrowText =
    badge !== 'All'
      ? badge === 'Sale'
        ? 'Final cut'
        : badge
      : category !== 'All'
        ? category
        : gender !== 'All'
          ? gender
          : 'The full range'

  const FilterPanel = (
    <div className="space-y-8">
      <Group title="Category">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setParam('category', c)}
              className={cn('chip', category === c && 'chip-active')}
            >
              {c}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Made for">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button key={g} onClick={() => setParam('gender', g)} className={cn('chip', gender === g && 'chip-active')}>
              {g}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Collection">
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <button key={b} onClick={() => setParam('badge', b)} className={cn('chip', badge === b && 'chip-active')}>
              {b === 'Sale' ? 'Final cut' : b}
            </button>
          ))}
        </div>
      </Group>

      <Group title={`Max price — ${money(price)}`}>
        <input
          type="range"
          min={50}
          max={MAX_PRICE}
          step={10}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-[#7c5cff]"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[11px] text-mute">
          <span>{money(50)}</span>
          <span>{money(MAX_PRICE)}</span>
        </div>
      </Group>

      <Group title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {ALL_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleIn(colors, setColors, c.name)}
              title={c.name}
              aria-label={c.name}
              className={cn(
                'h-7 w-7 rounded-full border-2 transition-all duration-300',
                colors.includes(c.name) ? 'border-ink scale-110' : 'border-line hover:scale-105'
              )}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleIn(sizes, setSizes, s)}
              className={cn('chip min-w-11 justify-center', sizes.includes(s) && 'chip-active')}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      {activeCount > 0 && (
        <button onClick={clearAll} className="btn btn-ghost w-full">
          Clear {activeCount} filter{activeCount === 1 ? '' : 's'}
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* header */}
      <section className="relative overflow-hidden border-b border-line pb-12 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute right-[-20%] top-[-40%] h-[50vh] w-[50vw] aurora opacity-30" />
        <div className="container-x relative">
          <span className="eyebrow">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            {eyebrowText}
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5.6vw,4.3rem)] leading-[0.98] tracking-[-0.035em]">
            <SplitText text={headingText} />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-soft">
              Filter it down, or scroll the whole thing — it will not take long. That is rather the point.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-10 lg:grid-cols-[248px_1fr]">
          {/* desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">{FilterPanel}</div>
          </aside>

          <div>
            {/* toolbar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <p className="text-sm text-soft">
                <b className="text-ink">{filtered.length}</b> {filtered.length === 1 ? 'piece' : 'pieces'}
                {q && <span className="text-mute"> for “{q}”</span>}
              </p>

              <div className="flex items-center gap-2">
                <button onClick={() => setFiltersOpen(true)} className="chip lg:hidden">
                  <SlidersHorizontal size={13} /> Filters
                  {activeCount > 0 && (
                    <span className="ml-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>

                <div className="hidden items-center rounded-full border border-line p-0.5 sm:flex">
                  {[
                    { id: 'grid', Icon: LayoutGrid },
                    { id: 'list', Icon: Rows3 },
                  ].map(({ id, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      aria-label={`${id} view`}
                      className={cn(
                        'relative grid h-8 w-8 place-items-center rounded-full transition-colors',
                        view === id ? 'text-bg' : 'text-mute hover:text-ink'
                      )}
                    >
                      {view === id && (
                        <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-ink" />
                      )}
                      <Icon size={14} className="relative" />
                    </button>
                  ))}
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort products"
                  className="chip cursor-pointer bg-transparent pr-2 outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-elev text-ink">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* results */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line py-24 text-center"
              >
                <p className="font-display text-3xl">Nothing matches that.</p>
                <p className="max-w-sm text-sm text-mute">
                  Our range is deliberately small, so a narrow filter can empty it. Try widening one.
                </p>
                <button onClick={clearAll} className="btn btn-ink mt-2">
                  Reset filters
                </button>
              </motion.div>
            ) : (
              <Stagger
                key={`${view}-${filtered.length}-${sort}`}
                className={cn(
                  view === 'grid' ? 'grid gap-x-5 gap-y-11 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-10'
                )}
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} onQuickView={setQuick} variant={view} />
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </section>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-[140] bg-black/55 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[141] max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-line bg-bg p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5">
                  <X size={19} />
                </button>
              </div>
              {FilterPanel}
              <button onClick={() => setFiltersOpen(false)} className="btn btn-primary mt-6 w-full">
                Show {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  )
}

function Group({ title, children }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">{title}</p>
      {children}
    </div>
  )
}
