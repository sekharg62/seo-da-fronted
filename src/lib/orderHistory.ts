/**
 * Orders placed from THIS device, kept in localStorage so the customer can re-check status
 * and re-download bills without typing anything (see /track-order).
 * The phone is stored because the tracking API requires order ID + phone.
 */
const KEY = 'digitalaccess.orders'
const MAX = 10

export type SavedOrder = {
  orderNo: string
  phone: string
  createdAt: string
  /** Short label, e.g. "Chatgpt — 1 Month" (+1 more) */
  summary?: string
  total?: number
}

export function getSavedOrders(): SavedOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list)
      ? list.filter((o): o is SavedOrder => typeof o?.orderNo === 'string' && typeof o?.phone === 'string')
      : []
  } catch {
    return []
  }
}

export function saveOrder(order: SavedOrder): void {
  if (typeof window === 'undefined' || !order.orderNo || !order.phone) return
  try {
    const rest = getSavedOrders().filter((o) => o.orderNo !== order.orderNo)
    window.localStorage.setItem(KEY, JSON.stringify([order, ...rest].slice(0, MAX)))
    window.dispatchEvent(new Event('digitalaccess:orders'))
  } catch {
    // storage full / blocked — tracking still works by typing the order ID
  }
}

export function removeSavedOrder(orderNo: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(getSavedOrders().filter((o) => o.orderNo !== orderNo)))
    window.dispatchEvent(new Event('digitalaccess:orders'))
  } catch {
    // ignore
  }
}

/** For useSyncExternalStore: re-read when this tab or another tab changes the list. */
export function subscribeSavedOrders(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => e.key === KEY && onChange()
  window.addEventListener('storage', onStorage)
  window.addEventListener('digitalaccess:orders', onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('digitalaccess:orders', onChange)
  }
}

/** Stable snapshot string for useSyncExternalStore (arrays would change identity every read). */
export function savedOrdersSnapshot(): string {
  if (typeof window === 'undefined') return '[]'
  try {
    return window.localStorage.getItem(KEY) ?? '[]'
  } catch {
    return '[]'
  }
}
