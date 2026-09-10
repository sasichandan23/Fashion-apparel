import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Heart, Scale, ShoppingBag } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { cn, money } from '../../lib/utils'
import { SmartImage, Stars, staggerItem } from '../ui/Primitives'

const badgeStyle = {
  New: 'bg-brand text-white',
  Bestseller: 'bg-ink text-bg',
  Limited: 'bg-gradient-to-r from-brand to-rose text-white',
  Sale: 'bg-rose text-white',
}

export default function ProductCard({ product, index = 0, onQuickView, variant = 'grid' }) {
  const { addToCart, toggleWish, toggleCompare, inWishlist, inCompare } = useStore()
  const [colorIdx, setColorIdx] = useState(0)
  const wished = inWishlist(product.id)
  const compared = inCompare(product.id)
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0

  return (
    <motion.article
      variants={staggerItem}
      className={cn('group relative', variant === 'list' && 'sm:flex sm:gap-6')}
    >
      <div className={cn('relative overflow-hidden rounded-2xl bg-bg2', variant === 'list' && 'sm:w-56 sm:shrink-0')}>
        <Link to={`/product/${product.slug}`} data-cursor="view" className="block">
          <div className="relative aspect-[4/5]">
            <SmartImage
              id={product.images[0]}
              alt={product.name}
              w={700}
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.08]"
            />
            {product.images[1] && (
              <SmartImage
                id={product.images[1]}
                alt=""
                w={700}
                className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                imgClassName="scale-[1.04]"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]', badgeStyle[product.badge])}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
              −{discount}%
            </span>
          )}
        </div>

        {/* hover actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <IconAction
            active={wished}
            onClick={() => toggleWish(product)}
            label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            delay={0}
          >
            <Heart size={15} className={cn(wished && 'fill-current')} />
          </IconAction>
          <IconAction active={compared} onClick={() => toggleCompare(product)} label="Compare" delay={0.05}>
            <Scale size={15} />
          </IconAction>
          {onQuickView && (
            <IconAction onClick={() => onQuickView(product)} label="Quick view" delay={0.1}>
              <Eye size={15} />
            </IconAction>
          )}
        </div>

        {/* add to bag */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[130%] opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => addToCart(product, { color: product.colors[colorIdx].name })}
            className="btn btn-primary w-full py-2.5 text-[13px]"
          >
            <ShoppingBag size={15} /> Add to bag
          </button>
        </div>
      </div>

      {/* meta */}
      <div className={cn('pt-4', variant === 'list' && 'sm:flex-1 sm:pt-0')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.slug}`}>
              <h3 className="truncate text-[15px] font-semibold tracking-tight transition-colors group-hover:text-brand">
                {product.name}
              </h3>
            </Link>
            <p className="mt-0.5 truncate text-[13px] text-mute">{product.subtitle}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[15px] font-semibold">{money(product.price)}</p>
            {product.compareAt && <p className="text-xs text-mute line-through">{money(product.compareAt)}</p>}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  'relative h-4 w-4 rounded-full border transition-all duration-300',
                  i === colorIdx ? 'border-ink scale-110' : 'border-line hover:scale-110'
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <Stars value={product.rating} size={12} />
        </div>

        {variant === 'list' && (
          <p className="mt-4 hidden max-w-prose text-sm leading-relaxed text-soft sm:block">{product.desc}</p>
        )}
      </div>
    </motion.article>
  )
}

function IconAction({ children, onClick, label, active, delay = 0 }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      style={{ transitionDelay: `${delay}s` }}
      className={cn(
        'grid h-9 w-9 translate-x-3 place-items-center rounded-full opacity-0 backdrop-blur-md transition-[opacity,transform,background,color] duration-400 group-hover:translate-x-0 group-hover:opacity-100',
        active ? 'bg-ink text-bg opacity-100 translate-x-0' : 'bg-white/85 text-black hover:bg-white'
      )}
    >
      {children}
    </motion.button>
  )
}
