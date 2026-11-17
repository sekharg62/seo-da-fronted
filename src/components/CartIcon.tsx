"use client";

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type Props = {
  cartLabel?: string
}

export function CartIcon({ cartLabel = 'Cart' }: Props) {
  const { totalItems, setDrawerOpen, drawerOpen } = useCart()

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={drawerOpen}
      aria-label={`${cartLabel}: ${totalItems}`}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-neutral-700 dark:bg-[#0f0f0f] dark:text-neutral-200 dark:hover:bg-neutral-900 sm:h-10 sm:w-10"
    >
      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      {totalItems > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-neutral-950 ring-2 ring-white dark:ring-neutral-950"
          aria-hidden="true"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
