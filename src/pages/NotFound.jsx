import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import { Magnetic, SmartImage, SplitText } from '../components/ui/Primitives'
import { money } from '../lib/utils'

export default function NotFound() {
  const { setSearchOpen } = useStore()
  const picks = products.filter((p) => p.badge === 'Bestseller').slice(0, 3)

  return (
    <section className="container-x relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[55vh] w-[70vw] -translate-x-1/2 aurora opacity-40" />
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-[clamp(6rem,22vw,16rem)] font-normal leading-[0.8] tracking-[-0.05em] text-gradient"
      >
        404
      </motion.p>

      <h1 className="mt-6 font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.05] tracking-[-0.03em]">
        <SplitText text="This one is out of stock." delay={0.3} />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-4 max-w-md text-[15px] leading-relaxed text-soft"
      >
        The page you were after does not exist — or it moved when we cut the range down. Here is the way back.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.8 }}
        className="mt-9 flex flex-wrap justify-center gap-3"
      >
        <Magnetic>
          <Link to="/shop" className="btn btn-primary px-8 py-3.5">
            Shop the collection <ArrowRight size={16} />
          </Link>
        </Magnetic>
        <button onClick={() => setSearchOpen(true)} className="btn btn-ghost px-7 py-3.5">
          <Search size={15} /> Search instead
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.8 }}
        className="mt-20 w-full max-w-3xl"
      >
        <p className="eyebrow justify-center">Or try one of these</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {picks.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/product/${p.slug}`} className="group block">
                <div className="overflow-hidden rounded-2xl">
                  <SmartImage
                    id={p.images[0]}
                    alt={p.name}
                    w={500}
                    className="aspect-[4/5] w-full"
                    imgClassName="transition-transform duration-[1.3s] group-hover:scale-[1.07]"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold transition-colors group-hover:text-brand">{p.name}</p>
                <p className="text-xs text-mute">{money(p.price)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
