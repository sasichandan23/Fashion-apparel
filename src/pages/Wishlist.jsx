import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import { money } from '../lib/utils'
import ProductCard from '../components/shop/ProductCard'
import { SectionHeading, SmartImage, SplitText, Stagger, Stars } from '../components/ui/Primitives'

export default function Wishlist() {
  const { wishlistItems, toggleWish, addToCart } = useStore()

  if (wishlistItems.length === 0) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="grid h-24 w-24 place-items-center rounded-full border border-line"
        >
          <Heart size={30} className="text-mute" />
        </motion.div>
        <h1 className="mt-8 font-display text-5xl tracking-tight">Nothing saved yet</h1>
        <p className="mt-3 max-w-sm text-[15px] text-soft">
          Tap the heart on anything you are thinking about. It will wait here as long as you need.
        </p>
        <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">
          Find something <ArrowRight size={16} />
        </Link>

        <div className="mt-24 w-full text-left">
          <SectionHeading eyebrow="Start here" title="The obvious first buys." align="between" />
          <Stagger className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.filter((p) => p.rating >= 4.8).slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </Stagger>
        </div>
      </section>
    )
  }

  return (
    <section className="container-x py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            Saved
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1] tracking-[-0.035em]">
            <SplitText text={`${wishlistItems.length} ${wishlistItems.length === 1 ? 'piece' : 'pieces'} on your list.`} />
          </h1>
        </div>
        <button
          onClick={() => wishlistItems.forEach((p) => addToCart(p, { silent: true }))}
          className="btn btn-ink"
        >
          <ShoppingBag size={15} /> Add all to bag
        </button>
      </div>

      <ul className="mt-14 divide-y divide-line border-y border-line">
        <AnimatePresence initial={false}>
          {wishlistItems.map((p) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, x: 60 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center">
                <Link to={`/product/${p.slug}`} className="shrink-0">
                  <SmartImage id={p.images[0]} alt={p.name} w={300} className="h-40 w-32 rounded-xl" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${p.slug}`}
                    className="font-display text-2xl tracking-tight transition-colors hover:text-brand"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-mute">{p.subtitle}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Stars value={p.rating} size={12} />
                    <span className="text-xs text-mute">{p.reviews} reviews</span>
                  </div>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-soft">{p.desc}</p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                  <p className="font-display text-2xl">{money(p.price)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => addToCart(p)} className="btn btn-primary !px-5 !py-2.5 text-[13px]">
                      <ShoppingBag size={14} /> Add to bag
                    </button>
                    <button
                      onClick={() => toggleWish(p)}
                      aria-label="Remove from wishlist"
                      className="btn btn-ghost !px-3 !py-2.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  )
}
