# AURÉLIA — Considered Fashion Atelier

A front-end-only e-commerce experience for a fictional slow-fashion label. Twelve fully built
pages, a complete shopping flow, and motion design throughout — no backend, no API, no database.

![React](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-6-646cff) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0080)

---

## Quick start

```bash
npm install
npm run dev
```

Then open **http://localhost:5180**.

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build
```

Requires Node 18+.

---

## What's in it

### Pages

| Route | What it does |
| --- | --- |
| `/` | Landing page — animated hero, collections, featured tabs, editorial, lookbook, testimonials, journal |
| `/shop` | Product listing with live filtering, sorting, grid/list views |
| `/product/:slug` | Detail page — zoom gallery, variants, accordions, reviews, related items |
| `/cart` | Full bag with quantity controls and promo codes |
| `/checkout` | Three-step checkout with validation → order confirmation |
| `/wishlist` | Saved pieces, add-all-to-bag |
| `/compare` | Up to 4 pieces side by side across 13 attributes |
| `/about` | Brand story with a scroll-driven timeline |
| `/journal` | Editorial index with tag filtering |
| `/journal/:slug` | Article view with a reading-progress bar |
| `/contact` | Validated contact form, studio list, FAQ accordion |
| `*` | Custom 404 with product suggestions |

### Interaction & motion

- **Animated intro** on first load, then a gradient scroll-progress bar site-wide
- **Custom cursor** that morphs into contextual labels (`view`, `shop`, `read`) over interactive elements
- **Dual-parallax hero** — responds to both scroll position and pointer movement, with layered depth
- **Word-by-word headline reveals** on every major heading
- **Dark / light themes** with an animated sun↔moon toggle; the choice persists
- **Mega menu**, **⌘K search overlay**, and a **slide-in cart drawer** with a free-shipping meter
- **Confetti** on successful checkout (hand-rolled canvas, no dependency)
- Magnetic buttons, 3D card tilt, marquees, animated counters, staggered grid entrances

### Shopping features

- Cart with size/colour variants, quantity limits, and per-line totals
- Wishlist and a 4-slot comparison table
- Filtering by category, gender, collection, price, colour and size — synced to the URL
- Sorting by featured / price / rating / name
- Promo codes (`AURELIA10`, `ATELIER`)
- Everything persists to `localStorage`, so state survives a refresh

---

## Architecture

```
src/
├── components/
│   ├── home/          Hero and landing-page sections
│   ├── layout/        Navbar, Footer, cursor, preloader, toasts
│   ├── shop/          ProductCard, CartDrawer, QuickView
│   └── ui/            Motion primitives (Reveal, SplitText, Tilt, Magnetic…)
├── context/           Global store — cart, wishlist, compare, theme, toasts
├── data/              Product catalogue (28 items) and journal entries
├── lib/               Helpers, confetti
├── pages/             One file per route
└── index.css          Design tokens + component classes
```

**State** lives in a single reducer-backed context (`StoreContext`) and persists to `localStorage`.

**Theming** uses CSS custom properties that flip on `.dark`, surfaced to Tailwind v4 through
`@theme inline`. Components reference semantic tokens (`bg-elev`, `text-soft`, `border-line`)
rather than raw colours, so both themes stay consistent automatically.

---

## Notes on robustness

A few deliberate decisions worth calling out:

- **`SmartImage`** fades images in and falls back to a generated gradient if a request fails, so a
  flaky network never produces a broken-image icon.
- **`useSafeInView`** wraps `IntersectionObserver` with a timeout fallback. If the observer never
  reports — which happens in some embedded webviews — content reveals anyway instead of staying
  permanently invisible.
- **No `AnimatePresence mode="wait"`** on the router or the checkout wizard. That mode holds the
  incoming view back until the outgoing one finishes animating, so an interrupted exit animation
  (a backgrounded tab suspends `requestAnimationFrame`) could strand the user on the previous step.
- **`prefers-reduced-motion`** is respected throughout.

---

## Credits

Photography from [Unsplash](https://unsplash.com). Typefaces: *Fraunces* and *Plus Jakarta Sans*
via Google Fonts. Icons by [Lucide](https://lucide.dev).

The brand, products, prices, reviews and journal entries are fictional — this is a design and
front-end engineering demonstration, not a real shop. No payment details are collected, stored or
transmitted at any point; the checkout is a local simulation.
