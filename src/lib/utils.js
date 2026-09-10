import clsx from 'clsx'

export const cn = (...args) => clsx(...args)

export const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const img = (id, w = 900, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`

/** Deterministic gradient placeholder so nothing ever renders as a broken image. */
export const placeholder = (seed = 'a') => {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  const a = h
  const b = (h + 48) % 360
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${a},58%,72%)'/><stop offset='1' stop-color='hsl(${b},62%,52%)'/></linearGradient></defs><rect width='800' height='1000' fill='url(#g)'/><g fill='none' stroke='rgba(255,255,255,.35)' stroke-width='2'><circle cx='400' cy='500' r='170'/><circle cx='400' cy='500' r='250'/></g></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

export const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
