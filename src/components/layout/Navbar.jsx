import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, X, Scale, ArrowRight } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { products, categories } from '../../data/products'
import { cn, money } from '../../lib/utils'
import { SmartImage, Magnetic } from '../ui/Primitives'

// `match` decides the active pill. React Router's NavLink ignores the query
// string, which would light up Shop / Women / Men all at once.
const NAV = [
  { label: 'Shop', to: '/shop', match: (p, s) => p === '/shop' && !s.get('gender') },
  { label: 'Women', to: '/shop?gender=Women', match: (p, s) => p === '/shop' && s.get('gender') === 'Women' },
  { label: 'Men', to: '/shop?gender=Men', match: (p, s) => p === '/shop' && s.get('gender') === 'Men' },
  { label: 'Journal', to: '/journal', match: (p) => p.startsWith('/journal') },
  { label: 'About', to: '/about', match: (p) => p === '/about' },
]

const MEGA = {
  Shop: {
    columns: [
      { title: 'Categories', links: categories.filter((c) => c !== 'All').map((c) => ({ label: c, to: `/shop?category=${c}` })) },
      {
        title: 'Collections',
        links: [
          { label: 'New Arrivals', to: '/shop?badge=New' },
          { label: 'Bestsellers', to: '/shop?badge=Bestseller' },
          { label: 'Limited Edition', to: '/shop?badge=Limited' },
          { label: 'Final Cut Sale', to: '/shop?badge=Sale' },
          { label: 'Everything', to: '/shop' },
        ],
      },
    ],
    feature: products.find((p) => p.slug === 'atelier-wool-coat'),
  },
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mega, setMega] = useState(null)
  const lastY = useRef(0)
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { count, wishlist, compare, setCartOpen, setSearchOpen, theme, toggleTheme } = useStore()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > lastY.current && y > 260 && !mega)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mega])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpen)
  }, [mobileOpen])

  return (
    <>
      {/* announcement bar */}
      <div className="relative z-[60] overflow-hidden bg-ink text-bg">
        <div className="marquee-paused">
          <div className="marquee-track flex w-max" style={{ '--speed': '38s' }}>
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center">
                {[
                  'Complimentary shipping over $250',
                  'Carbon-neutral delivery',
                  '30-day returns, no questions',
                  'Limited winter drop — now live',
                  'Repairs free for life',
                ].map((t, i) => (
                  <span key={i} className="flex items-center whitespace-nowrap px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                    {t}
                    <span className="ml-5 opacity-40">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.header
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setMega(null)}
        className={cn(
          'sticky top-0 z-[80] transition-[background,box-shadow,border] duration-500',
          scrolled || mega ? 'glass shadow-[0_10px_40px_-30px_rgba(0,0,0,.6)]' : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="container-x flex h-[70px] items-center justify-between gap-2 sm:gap-4">
          {/* left: mobile trigger + wordmark + nav */}
          <div className="flex min-w-0 items-center gap-1">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
            >
              <Menu size={19} />
            </button>

            {/* In flow on small screens (where an absolutely centred wordmark
                would collide with the action icons), centred from lg up. */}
            <Link
              to="/"
              className="whitespace-nowrap font-display text-[19px] font-normal tracking-[0.12em] sm:text-[22px] sm:tracking-[0.14em] lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              data-cursor="home"
            >
              AUR<span className="text-gradient">É</span>LIA
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => {
                const active = item.match(pathname, searchParams)
                return (
                  <div key={item.label} onMouseEnter={() => setMega(MEGA[item.label] ? item.label : null)}>
                    <Link
                      to={item.to}
                      className={cn(
                        'relative rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors',
                        active ? 'text-ink' : 'text-soft hover:text-ink'
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-ink/8 dark:bg-white/10"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                    </Link>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* right: actions */}
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-9 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:w-10"
            >
              <Search size={18} />
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative grid h-10 w-9 place-items-center overflow-hidden rounded-full transition-colors hover:bg-ink/5 sm:w-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: -18, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 18, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute"
                >
                  {theme === 'dark' ? <Moon size={17} /> : <Sun size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Link
              to="/compare"
              aria-label="Compare"
              className="relative hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:grid"
            >
              <Scale size={17} />
              <Badge n={compare.length} />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-9 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:w-10"
            >
              <Heart size={17} />
              <Badge n={wishlist.length} />
            </Link>

            <Magnetic strength={0.25}>
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Open bag"
                className="relative grid h-10 w-9 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:w-10"
              >
                <ShoppingBag size={18} />
                <Badge n={count} accent />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* mega menu */}
        <AnimatePresence>
          {mega && MEGA[mega] && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="hidden border-t border-line lg:block"
            >
              <div className="container-x grid grid-cols-[1fr_1fr_1.15fr] gap-10 py-9">
                {MEGA[mega].columns.map((col) => (
                  <div key={col.title}>
                    <p className="eyebrow mb-4">{col.title}</p>
                    <ul className="space-y-2.5">
                      {col.links.map((l, i) => (
                        <motion.li
                          key={l.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.4 }}
                        >
                          <Link
                            to={l.to}
                            onClick={() => setMega(null)}
                            className="group inline-flex items-center gap-2 text-[15px] text-soft transition-colors hover:text-ink"
                          >
                            <span className="link-underline">{l.label}</span>
                            <ArrowRight size={13} className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
                {MEGA[mega].feature && (
                  <Link
                    to={`/product/${MEGA[mega].feature.slug}`}
                    onClick={() => setMega(null)}
                    className="group relative overflow-hidden rounded-2xl"
                  >
                    <SmartImage
                      id={MEGA[mega].feature.images[0]}
                      alt={MEGA[mega].feature.name}
                      w={700}
                      className="h-56 w-full"
                      imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-5 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-80">Featured</p>
                      <p className="mt-1 font-display text-xl">{MEGA[mega].feature.name}</p>
                      <p className="text-xs opacity-80">{money(MEGA[mega].feature.price)}</p>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay />
    </>
  )
}

function Badge({ n, accent }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
          className={cn(
            'absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold',
            // `text-white` must not be in the shared half: on the ink pill it
            // would sit on a cream background in dark mode and disappear.
            accent ? 'bg-gradient-to-br from-brand to-rose text-white' : 'bg-ink text-bg'
          )}
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------ mobile menu ------------------------------ */
function MobileMenu({ open, onClose }) {
  const links = [...NAV, { label: 'Wishlist', to: '/wishlist' }, { label: 'Compare', to: '/compare' }, { label: 'Contact', to: '/contact' }]
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-[96] flex w-[86vw] max-w-sm flex-col bg-bg p-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl tracking-[0.14em]">
                AUR<span className="text-gradient">É</span>LIA
              </span>
              <button onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5">
                <X size={19} />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className="block border-b border-line py-4 font-display text-3xl tracking-tight transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto pt-8 text-xs text-mute">
              <p>hello@aurelia.studio</p>
              <p className="mt-1">Lisbon · Copenhagen · Kyoto</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ----------------------------- search overlay ---------------------------- */
function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 120)
    else setQ('')
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSearchOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  const term = q.trim().toLowerCase()
  const results = term
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.subtitle.toLowerCase().includes(term) ||
            p.gender.toLowerCase().includes(term)
        )
        .slice(0, 6)
    : products.filter((p) => p.badge === 'Bestseller').slice(0, 4)

  const go = (slug) => {
    setSearchOpen(false)
    nav(`/product/${slug}`)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[12vh] z-[131] w-[min(94vw,640px)] -translate-x-1/2 overflow-hidden rounded-3xl border border-line bg-elev shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search size={18} className="text-mute" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && results[0] && go(results[0].slug)}
                placeholder="Search coats, silk, sneakers…"
                className="w-full bg-transparent py-5 text-[15px] outline-none placeholder:text-mute"
              />
              <button onClick={() => setSearchOpen(false)} className="chip">
                ESC
              </button>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-3">
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-mute">
                {term ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular right now'}
              </p>
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-mute">
                  Nothing matched “{q}”. Try “wool”, “silk” or “boots”.
                </p>
              )}
              {results.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => go(p.slug)}
                  className="flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-ink/5"
                >
                  <SmartImage id={p.images[0]} alt={p.name} w={160} className="h-14 w-12 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-mute">{p.subtitle}</span>
                  </span>
                  <span className="text-sm font-semibold">{money(p.price)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
