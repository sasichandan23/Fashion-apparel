import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { posts } from '../data/journal'
import { cn } from '../lib/utils'
import { Reveal, SmartImage, SplitText, Stagger, staggerItem } from '../components/ui/Primitives'

const TAGS = ['All', ...new Set(posts.map((p) => p.tag))]

export default function Journal() {
  const [tag, setTag] = useState('All')
  const list = tag === 'All' ? posts : posts.filter((p) => p.tag === tag)
  const [lead, ...rest] = list

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pb-14 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute left-[-15%] top-[-40%] h-[50vh] w-[50vw] aurora opacity-30" />
        <div className="container-x relative">
          <span className="eyebrow">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            The Journal
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,6.4vw,4.8rem)] leading-[0.98] tracking-[-0.035em]">
            <SplitText text="Notes from the atelier." />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-soft">
              Mill visits, care guides, and the occasional argument with the industry. Written by the people who make
              the clothes, not a content team.
            </p>
          </Reveal>

          <div className="mt-9 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button key={t} onClick={() => setTag(t)} className={cn('chip relative px-4 py-2', tag === t && 'text-bg')}>
                {tag === t && (
                  <motion.span
                    layoutId="journal-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={tag}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* lead story */}
          {lead && (
            <section className="container-x py-16">
              <Link to={`/journal/${lead.slug}`} data-cursor="read" className="group grid gap-10 lg:grid-cols-2 lg:items-center">
                <div className="overflow-hidden rounded-3xl">
                  <SmartImage
                    id={lead.image}
                    alt={lead.title}
                    w={1000}
                    priority
                    className="aspect-[4/3] w-full"
                    imgClassName="transition-transform duration-[1.5s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div>
                  <p className="eyebrow">
                    {lead.tag} · {lead.date}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-brand">
                    {lead.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-soft">{lead.excerpt}</p>
                  <div className="mt-7 flex items-center gap-4">
                    <SmartImage id={lead.authorAvatar} alt={lead.author} w={100} className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold">{lead.author}</p>
                      <p className="flex items-center gap-1.5 text-xs text-mute">
                        <Clock size={11} /> {lead.readTime}
                      </p>
                    </div>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                    <span className="link-underline">Read the piece</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* grid */}
          <section className="container-x border-t border-line py-16">
            <Stagger className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <motion.article key={p.slug} variants={staggerItem} className="group">
                  <Link to={`/journal/${p.slug}`} data-cursor="read">
                    <div className="overflow-hidden rounded-2xl">
                      <SmartImage
                        id={p.image}
                        alt={p.title}
                        w={700}
                        className="aspect-[16/11] w-full"
                        imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
                      />
                    </div>
                    <p className="eyebrow mt-5">
                      {p.tag} · {p.readTime}
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-brand">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-soft">{p.excerpt}</p>
                    <div className="mt-5 flex items-center gap-2.5">
                      <SmartImage id={p.authorAvatar} alt={p.author} w={80} className="h-7 w-7 rounded-full" />
                      <span className="text-xs text-mute">
                        {p.author} · {p.date}
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </Stagger>

            {list.length === 0 && (
              <p className="py-20 text-center text-sm text-mute">Nothing filed under “{tag}” yet.</p>
            )}
          </section>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
