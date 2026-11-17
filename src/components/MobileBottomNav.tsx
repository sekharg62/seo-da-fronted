"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, LayoutGrid, PackageSearch, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'

const navItemBase =
  'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 px-1 text-[11px] font-semibold leading-none transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500'

function navItemClass(active: boolean) {
  return [
    navItemBase,
    active
      ? 'text-amber-700 dark:text-amber-400 after:absolute after:inset-x-4 after:top-0 after:h-0.5 after:rounded-b-full after:bg-amber-500'
      : 'text-gray-500 active:text-slate-800 dark:text-neutral-400 dark:active:text-neutral-200',
  ].join(' ')
}

export function MobileBottomNav() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { totalItems, drawerOpen, setDrawerOpen } = useCart()

  const shopActive =
    pathname === '/shop' || pathname.startsWith('/shop/') || pathname.startsWith('/product/')
  const blogActive = pathname === '/blog' || pathname.startsWith('/blog/')
  const cartActive = drawerOpen || pathname.startsWith('/confirm-order')
  const trackActive = pathname.startsWith('/track-order')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md dark:border-neutral-800 dark:bg-[#0f0f0f] md:hidden"
      aria-label={t('mobileNavAriaLabel' as any)}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between">
        <Link href="/" className={navItemClass(pathname === '/')}>
          <Home className="h-[22px] w-[22px] shrink-0" aria-hidden />
          <span className="truncate">{t('footerLinkHome' as any)}</span>
        </Link>

        <Link href="/shop" className={navItemClass(shopActive)}>
          <LayoutGrid className="h-[22px] w-[22px] shrink-0" aria-hidden />
          <span className="truncate">{t('footerLinkShop' as any)}</span>
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`${navItemClass(cartActive)} relative`}
          aria-label={t('cart' as any)}
        >
          <span className="relative inline-flex shrink-0">
            <ShoppingCart className="h-[22px] w-[22px]" aria-hidden />
            {totalItems > 0 ? (
              <span
                className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-neutral-950"
                aria-hidden
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            ) : null}
          </span>
          <span className="truncate">{t('cart' as any)}</span>
        </button>

        <Link href="/track-order" className={navItemClass(trackActive)}>
          <PackageSearch className="h-[22px] w-[22px] shrink-0" aria-hidden />
          <span className="truncate">{t('footerTrackOrder' as any)}</span>
        </Link>

        <Link href="/blog" className={navItemClass(blogActive)}>
          <BookOpen className="h-[22px] w-[22px] shrink-0" aria-hidden />
          <span className="truncate">{t('footerLinkBlog' as any)}</span>
        </Link>
      </div>
    </nav>
  )
}
