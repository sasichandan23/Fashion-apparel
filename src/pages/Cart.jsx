import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import { cn, money } from '../lib/utils'
import ProductCard from '../components/shop/ProductCard'
import { Reveal, SectionHeading, SmartImage, SplitText, Stagger } from '../components/ui/Primitives'

const CODES = { AURELIA10: 0.1, ATELIER: 0.15 }

export default function Cart() {
  const { cartLines, subtotal, shipping, savings, setQty, removeLine, clearCart, count, toast } = useStore()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)

  const discount = applied ? subtotal * CODES[applied] : 0
  const total = subtotal - discount + shipping

  const apply = (e) => {
    e.preventDefault()
    const key = code.trim().toUpperCase()
    if (CODES[key]) {
      setApplied(key)
      toast(`${key} applied — ${CODES[key] * 100}% off`, 'success')
    } else {
      toast('That code is not valid', 'warn')
    }
  }

  if (cartLines.length === 0) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="grid h-24 w-24 place-items-center rounded-full border border-line"
        >
          <ShoppingBag size={30} className="text-mute" />
        </motion.div>
        <h1 className="mt-8 font-display text-5xl tracking-tight">Your bag is empty</h1>
        <p className="mt-3 max-w-sm text-[15px] text-soft">
          Twenty-eight pieces are waiting. Most people start with the tee or the knit.
        </p>
        <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">
          Start browsing <ArrowRight size={16} />
        </Link>

        <div className="mt-24 w-full text-left">
          <SectionHeading eyebrow="Popular" title="What everyone reorders." align="between" />
          <Stagger className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.filter((p) => p.badge === 'Bestseller').slice(0, 4).map((p, i) => (
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
            Your bag
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1] tracking-[-0.035em]">
            <SplitText text={`${count} ${count === 1 ? 'piece' : 'pieces'}, well chosen.`} />
          </h1>
        </div>
        <button onClick={clearCart} className="text-xs font-semibold text-mute transition-colors hover:text-rose">
          Empty the bag
        </button>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* lines */}
        <ul className="divide-y divide-line border-y border-line">
          <AnimatePresence initial={false}>
            {cartLines.map((line) => (
              <motion.li
                key={line.key}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, x: 60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex gap-5 py-7">
                  <Link to={`/product/${line.product.slug}`} className="shrink-0">
                    <SmartImage
                      id={line.product.images[0]}
                      alt={line.product.name}
                      w={300}
                      className="h-36 w-28 rounded-xl sm:h-44 sm:w-36"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/product/${line.product.slug}`}
                          className="font-display text-xl tracking-tight transition-colors hover:text-brand"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-mute">{line.product.subtitle}</p>
                        <p className="mt-2 text-xs text-soft">
                          {line.color} · Size {line.size}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold">{money(line.product.price * line.qty)}</p>
                        {line.product.compareAt && (
                          <p className="text-xs text-mute line-through">
                            {money(line.product.compareAt * line.qty)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label="Decrease"
                          className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-ink/5"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                        <button
                          onClick={() => setQty(line.key, Math.min(10, line.qty + 1))}
                          aria-label="Increase"
                          className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-ink/5"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeLine(line.key)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute transition-colors hover:text-rose"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal dir="left">
            <div className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl">Summary</h2>

              <form onSubmit={apply} className="mt-5 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code"
                  aria-label="Promo code"
                  className="field flex-1 py-2.5 text-[13px]"
                />
                <button type="submit" className="btn btn-ghost !px-4 !py-2.5 text-[13px]">
                  <Tag size={14} /> Apply
                </button>
              </form>
              <p className="mt-2 text-[11px] text-mute">Try AURELIA10 or ATELIER</p>

              <dl className="mt-6 space-y-3 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                {savings > 0 && <Row label="Product savings" value={`−${money(savings)}`} accent />}
                {applied && <Row label={`Promo ${applied}`} value={`−${money(discount)}`} accent />}
                <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                <Row label="Estimated tax" value="Calculated at checkout" muted />
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                <span className="font-display text-lg">Total</span>
                <motion.span key={total} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl">
                  {money(total)}
                </motion.span>
              </div>

              <Link to="/checkout" className="btn btn-primary mt-6 w-full py-3.5">
                Proceed to checkout <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="mt-3 block text-center text-xs font-semibold text-mute transition-colors hover:text-ink"
              >
                Continue shopping
              </Link>
            </div>
          </Reveal>
        </aside>
      </div>

      <div className="mt-28">
        <SectionHeading eyebrow="Add to it" title="Completes the look." align="between" />
        <Stagger className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products
            .filter((p) => !cartLines.some((l) => l.id === p.id))
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
        </Stagger>
      </div>
    </section>
  )
}

function Row({ label, value, accent, muted }) {
  return (
    <div className="flex justify-between">
      <dt className="text-soft">{label}</dt>
      <dd className={cn('font-semibold', accent && 'text-jade', muted && 'text-xs font-normal text-mute')}>{value}</dd>
    </div>
  )
}
