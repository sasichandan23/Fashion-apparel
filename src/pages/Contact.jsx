import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { cn } from '../lib/utils'
import { Reveal, SectionHeading, SplitText, Stagger, staggerItem } from '../components/ui/Primitives'

const STUDIOS = [
  { city: 'Porto', line1: 'Rua das Flores 128', line2: '4050-262 Porto, Portugal', hours: 'Mon–Sat · 10:00–19:00' },
  { city: 'Copenhagen', line1: 'Værnedamsvej 6', line2: '1819 Frederiksberg, Denmark', hours: 'Tue–Sat · 11:00–18:00' },
  { city: 'Kyoto', line1: '284 Shokokuji Monzencho', line2: 'Kamigyo Ward, Kyoto', hours: 'Wed–Sun · 12:00–19:00' },
]

const FAQ = [
  {
    q: 'How does the repairs-for-life promise work?',
    a: 'Email us a photo of the damage and we send a prepaid label. Our Porto workshop repairs it and ships it back, free, for as long as you own the piece. Boots include resoling. There is no receipt requirement — we can look the order up, and if we cannot, we will fix it anyway.',
  },
  {
    q: 'What is your returns window?',
    a: 'Thirty days from delivery, free, for any reason. The label is already in the box. Items must be unworn with tags attached — though if something failed in normal wear, that is a repair claim rather than a return, and there is no time limit on those.',
  },
  {
    q: 'Do you offer alterations?',
    a: 'Yes, and the first one on any order is free. Hems, sleeve length and simple taper are all handled in Porto with a turnaround of about five working days. Send measurements or bring the piece into any of the three studios.',
  },
  {
    q: 'Why is there no seasonal sale?',
    a: 'Because we do not overproduce, there is nothing to clear. Prices are the same in January as in June. The only reduced pieces are in Final Cut — fabrics we are genuinely retiring, marked down once and never restocked.',
  },
  {
    q: 'Where are the clothes actually made?',
    a: 'Wool and outerwear in Biella, Italy. Knitwear in Dumfries, Scotland. Jersey and shirting in Guimarães, Portugal. Footwear in Alicante, Spain. Every product page names the mill for that specific fabric.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'To 42 countries. Free over $250, otherwise $12 flat. Duties are prepaid for the EU, UK, US, Canada, Japan and Australia — the price you see at checkout is the price you pay at the door.',
  },
]

export default function Contact() {
  const { toast } = useStore()
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ name: '', email: '', topic: 'A question about an order', message: '' })

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (form.name.trim().length < 2) err.name = 'Tell us your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email'
    if (form.message.trim().length < 12) err.message = 'A little more detail helps'
    setErrors(err)
    if (Object.keys(err).length) return

    setSent(true)
    toast('Message sent — we reply within a day', 'success')
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', topic: form.topic, message: '' })
    }, 3200)
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pb-14 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute right-[-15%] top-[-40%] h-[50vh] w-[50vw] aurora opacity-30" />
        <div className="container-x relative">
          <span className="eyebrow">
            <span className="inline-block h-px w-6 bg-current opacity-60" />
            Say hello
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,6.4vw,4.8rem)] leading-[0.98] tracking-[-0.035em]">
            <SplitText text="A real person will reply." />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-soft">
              No ticket numbers, no chatbot. Four of us answer email and we get through everything within one working
              day — usually much faster.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          {/* form */}
          <div>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" error={errors.name}>
                  <input value={form.name} onChange={set('name')} placeholder="Ines Marchetti" className="field" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input value={form.email} onChange={set('email')} placeholder="you@studio.com" className="field" />
                </Field>
              </div>

              <Field label="What is it about?">
                <div className="relative">
                  <select value={form.topic} onChange={set('topic')} className="field cursor-pointer appearance-none pr-10">
                    {[
                      'A question about an order',
                      'Repairs and alterations',
                      'Sizing advice',
                      'Wholesale and stockists',
                      'Press',
                      'Something else',
                    ].map((t) => (
                      <option key={t} className="bg-elev">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute" />
                </div>
              </Field>

              <Field label="Message" error={errors.message}>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={6}
                  placeholder="Tell us what you need — the more detail, the better the answer."
                  className="field resize-none"
                />
              </Field>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn('btn w-full py-3.5 sm:w-auto sm:px-9', sent ? 'btn-ink' : 'btn-primary')}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {sent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} /> Message sent
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      Send message <Send size={15} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-xs text-mute">
                This is a front-end demo, so nothing is actually transmitted — the form validates and responds locally.
              </p>
            </form>
          </div>

          {/* details */}
          <div className="space-y-8">
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { Icon: Mail, label: 'Email', value: 'hello@aurelia.studio', sub: 'Replies within one working day' },
                { Icon: Phone, label: 'Phone', value: '+351 220 145 880', sub: 'Mon–Fri · 09:00–18:00 WET' },
                { Icon: Clock, label: 'Repairs desk', value: 'repairs@aurelia.studio', sub: 'Send a photo, get a label' },
              ].map(({ Icon, label, value, sub }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="group flex items-start gap-4 rounded-2xl border border-line p-5 transition-colors hover:border-line2"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink/5 transition-colors duration-500 group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-rose group-hover:text-white">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">{label}</p>
                    <p className="mt-1 font-semibold">{value}</p>
                    <p className="text-xs text-mute">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </Stagger>

            <div>
              <p className="eyebrow mb-4">
                <MapPin size={12} /> Three studios
              </p>
              <div className="divide-y divide-line border-y border-line">
                {STUDIOS.map((s) => (
                  <div key={s.city} className="flex items-baseline justify-between gap-6 py-4">
                    <div>
                      <p className="font-display text-xl tracking-tight">{s.city}</p>
                      <p className="mt-0.5 text-xs text-mute">
                        {s.line1} · {s.line2}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-[11px] text-mute">{s.hours}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-bg2/40 py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Before you write" title="The six questions we get most." align="center" />
          <div className="mx-auto mt-14 max-w-3xl divide-y divide-line border-y border-line">
            {FAQ.map((f, i) => (
              <FaqItem key={f.q} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
        <span className="font-display text-lg leading-snug tracking-tight sm:text-xl">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
          <ChevronDown size={19} className="text-mute" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-prose pb-7 text-[15px] leading-relaxed text-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-mute">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs font-semibold text-rose"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  )
}
