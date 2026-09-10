import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { cn, money } from '../../lib/utils'
import { SmartImage } from '../ui/Primitives'

const FREE_SHIP = 250

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, subtotal, savings, shipping, setQty, removeLine, count } = useStore()
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100)
  const remaining = Math.max(0, FREE_SHIP - subtotal)

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[140] bg-black/55 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[141] flex w-[min(94vw,440px)] flex-col border-l border-line bg-bg"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="font-display text-2xl tracking-tight">Your bag</h2>
                <p className="text-xs text-mute">{count} {count === 1 ? 'piece' : 'pieces'}</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
                className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-ink/5"
              >
                <X size={19} />
              </button>
            </div>

            {/* free shipping meter */}
            {cartLines.length > 0 && (
              <div className="border-b border-line px-6 py-4">
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <Truck size={14} className="text-brand" />
                  {remaining > 0 ? (
                    <span className="text-soft">
                      <b className="text-ink">{money(remaining)}</b> away from free shipping
                    </span>
                  ) : (
                    <span className="font-semibold text-jade">Free shipping unlocked</span>
                  )}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand via-rose to-amber"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            {/* lines */}
            <div className="flex-1 overflow-y-auto px-6">
              {cartLines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                    className="grid h-20 w-20 place-items-center rounded-full border border-line"
                  >
                    <ShoppingBag size={26} className="text-mute" />
                  </motion.div>
                  <div>
                    <p className="font-display text-xl">Nothing here yet</p>
                    <p className="mt-1 max-w-[24ch] text-sm text-mute">
                      Your bag is waiting. Start with the pieces everyone reorders.
                    </p>
                  </div>
                  <Link to="/shop" onClick={() => setCartOpen(false)} className="btn btn-ink">
                    Browse the collection <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {cartLines.map((line) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, x: 40 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <Link to={`/product/${line.product.slug}`} onClick={() => setCartOpen(false)}>
                            <SmartImage
                              id={line.product.images[0]}
                              alt={line.product.name}
                              w={220}
                              className="h-28 w-22 shrink-0 rounded-xl"
                            />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex justify-between gap-2">
                              <Link
                                to={`/product/${line.product.slug}`}
                                onClick={() => setCartOpen(false)}
                                className="truncate text-sm font-semibold hover:text-brand"
                              >
                                {line.product.name}
                              </Link>
                              <button
                                onClick={() => removeLine(line.key)}
                                aria-label="Remove"
                                className="text-mute transition-colors hover:text-rose"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p className="mt-0.5 text-xs text-mute">
                              {line.color} · Size {line.size}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center rounded-full border border-line">
                                <QtyBtn onClick={() => setQty(line.key, line.qty - 1)} label="Decrease">
                                  <Minus size={13} />
                                </QtyBtn>
                                <span className="w-7 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                                <QtyBtn onClick={() => setQty(line.key, Math.min(10, line.qty + 1))} label="Increase">
                                  <Plus size={13} />
                                </QtyBtn>
                              </div>
                              <span className="text-sm font-semibold">{money(line.product.price * line.qty)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* footer */}
            {cartLines.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <dl className="space-y-2 text-sm">
                  <Row label="Subtotal" value={money(subtotal)} />
                  {savings > 0 && <Row label="You save" value={`−${money(savings)}`} accent />}
                  <Row label="Shipping" value={shipping === 0 ? 'Free' : money(shipping)} />
                  <div className="!mt-4 flex items-baseline justify-between border-t border-line pt-4">
                    <dt className="font-display text-lg">Total</dt>
                    <dd className="font-display text-2xl">{money(subtotal + shipping)}</dd>
                  </div>
                </dl>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="btn btn-primary mt-5 w-full"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="mt-3 block text-center text-xs font-semibold text-mute transition-colors hover:text-ink"
                >
                  View full bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between">
      <dt className="text-soft">{label}</dt>
      <dd className={cn('font-semibold', accent && 'text-jade')}>{value}</dd>
    </div>
  )
}

function QtyBtn({ children, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-ink/8"
    >
      {children}
    </button>
  )
}
