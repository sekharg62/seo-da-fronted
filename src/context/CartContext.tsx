"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'digitalaccess.cart'

export type CartItem = {
  serviceId: string
  nameEn: string
  nameBn: string
  /** selected unit price (based on priceType) */
  offerPrice: number
  /** available plan prices */
  sharedPrice?: number
  personalPrice?: number
  /** which plan price is selected */
  priceType?: 'shared' | 'personal'
  quantity: number
  periodKey: 'month' | 'year'
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (serviceId: string, quantity: number) => void
  updatePriceType: (serviceId: string, priceType: 'shared' | 'personal') => void
  removeItem: (serviceId: string) => void
  totalItems: number
  totalAmount: number
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveCart(items)
  }, [items, mounted])

  function addItem(
    input: Omit<CartItem, 'quantity'> & { quantity?: number },
  ) {
    const quantity = Math.max(1, input.quantity ?? 1)
    setItems((prev) => {
      const existing = prev.find((i) => i.serviceId === input.serviceId)
      if (existing) {
        return prev.map((i) =>
          i.serviceId === input.serviceId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      }
      return [...prev, { ...input, quantity }]
    })
    setDrawerOpen(true)
  }

  function updateQuantity(serviceId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(serviceId)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.serviceId === serviceId ? { ...i, quantity } : i,
      ),
    )
  }

  function removeItem(serviceId: string) {
    setItems((prev) => prev.filter((i) => i.serviceId !== serviceId))
  }

  function updatePriceType(serviceId: string, priceType: 'shared' | 'personal') {
    setItems((prev) =>
      prev.map((i) => {
        if (i.serviceId !== serviceId) return i
        const shared = i.sharedPrice ?? i.offerPrice
        const personal = i.personalPrice ?? i.offerPrice
        const nextOffer = priceType === 'personal' ? personal : shared
        return {
          ...i,
          priceType,
          sharedPrice: shared,
          personalPrice: personal,
          offerPrice: nextOffer,
        }
      }),
    )
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce(
    (sum, i) => sum + i.offerPrice * i.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        updatePriceType,
        removeItem,
        totalItems,
        totalAmount,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
