"use client";

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type Props = {
  cartLabel?: string
}

export function CartIcon({ cartLabel }: Props) {
  const { totalItems, setDrawerOpen } = useCart()

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      className="relative flex items-center justify-center rounded-full p-2 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
      aria-label={cartLabel ? `${cartLabel}: ${totalItems}` : `Cart: ${totalItems} items`}
    >
      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
      <span
        className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-emerald-950"
        aria-hidden="true"
      >
        {totalItems > 99 ? '99+' : totalItems}
      </span>
    </button>
  )
}
