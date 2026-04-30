"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'

const CURRENCY = '৳'

export function CartDrawer() {
  const { t, language } = useLanguage()
  const {
    items,
    totalItems,
    totalAmount,
    updateQuantity,
    removeItem,
    drawerOpen,
    setDrawerOpen,
  } = useCart()

  useEffect(() => {
    if (!drawerOpen) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [drawerOpen, setDrawerOpen])

  if (!drawerOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t('shoppingCart' as any)}
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/50 dark:bg-slate-950/70"
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="relative flex w-full max-w-sm sm:max-w-md flex-col bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-800 animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {t('shoppingCart' as any)}
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items list - scrollable */}
        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain p-4">
          {totalItems === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <ShoppingCart className="h-10 w-10 text-slate-400 dark:text-slate-500" strokeWidth={1.25} aria-hidden />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('emptyCart' as any)}
              </p>
              <Link
                href="/shop"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400"
              >
                {t('continueShopping' as any)}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const name = language === 'bn' ? item.nameBn : item.nameEn
                const lineTotal = item.offerPrice * item.quantity
                return (
                  <li
                    key={item.serviceId}
                    className="flex hover:bg-slate-100 dark:hover:bg-slate-700 transition gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                          {name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.serviceId)}
                          className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition"
                          aria-label={t('remove' as any)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-lg transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className="flex h-8 min-w-8 items-center justify-center text-sm font-medium text-slate-900 dark:text-slate-100 border-x border-slate-200 dark:border-slate-600"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-lg transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.quantity} × {CURRENCY}{item.offerPrice} = {CURRENCY}{lineTotal}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-50">
              <span>{t('subtotal' as any)}</span>
              <span>{CURRENCY}{totalAmount}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-center text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {t('viewCart' as any)}
              </Link>
              <Link
                href="/confirm-order"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-emerald-950 shadow-sm hover:bg-emerald-400 transition"
              >
                {t('checkout' as any)}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
