import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Factory, Hammer, Leaf, Recycle, Scissors, Sparkles } from 'lucide-react'
import { lookbook, testimonials } from '../data/products'
import {
  Appear,
  Counter,
  Magnetic,
  Reveal,
  SectionHeading,
  SmartImage,
  SplitText,
  Stagger,
  staggerItem,
} from '../components/ui/Primitives'

const TIMELINE = [
  {
    year: '2016',
    title: 'One coat, one mill',
    copy: 'Daniel spends a winter in Biella trying to convince a mill to sell 40 metres of double-face wool to someone with no brand and no orders. They eventually say yes.',
    image: '1434389677669-e08b4cac3105',
  },
  {
    year: '2018',
    title: 'The permanent collection',
    copy: 'We stop doing seasons. Twelve pieces stay in stock year-round and get remade only when the fabric genuinely improves. Half our stockists drop us.',
    image: '1441986300917-64674bd600d8',
  },
  {
    year: '2021',
    title: 'Repairs for life',
    copy: 'A customer sends back a five-year-old coat with a torn pocket. We fix it free and realise it should be the policy, not the exception.',
    image: '1469334031218-e382a71b716b',
  },
  {
    year: '2023',
    title: 'The Porto workshop',
    copy: 'We open our own small workshop so repairs, alterations and sampling happen under one roof. Fourteen people, one very good espresso machine.',
    image: '1487222477894-8943e31ef7b2',
  },
  {
    year: '2026',
    title: 'Twenty-eight pieces',
    copy: 'The range is finally where we want it. Six mills, four fibres, and a reorder rate we did not think was possible.',
    image: '1502716119720-b23a93e5fe1b',
  },
]

const PILLARS = [
  { Icon: Leaf, title: 'Natural fibres only', copy: 'Wool, cotton, linen, silk, cashmere. No virgin polyester in anything that touches skin.' },
  { Icon: Factory, title: 'Named mills', copy: 'Every fabric lists the mill and the town. If we cannot name it, we do not use it.' },
  { Icon: Hammer, title: 'Repairs for life', copy: 'Free repairs for as long as you own the piece. Boots included, resoling included.' },
  { Icon: Recycle, title: 'Take-back scheme', copy: 'Send back anything beyond repair and we will recycle the fibre and credit your account.' },
  { Icon: Scissors, title: 'Free tailoring', copy: 'Every order includes a hem or a sleeve adjustment at our workshop, on us.' },
  { Icon: Sparkles, title: 'No seasonal waste', copy: 'A permanent range means no end-of-season landfill. We have never destroyed stock.' },
]

const TEAM = [
  { name: 'Daniel Okafor', role: 'Founder', avatar: '1500648767791-00dcc994a43e' },
  { name: 'Ines Marchetti', role: 'Head of Materials', avatar: '1494790108377-be9c29b29330' },
  { name: 'Marta Lund', role: 'Art Director', avatar: '1438761681033-6461ffad8d80' },
  { name: 'Elias Brandt', role: 'Workshop Lead', avatar: '1507003211169-0a1dd7228f2d' },
]

export default function About() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ------------------------------- hero ------------------------------- */}
      <section ref={heroRef} className="relative h-[78vh] min-h-[520px] overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <SmartImage id={lookbook[0].id} alt="The atelier" w={1600} priority className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

        <motion.div
          style={{ opacity: fade }}
          className="container-x absolute inset-x-0 bottom-0 pb-16 text-white"
        >
          <span className="eyebrow !text-white/70">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            Our story
          </span>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.98] tracking-[-0.035em]">
            <SplitText text="Sixteen people," delay={0.1} />
            <br />
            <SplitText text="one stubborn idea." delay={0.24} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/80"
          >
            That a clothing company can make money by selling you fewer things, better made, and then keeping them alive
            for a decade.
          </motion.p>
        </motion.div>
      </section>

      {/* ------------------------------ manifesto ---------------------------- */}
      <section className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
              The industry makes
              <br />
              <span className="text-gradient italic">twice what it sells.</span>
            </h2>
          </Reveal>
          <div className="space-y-5 text-[15px] leading-relaxed text-soft">
            <Reveal delay={0.1}>
              <p>
                Somewhere between 30 and 40 percent of everything produced by the clothing industry each year is never
                worn. It is made, shipped, discounted, and then destroyed — because destroying it protects the price of
                next season.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p>
                We took the opposite bet in 2018 and stopped doing seasons entirely. Twenty-eight pieces, in stock all
                year, remade only when the cloth genuinely improves. It cost us half our stockists and most of our
                growth rate for two years.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="text-ink">
                It also means we have never once destroyed a garment, and 94% of our customers buy from us again.
              </p>
            </Reveal>

            <Stagger className="!mt-10 grid grid-cols-3 gap-6">
              {[
                { to: 0, suffix: '', label: 'Garments destroyed, ever' },
                { to: 94, suffix: '%', label: 'Customers who reorder' },
                { to: 2.4, suffix: '%', decimals: 1, label: 'Come back for repair' },
              ].map((s) => (
                <motion.div key={s.label} variants={staggerItem}>
                  <p className="font-display text-4xl leading-none tracking-tight">
                    <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
                  </p>
                  <p className="mt-2 text-xs leading-snug text-mute">{s.label}</p>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ------------------------------ timeline ----------------------------- */}
      <section className="border-y border-line bg-bg2/50 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="How we got here" title="Ten years, five turning points." align="center" />

          <div className="relative mt-20">
            {/* spine */}
            <div className="absolute left-[19px] top-0 h-full w-px bg-line md:left-1/2" />
            <Appear
              from={{ scaleY: 0 }}
              to={{ scaleY: 1 }}
              duration={1.6}
              className="absolute left-[19px] top-0 h-full w-px origin-top bg-gradient-to-b from-brand via-rose to-amber md:left-1/2"
            />

            <div className="space-y-16">
              {TIMELINE.map((t, i) => (
                <Appear
                  key={t.year}
                  from={{ opacity: 0, y: 44 }}
                  to={{ opacity: 1, y: 0 }}
                  duration={0.8}
                  className={`relative grid gap-6 pl-14 md:grid-cols-2 md:gap-14 md:pl-0 ${
                    i % 2 === 0 ? '' : 'md:[direction:rtl]'
                  }`}
                >
                  {/* node */}
                  <span className="absolute left-[13px] top-2 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-brand to-rose ring-4 ring-bg md:left-1/2 md:-translate-x-1/2" />

                  <div className={`[direction:ltr] ${i % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}>
                    <p className="font-display text-5xl leading-none tracking-tight text-gradient">{t.year}</p>
                    <h3 className="mt-3 font-display text-2xl tracking-tight">{t.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-soft">{t.copy}</p>
                  </div>

                  <div className={`[direction:ltr] ${i % 2 === 0 ? 'md:pl-14' : 'md:pr-14'}`}>
                    <div className="overflow-hidden rounded-2xl">
                      <SmartImage id={t.image} alt={t.title} w={700} className="aspect-[16/10] w-full" />
                    </div>
                  </div>
                </Appear>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ pillars ----------------------------- */}
      <section className="container-x py-24 sm:py-32">
        <SectionHeading
          eyebrow="What we promise"
          title="Six things we will not compromise on."
          copy="Not marketing lines — each one costs us real money, and we have kept all six for at least three years."
          align="center"
        />
        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ Icon, title, copy }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-line p-7 transition-colors duration-500 hover:border-line2"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-brand/20 to-rose/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-ink/5 transition-colors duration-500 group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-rose group-hover:text-white">
                <Icon size={20} />
              </span>
              <h3 className="relative mt-5 font-display text-xl tracking-tight">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-soft">{copy}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* -------------------------------- team ------------------------------ */}
      <section className="border-t border-line py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="The people" title="Who actually makes it." align="between" />
          <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <motion.figure key={m.name} variants={staggerItem} className="group text-center">
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                  <SmartImage
                    id={m.avatar}
                    alt={m.name}
                    w={400}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                </div>
                <figcaption className="mt-5">
                  <p className="font-display text-xl tracking-tight">{m.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-mute">{m.role}</p>
                </figcaption>
              </motion.figure>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <figure className="mx-auto mt-24 max-w-3xl text-center">
              <p className="font-display text-[clamp(1.4rem,3.2vw,2.2rem)] leading-[1.35] tracking-[-0.015em]">
                “{testimonials[4].quote}”
              </p>
              <figcaption className="mt-6 flex items-center justify-center gap-3">
                <SmartImage id={testimonials[4].avatar} alt={testimonials[4].name} w={100} className="h-10 w-10 rounded-full" />
                <span className="text-left">
                  <span className="block text-sm font-semibold">{testimonials[4].name}</span>
                  <span className="block text-xs text-mute">{testimonials[4].role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="mt-16 flex justify-center">
            <Magnetic>
              <Link to="/shop" className="btn btn-primary px-8 py-3.5">
                See what we make <ArrowRight size={16} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  )
}
