"use client"

import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'

const CURRENCY = '৳'

export default function CheckoutPage() {
  const { t, language } = useLanguage()
  const { items, updateQuantity, removeItem, totalItems, totalAmount } = useCart()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          {t('yourCart' as any)}
        </h1>

        {totalItems === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-8 md:p-12 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-2">{t('emptyCart' as any)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('emptyCartHint' as any)}</p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400"
            >
              {t('continueShopping' as any)}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 space-y-4">
              {items.map((item) => {
                const name = language === 'bn' ? item.nameBn : item.nameEn
                const lineTotal = item.offerPrice * item.quantity
                return (
                  <div
                    key={item.serviceId}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                        {name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {CURRENCY}
                        {item.offerPrice} × {item.quantity} = {CURRENCY}
                        {lineTotal}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:sr-only">
                        {t('cartQuantity' as any)}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        className="min-w-8 text-center text-sm font-medium text-slate-900 dark:text-slate-100"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.serviceId)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                        aria-label={t('remove' as any)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="lg:w-80 shrink-0">
              <div className="sticky top-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-600 dark:text-slate-400">{t('subtotal' as any)}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    {CURRENCY}
                    {totalAmount}
                  </span>
                </div>
                <Link
                  href="/confirm-order"
                  className="block w-full text-center rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                >
                  {t('placeOrder' as any)}
                </Link>
                <Link
                  href="/shop"
                  className="mt-3 block w-full text-center rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {t('continueShopping' as any)}
                </Link>
              </div>
            </div>
        </div>
        )}
    </div>
  )
}
