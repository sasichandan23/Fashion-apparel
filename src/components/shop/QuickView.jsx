import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart, ShoppingBag, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { cn, money } from '../../lib/utils'
import { SmartImage, Stars } from '../ui/Primitives'

export default function QuickView({ product, onClose }) {
  const { addToCart, toggleWish, inWishlist } = useStore()
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(0)
  const [shot, setShot] = useState(0)

  useEffect(() => {
    if (product) {
      setSize(null)
      setColor(0)
      setShot(0)
    }
  }, [product])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[145] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-[146] w-[min(96vw,940px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-line bg-elev shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-bg/80 backdrop-blur transition-colors hover:bg-ink hover:text-bg"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* gallery */}
              <div className="relative bg-bg2 p-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={shot}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <SmartImage id={product.images[shot]} alt={product.name} w={800} className="h-full w-full" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-3 flex gap-2">
                  {product.images.map((im, i) => (
                    <button
                      key={im + i}
                      onClick={() => setShot(i)}
                      className={cn(
                        'h-16 w-14 overflow-hidden rounded-lg border-2 transition-all',
                        i === shot ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <SmartImage id={im} alt="" w={140} className="h-full w-full" />
                    </button>
                  ))}
                </div>
              </div>

              {/* detail */}
              <div className="flex flex-col p-7 sm:p-9">
                <p className="eyebrow">{product.category} · {product.gender}</p>
                <h2 className="mt-2 font-display text-3xl leading-tight tracking-tight">{product.name}</h2>
                <p className="mt-1 text-sm text-mute">{product.subtitle}</p>

                <div className="mt-3 flex items-center gap-3">
                  <Stars value={product.rating} showValue />
                  <span className="text-xs text-mute">({product.reviews} reviews)</span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-3xl">{money(product.price)}</span>
                  {product.compareAt && (
                    <span className="text-sm text-mute line-through">{money(product.compareAt)}</span>
                  )}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-soft">{product.desc}</p>

                {/* colors */}
                <div className="mt-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-mute">
                    Colour — <span className="text-ink">{product.colors[color].name}</span>
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setColor(i)}
                        aria-label={c.name}
                        className={cn(
                          'h-8 w-8 rounded-full border-2 transition-transform duration-300',
                          i === color ? 'border-ink scale-110' : 'border-line hover:scale-105'
                        )}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* sizes */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-mute">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={cn('chip min-w-11 justify-center', size === s && 'chip-active')}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, { size: size || product.sizes[0], color: product.colors[color].name })
                      onClose()
                    }}
                    className="btn btn-primary flex-1"
                  >
                    <ShoppingBag size={16} /> Add to bag
                  </button>
                  <button
                    onClick={() => toggleWish(product)}
                    aria-label="Save"
                    className={cn(
                      'btn btn-ghost !px-4',
                      inWishlist(product.id) && 'bg-ink text-bg'
                    )}
                  >
                    <Heart size={16} className={cn(inWishlist(product.id) && 'fill-current')} />
                  </button>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-mute transition-colors hover:text-ink"
                >
                  Full details <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
