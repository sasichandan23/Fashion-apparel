import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Instagram, Send, Twitter, Youtube } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { Reveal, Marquee } from '../ui/Primitives'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All pieces', to: '/shop' },
      { label: 'New arrivals', to: '/shop?badge=New' },
      { label: 'Bestsellers', to: '/shop?badge=Bestseller' },
      { label: 'Final cut', to: '/shop?badge=Sale' },
      { label: 'Gift cards', to: '/contact' },
    ],
  },
  {
    title: 'Atelier',
    links: [
      { label: 'Our story', to: '/about' },
      { label: 'The Journal', to: '/journal' },
      { label: 'Materials', to: '/about' },
      { label: 'Repairs for life', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Care',
    links: [
      { label: 'Shipping', to: '/contact' },
      { label: 'Returns', to: '/contact' },
      { label: 'Size guide', to: '/contact' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Compare', to: '/compare' },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { toast } = useStore()

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('That email does not look right', 'warn')
      return
    }
    setSent(true)
    toast('Welcome to the list — check your inbox', 'success')
    setTimeout(() => {
      setSent(false)
      setEmail('')
    }, 2600)
  }

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-line bg-bg2">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70vw] -translate-x-1/2 aurora opacity-25" />

      <div className="container-x relative py-20">
        {/* newsletter */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">
              <span className="inline-block h-px w-6 bg-current opacity-60" />
              The list
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl">
              First look at every drop, <span className="text-gradient">before it goes public.</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-soft">
              Roughly one letter a month. Studio notes, mill visits, and early access to limited runs. No noise.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <form onSubmit={submit} className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  aria-label="Email address"
                  className="field flex-1"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-primary shrink-0"
                >
                  {sent ? (
                    <>
                      <Check size={16} /> Subscribed
                    </>
                  ) : (
                    <>
                      Join <Send size={15} />
                    </>
                  )}
                </motion.button>
              </div>
              <p className="mt-3 text-xs text-mute">
                By joining you agree to our privacy policy. Unsubscribe in one click, any time.
              </p>
            </form>
          </Reveal>
        </div>

        <div className="my-16 h-px bg-line" />

        {/* link columns */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="font-display text-2xl tracking-[0.14em]">
              AUR<span className="text-gradient">É</span>LIA
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-soft">
              A small atelier making a small number of things properly. Natural fibres, named mills, repairs free for
              life.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  whileHover={{ y: -3, scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Social link"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:border-line2 hover:bg-ink hover:text-bg"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1 text-sm text-soft transition-colors hover:text-ink"
                    >
                      <span className="link-underline">{l.label}</span>
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* oversized wordmark */}
      <div className="pointer-events-none select-none">
        <Marquee speed={46} pauseOnHover={false}>
          <span className="whitespace-nowrap font-display text-[16vw] leading-[0.85] tracking-[-0.03em] text-ink/6 dark:text-white/6">
            AURÉLIA · CONSIDERED FASHION · SINCE 2016 ·&nbsp;
          </span>
        </Marquee>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-mute sm:flex-row">
        <p>© {new Date().getFullYear()} Aurélia Atelier. A front-end concept build.</p>
        <p className="flex items-center gap-4">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Accessibility</span>
        </p>
      </div>
    </footer>
  )
}
