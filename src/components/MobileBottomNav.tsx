"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, LayoutGrid, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'

const navItemBase =
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 px-1 text-[10px] font-medium transition-colors touch-manipulation'

function navItemClass(active: boolean) {
  return [
    navItemBase,
    active
      ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300'
      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
  ].join(' ')
}

export function MobileBottomNav() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { totalItems, drawerOpen, setDrawerOpen } = useCart()

  const shopActive =
    pathname === '/shop' || pathname.startsWith('/shop/') || pathname.startsWith('/product/')
  const blogActive = pathname === '/blog' || pathname.startsWith('/blog/')
  const cartActive =
    drawerOpen || pathname.startsWith('/checkout') || pathname.startsWith('/confirm-order')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-4px_24px_-4px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.35)] md:hidden"
      aria-label={t('mobileNavAriaLabel' as any)}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between gap-1 px-2">
        <Link href="/" className={navItemClass(pathname === '/')}>
          <Home className="h-5 w-5 shrink-0" aria-hidden />
          <span className="truncate">{t('footerLinkHome' as any)}</span>
        </Link>

        <Link href="/shop" className={navItemClass(shopActive)}>
          <LayoutGrid className="h-5 w-5 shrink-0" aria-hidden />
          <span className="truncate">{t('footerLinkShop' as any)}</span>
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`${navItemClass(cartActive)} relative`}
          aria-label={t('cart' as any)}
        >
          <span className="relative inline-flex shrink-0">
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {totalItems > 0 ? (
              <span
                className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-emerald-950"
                aria-hidden
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            ) : null}
          </span>
          <span className="truncate">{t('cart' as any)}</span>
        </button>

        <Link href="/blog" className={navItemClass(blogActive)}>
          <BookOpen className="h-5 w-5 shrink-0" aria-hidden />
          <span className="truncate">{t('footerLinkBlog' as any)}</span>
        </Link>
      </div>
    </nav>
  )
}
