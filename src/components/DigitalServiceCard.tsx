"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ServiceDto } from '@/services/homeApiService'
import { useLanguage } from '@/context/LanguageContext'
import { productHref } from '@/lib/productUrl'
import { getServiceIconMeta } from '@/lib/digitalServices'
import { optimizedImage } from '@/lib/imageUrl'

const CURRENCY = '৳'

const TEXT = {
  en: { from: 'Starting from', view: 'View plans', inStock: 'In stock', outOfStock: 'Out of stock', seeOptions: 'See options' },
  bn: { from: 'শুরু', view: 'প্ল্যান দেখুন', inStock: 'স্টকে আছে', outOfStock: 'স্টক নেই', seeOptions: 'অপশন দেখুন' },
} as const

type Props = {
  service: ServiceDto
}

function toPrice(price: number | string | undefined | null): number | null {
  if (price === undefined || price === null || price === '') return null
  const n = Number(price)
  return Number.isFinite(n) && n > 0 ? n : null
}

/**
 * Product card used in the shop grid, home page and "You may also like".
 * The whole card is one link; name and price are always visible (no hover-only info),
 * and cards in a row share the same height with the price row pinned to the bottom.
 */
export function DigitalServiceCard({ service }: Props) {
  const { language } = useLanguage()
  const tx = TEXT[language === 'bn' ? 'bn' : 'en']
  const startPrice = toPrice(service.price)
  const outOfStock = service.isActive === false
  const shortDesc = service.shortDesc?.trim()
  const fallback = getServiceIconMeta(service.name)

  return (
    <Link
      href={productHref(service)}
      aria-label={`${service.name}${startPrice ? ` — ${tx.from} ${CURRENCY}${startPrice}` : ''}${outOfStock ? ` (${tx.outOfStock})` : ''}`}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-[#0f0f0f] dark:focus-visible:ring-offset-neutral-950 ${
        outOfStock
          ? 'border-gray-200 dark:border-neutral-800'
          : 'border-gray-200 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_18px_60px_-10px_rgba(16,185,129,0.22)] dark:border-neutral-800 dark:hover:border-amber-500/50'
      }`}
    >
      {/* Image: square, blurred backdrop + contained product art */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gray-900">
        {service.imgUrl ? (
          <>
            <img
              src={optimizedImage(service.imgUrl, 64)}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl saturate-150"
            />
            <img
              src={optimizedImage(service.imgUrl, 600)}
              alt={`${service.name} subscription`}
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-contain transition-transform duration-500 ${
                outOfStock ? 'opacity-80 grayscale-[0.4]' : 'group-hover:scale-105'
              }`}
            />
          </>
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${fallback.bg}`} aria-hidden>
            <span className={`text-4xl font-bold ${fallback.text}`}>{service.name.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="relative flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-end gap-2">
            {outOfStock ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {tx.outOfStock}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-green-700 dark:text-green-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                {tx.inStock}
              </span>
            )}
          </div>
          <h3
            title={service.name}
            className="line-clamp-1 text-base font-extrabold leading-snug text-gray-900 transition-colors group-hover:text-amber-600 dark:text-neutral-100 dark:group-hover:text-amber-400"
          >
            {service.name}
          </h3>
          {shortDesc ? (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-neutral-400">{shortDesc}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-baseline justify-between">
            {startPrice !== null ? (
              <>
                <span className="text-xs text-slate-400">{tx.from}</span>
                <span
                  className={`text-lg font-black ${
                    outOfStock ? 'text-gray-500 dark:text-neutral-400' : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {CURRENCY}
                  {startPrice.toLocaleString('en-US')}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500 dark:text-neutral-400">{tx.seeOptions}</span>
            )}
          </div>
          <span
            aria-hidden
            className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-black shadow-lg transition-all group-active:scale-[0.98] ${
              outOfStock
                ? 'bg-slate-100 text-slate-400 shadow-none dark:bg-neutral-900'
                : 'bg-amber-400 text-neutral-950 shadow-amber-900/20 group-hover:bg-amber-300'
            }`}
          >
            {tx.view}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
