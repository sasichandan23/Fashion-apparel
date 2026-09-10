import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CreditCard, Lock, Package, Truck, Zap } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { confetti } from '../lib/confetti'
import { cn, money } from '../lib/utils'
import { SmartImage, SplitText } from '../components/ui/Primitives'

const STEPS = ['Contact', 'Delivery', 'Payment']

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard', copy: '3–5 working days · carbon neutral', price: 0, Icon: Truck },
  { id: 'express', label: 'Express', copy: 'Next working day before 12:00', price: 18, Icon: Zap },
  { id: 'pickup', label: 'Studio pickup', copy: 'Collect in Porto, ready in 2 hours', price: 0, Icon: Package },
]

export default function Checkout() {
  const { cartLines, subtotal, placeOrder, count } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [ship, setShip] = useState('standard')
  const [order, setOrder] = useState(null)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postcode: '',
    country: 'Portugal',
    card: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  })

  const shipPrice = SHIPPING_OPTIONS.find((s) => s.id === ship).price
  const total = subtotal + shipPrice

  useEffect(() => {
    if (cartLines.length === 0 && !order) nav('/cart', { replace: true })
  }, [cartLines.length, order, nav])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = (which) => {
    const e = {}
    if (which === 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
      if (form.firstName.trim().length < 2) e.firstName = 'Required'
      if (form.lastName.trim().length < 2) e.lastName = 'Required'
    }
    if (which === 1) {
      if (ship !== 'pickup') {
        if (form.address.trim().length < 4) e.address = 'Required'
        if (form.city.trim().length < 2) e.city = 'Required'
        if (form.postcode.trim().length < 3) e.postcode = 'Required'
      }
    }
    if (which === 2) {
      if (form.card.replace(/\s/g, '').length < 15) e.card = 'Enter a 16-digit card number'
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'MM/YY'
      if (form.cvc.length < 3) e.cvc = '3 digits'
      if (form.nameOnCard.trim().length < 3) e.nameOnCard = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    if (step < 2) {
      setStep((s) => s + 1)
      return
    }
    const placed = placeOrder({ ...form, shipping: ship })
    setOrder(placed)
    setTimeout(() => confetti(), 250)
  }

  /* ----------------------------- confirmation ---------------------------- */
  if (order) {
    return (
      <section className="container-x flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.1 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand via-rose to-amber text-white"
        >
          <Check size={34} strokeWidth={3} />
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[1] tracking-[-0.035em]">
          <SplitText text="Thank you." delay={0.3} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-4 max-w-md text-[15px] leading-relaxed text-soft"
        >
          Order <b className="text-ink">{order.id}</b> is confirmed. A receipt is on its way to{' '}
          <b className="text-ink">{form.email}</b>. We hand-check every piece before it leaves the studio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-10 w-full max-w-lg rounded-2xl border border-line p-6 text-left"
        >
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-mute">Order summary</span>
            <span className="font-display text-2xl">{money(order.total)}</span>
          </div>
          <ul className="mt-4 space-y-4">
            {order.lines.map((l, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + i * 0.07 }}
                className="flex items-center gap-4"
              >
                <SmartImage id={l.image} alt={l.name} w={140} className="h-16 w-13 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.name}</p>
                  <p className="text-xs text-mute">
                    {l.color} · {l.size} · ×{l.qty}
                  </p>
                </div>
                <span className="text-sm font-semibold">{money(l.price * l.qty)}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-xs text-mute">
            <Truck size={14} className="text-brand" />
            Estimated delivery {new Date(Date.now() + 4 * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Link to="/shop" className="btn btn-primary px-7 py-3.5">
            Keep browsing <ArrowRight size={16} />
          </Link>
          <Link to="/" className="btn btn-ghost px-7 py-3.5">
            Back home
          </Link>
        </motion.div>
      </section>
    )
  }

  /* -------------------------------- checkout ------------------------------- */
  return (
    <section className="container-x py-16">
      <div className="mb-10">
        <span className="eyebrow">
          <span className="inline-block h-px w-6 bg-current opacity-60" />
          Secure checkout
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1] tracking-[-0.035em]">
          <SplitText text="Almost yours." />
        </h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          {/* stepper */}
          <div className="mb-10 flex items-center">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <button
                  onClick={() => i < step && setStep(i)}
                  className="flex items-center gap-3"
                  disabled={i > step}
                >
                  <motion.span
                    animate={{
                      backgroundColor: i <= step ? 'var(--ink)' : 'transparent',
                      color: i <= step ? 'var(--bg)' : 'var(--mute)',
                      scale: i === step ? 1.06 : 1,
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line text-[13px] font-bold"
                  >
                    {i < step ? <Check size={15} strokeWidth={3} /> : i + 1}
                  </motion.span>
                  <span className={cn('hidden text-sm font-semibold sm:block', i <= step ? 'text-ink' : 'text-mute')}>
                    {s}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="mx-4 h-px flex-1 overflow-hidden bg-line">
                    <motion.div
                      initial={false}
                      animate={{ scaleX: i < step ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full origin-left bg-ink"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No `AnimatePresence mode="wait"` here on purpose: a step must never
              be gated on the previous step's exit animation finishing. */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              {step === 0 && (
                <Fieldset title="Where do we send the receipt?">
                  <Field label="Email" error={errors.email}>
                    <input value={form.email} onChange={set('email')} placeholder="you@studio.com" className="field" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" error={errors.firstName}>
                      <input value={form.firstName} onChange={set('firstName')} placeholder="Ines" className="field" />
                    </Field>
                    <Field label="Last name" error={errors.lastName}>
                      <input value={form.lastName} onChange={set('lastName')} placeholder="Marchetti" className="field" />
                    </Field>
                  </div>
                  <label className="mt-2 flex cursor-pointer items-start gap-3 text-sm text-soft">
                    <input type="checkbox" defaultChecked className="mt-0.5 accent-[#7c5cff]" />
                    Email me when the atelier releases a limited run. About one a month.
                  </label>
                </Fieldset>
              )}

              {step === 1 && (
                <Fieldset title="How should it reach you?">
                  <div className="grid gap-3">
                    {SHIPPING_OPTIONS.map(({ id, label, copy, price, Icon }) => (
                      <button
                        key={id}
                        onClick={() => setShip(id)}
                        className={cn(
                          'flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300',
                          ship === id ? 'border-brand bg-brand/6' : 'border-line hover:border-line2'
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors',
                            ship === id ? 'bg-gradient-to-br from-brand to-rose text-white' : 'bg-ink/5 text-mute'
                          )}
                        >
                          <Icon size={17} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">{label}</span>
                          <span className="block text-xs text-mute">{copy}</span>
                        </span>
                        <span className="text-sm font-semibold">{price === 0 ? 'Free' : money(price)}</span>
                      </button>
                    ))}
                  </div>

                  {ship !== 'pickup' && (
                    <div className="mt-6 space-y-4">
                      <Field label="Street address" error={errors.address}>
                        <input value={form.address} onChange={set('address')} placeholder="Rua das Flores 128" className="field" />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="City" error={errors.city}>
                          <input value={form.city} onChange={set('city')} placeholder="Porto" className="field" />
                        </Field>
                        <Field label="Postcode" error={errors.postcode}>
                          <input value={form.postcode} onChange={set('postcode')} placeholder="4050-262" className="field" />
                        </Field>
                        <Field label="Country">
                          <select value={form.country} onChange={set('country')} className="field cursor-pointer">
                            {['Portugal', 'Spain', 'France', 'Germany', 'Denmark', 'United Kingdom', 'Japan', 'United States'].map(
                              (c) => (
                                <option key={c} className="bg-elev">
                                  {c}
                                </option>
                              )
                            )}
                          </select>
                        </Field>
                      </div>
                    </div>
                  )}
                </Fieldset>
              )}

              {step === 2 && (
                <Fieldset title="Payment details">
                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-line bg-ink/3 px-4 py-3 text-xs text-soft">
                    <Lock size={14} className="text-jade" />
                    This is a front-end demo — no card details are collected, stored, or sent anywhere. Type anything.
                  </div>
                  <Field label="Card number" error={errors.card}>
                    <div className="relative">
                      <input
                        value={form.card}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
                          setForm((f) => ({ ...f, card: v }))
                          setErrors((x) => ({ ...x, card: undefined }))
                        }}
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                        className="field pr-11"
                      />
                      <CreditCard size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-mute" />
                    </div>
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Expiry" error={errors.expiry}>
                      <input
                        value={form.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                          if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
                          setForm((f) => ({ ...f, expiry: v }))
                          setErrors((x) => ({ ...x, expiry: undefined }))
                        }}
                        placeholder="04/28"
                        inputMode="numeric"
                        className="field"
                      />
                    </Field>
                    <Field label="CVC" error={errors.cvc}>
                      <input
                        value={form.cvc}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))
                          setErrors((x) => ({ ...x, cvc: undefined }))
                        }}
                        placeholder="123"
                        inputMode="numeric"
                        className="field"
                      />
                    </Field>
                  </div>
                  <Field label="Name on card" error={errors.nameOnCard}>
                    <input value={form.nameOnCard} onChange={set('nameOnCard')} placeholder="I. MARCHETTI" className="field" />
                  </Field>
                </Fieldset>
              )}
            </div>
          </motion.div>

          <div className="mt-9 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button onClick={() => setStep((s) => s - 1)} className="btn btn-ghost">
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <Link to="/cart" className="btn btn-ghost">
                <ArrowLeft size={15} /> Back to bag
              </Link>
            )}
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary px-8 py-3.5"
            >
              {step === 2 ? `Pay ${money(total)}` : 'Continue'} <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl">Your order</h2>
              <span className="text-xs text-mute">{count} items</span>
            </div>

            <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
              {cartLines.map((l) => (
                <li key={l.key} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <SmartImage id={l.product.images[0]} alt={l.product.name} w={140} className="h-16 w-13 rounded-lg" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-bg">
                      {l.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{l.product.name}</p>
                    <p className="text-[11px] text-mute">
                      {l.color} · {l.size}
                    </p>
                  </div>
                  <span className="text-[13px] font-semibold">{money(l.product.price * l.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-soft">Subtotal</dt>
                <dd className="font-semibold">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soft">Shipping</dt>
                <dd className="font-semibold">{shipPrice === 0 ? 'Free' : money(shipPrice)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-display text-lg">Total</span>
              <motion.span key={total} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl">
                {money(total)}
              </motion.span>
            </div>

            <p className="mt-5 flex items-center gap-2 text-[11px] text-mute">
              <Lock size={12} /> Encrypted checkout · demo only
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Fieldset({ title, children }) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl tracking-tight">{title}</h2>
      <div className="space-y-4">{children}</div>
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
