import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { postBySlug, posts } from '../data/journal'
import NotFound from './NotFound'
import { Reveal, SmartImage, SplitText, Stagger, staggerItem } from '../components/ui/Primitives'

export default function JournalPost() {
  const { slug } = useParams()
  const post = postBySlug(slug)

  const heroRef = useRef(null)
  const articleRef = useRef(null)
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(heroP, [0, 1], ['0%', '26%'])
  const scale = useTransform(heroP, [0, 1], [1, 1.16])

  const { scrollYProgress: readP } = useScroll({ target: articleRef, offset: ['start 0.9', 'end 0.4'] })
  const bar = useSpring(readP, { stiffness: 150, damping: 28 })

  if (!post) return <NotFound />

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      {/* reading progress */}
      <motion.div
        style={{ scaleX: bar }}
        className="fixed inset-x-0 top-0 z-[85] h-[3px] origin-left bg-gradient-to-r from-brand via-rose to-amber"
      />

      {/* hero */}
      <section ref={heroRef} className="relative h-[62vh] min-h-[420px] overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <SmartImage id={post.image} alt={post.title} w={1600} priority className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />

        <div className="container-x absolute inset-x-0 bottom-0 pb-14 text-white">
          <Link
            to="/journal"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> The Journal
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
            {post.tag} · {post.date} · {post.readTime}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2rem,5.6vw,4.2rem)] leading-[1.02] tracking-[-0.035em]">
            <SplitText text={post.title} delay={0.1} />
          </h1>
        </div>
      </section>

      {/* body */}
      <article ref={articleRef} className="container-x py-16">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[200px_1fr]">
          {/* author rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start">
              <SmartImage id={post.authorAvatar} alt={post.author} w={140} className="h-14 w-14 rounded-full" />
              <div>
                <p className="text-sm font-semibold">{post.author}</p>
                <p className="text-xs text-mute">{post.authorRole}</p>
              </div>
            </div>
            <div className="mt-6 hidden space-y-2 border-t border-line pt-6 text-xs text-mute lg:block">
              <p className="flex items-center gap-1.5">
                <Clock size={12} /> {post.readTime}
              </p>
              <p>{post.date}</p>
            </div>
          </aside>

          <div className="max-w-prose">
            <Reveal>
              <p className="font-display text-[clamp(1.25rem,2.3vw,1.6rem)] leading-[1.5] tracking-[-0.01em] text-ink">
                {post.excerpt}
              </p>
            </Reveal>

            <div className="mt-10 space-y-7">
              {post.body.map((block, i) => {
                if (block.type === 'h')
                  return (
                    <Reveal key={i} delay={0.05}>
                      <h2 className="pt-4 font-display text-3xl leading-tight tracking-[-0.02em]">{block.text}</h2>
                    </Reveal>
                  )
                if (block.type === 'quote')
                  return (
                    <Reveal key={i} delay={0.05}>
                      <blockquote className="relative my-10 border-l-2 border-brand py-2 pl-7">
                        <p className="font-display text-[clamp(1.3rem,2.6vw,1.85rem)] leading-[1.4] tracking-[-0.015em]">
                          “{block.text}”
                        </p>
                      </blockquote>
                    </Reveal>
                  )
                return (
                  <Reveal key={i} delay={0.05}>
                    <p className="text-[16px] leading-[1.75] text-soft">{block.text}</p>
                  </Reveal>
                )
              })}
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <p className="text-xs text-mute">Filed under {post.tag}</p>
              <Link to="/shop" className="btn btn-ghost">
                Shop the collection <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* more */}
      <section className="container-x border-t border-line py-20">
        <p className="eyebrow mb-10">
          <span className="inline-block h-px w-6 bg-current opacity-60" />
          Keep reading
        </p>
        <Stagger className="grid gap-8 md:grid-cols-3">
          {others.map((p) => (
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
                <h3 className="mt-2 font-display text-xl leading-snug tracking-tight transition-colors group-hover:text-brand">
                  {p.title}
                </h3>
              </Link>
            </motion.article>
          ))}
        </Stagger>
      </section>
    </>
  )
}
