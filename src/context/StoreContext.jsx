import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { products } from '../data/products'

const StoreContext = createContext(null)

const KEY = 'aurelia-store-v1'

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const initial = {
  cart: [], // { key, id, size, color, qty }
  wishlist: [], // ids
  compare: [], // ids
  orders: [],
  ...(load() || {}),
}

const lineKey = (id, size, color) => `${id}::${size}::${color}`

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { id, size, color, qty } = action.payload
      const key = lineKey(id, size, color)
      const existing = state.cart.find((l) => l.key === key)
      const cart = existing
        ? state.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
        : [...state.cart, { key, id, size, color, qty }]
      return { ...state, cart }
    }
    case 'SET_QTY': {
      const cart = state.cart
        .map((l) => (l.key === action.payload.key ? { ...l, qty: action.payload.qty } : l))
        .filter((l) => l.qty > 0)
      return { ...state, cart }
    }
    case 'REMOVE':
      return { ...state, cart: state.cart.filter((l) => l.key !== action.payload) }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'TOGGLE_WISH': {
      const has = state.wishlist.includes(action.payload)
      return {
        ...state,
        wishlist: has ? state.wishlist.filter((i) => i !== action.payload) : [action.payload, ...state.wishlist],
      }
    }
    case 'TOGGLE_COMPARE': {
      const has = state.compare.includes(action.payload)
      if (has) return { ...state, compare: state.compare.filter((i) => i !== action.payload) }
      if (state.compare.length >= 4) return state
      return { ...state, compare: [...state.compare, action.payload] }
    }
    case 'CLEAR_COMPARE':
      return { ...state, compare: [] }
    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: [] }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('aurelia-theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage can be unavailable in private mode — the app still works */
    }
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('aurelia-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', cartOpen || searchOpen)
  }, [cartOpen, searchOpen])

  const toast = useCallback((message, tone = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const addToCart = useCallback(
    (product, { size, color, qty = 1, silent = false } = {}) => {
      const s = size || product.sizes[0]
      const c = color || product.colors[0].name
      dispatch({ type: 'ADD', payload: { id: product.id, size: s, color: c, qty } })
      if (!silent) {
        toast(`${product.name} added to bag`, 'success')
        setCartOpen(true)
      }
    },
    [toast]
  )

  const toggleWish = useCallback(
    (product) => {
      const has = state.wishlist.includes(product.id)
      dispatch({ type: 'TOGGLE_WISH', payload: product.id })
      toast(has ? `Removed from wishlist` : `${product.name} saved to wishlist`, has ? 'default' : 'success')
    },
    [state.wishlist, toast]
  )

  const toggleCompare = useCallback(
    (product) => {
      const has = state.compare.includes(product.id)
      if (!has && state.compare.length >= 4) {
        toast('You can compare up to 4 pieces', 'warn')
        return
      }
      dispatch({ type: 'TOGGLE_COMPARE', payload: product.id })
      toast(has ? 'Removed from compare' : `${product.name} added to compare`, has ? 'default' : 'success')
    },
    [state.compare, toast]
  )

  const cartLines = useMemo(
    () =>
      state.cart
        .map((l) => {
          const product = products.find((p) => p.id === l.id)
          return product ? { ...l, product } : null
        })
        .filter(Boolean),
    [state.cart]
  )

  const subtotal = useMemo(() => cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0), [cartLines])
  const savings = useMemo(
    () => cartLines.reduce((sum, l) => sum + (l.product.compareAt ? (l.product.compareAt - l.product.price) * l.qty : 0), 0),
    [cartLines]
  )
  const count = useMemo(() => cartLines.reduce((n, l) => n + l.qty, 0), [cartLines])
  const shipping = subtotal > 0 && subtotal < 250 ? 12 : 0

  const wishlistItems = useMemo(
    () => state.wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [state.wishlist]
  )
  const compareItems = useMemo(
    () => state.compare.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [state.compare]
  )

  const placeOrder = useCallback(
    (details) => {
      const order = {
        id: 'AUR-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toISOString(),
        lines: cartLines.map((l) => ({
          name: l.product.name,
          price: l.product.price,
          qty: l.qty,
          size: l.size,
          color: l.color,
          image: l.product.images[0],
        })),
        total: subtotal + shipping,
        details,
      }
      dispatch({ type: 'PLACE_ORDER', payload: order })
      return order
    },
    [cartLines, subtotal, shipping]
  )

  const value = {
    ...state,
    cartLines,
    subtotal,
    savings,
    shipping,
    count,
    wishlistItems,
    compareItems,
    addToCart,
    setQty: (key, qty) => dispatch({ type: 'SET_QTY', payload: { key, qty } }),
    removeLine: (key) => dispatch({ type: 'REMOVE', payload: key }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleWish,
    toggleCompare,
    clearCompare: () => dispatch({ type: 'CLEAR_COMPARE' }),
    placeOrder,
    inWishlist: (id) => state.wishlist.includes(id),
    inCompare: (id) => state.compare.includes(id),
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    toasts,
    toast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
