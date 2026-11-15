"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ServiceDto } from '@/services/homeApiService'
import { useLanguage } from '@/context/LanguageContext'
import { productHref } from '@/lib/productUrl'
import { getServiceIconMeta } from '@/lib/digitalServices'

const CURRENCY = '৳'

const TEXT = {
  en: { from: 'From', view: 'View', outOfStock: 'Out of stock', seeOptions: 'See options' },
  bn: { from: 'শুরু', view: 'দেখুন', outOfStock: 'স্টক নেই', seeOptions: 'অপশন দেখুন' },
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
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-slate-900/70 dark:focus-visible:ring-offset-slate-950 ${
        outOfStock
          ? 'border-slate-200 dark:border-slate-800'
          : 'border-slate-200 hover:-translate-y-0.5 hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-slate-800 dark:hover:border-emerald-500/50'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {service.imgUrl ? (
          <img
            src={service.imgUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 ${
              outOfStock ? 'opacity-80 grayscale-[0.4]' : 'group-hover:scale-[1.04]'
            }`}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${fallback.bg}`} aria-hidden>
            <span className={`text-4xl font-bold ${fallback.text}`}>{service.name.slice(0, 2).toUpperCase()}</span>
          </div>
        )}

        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:text-[11px]">
            {tx.outOfStock}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3
          title={service.name}
          className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50 sm:text-base"
        >
          {service.name}
        </h3>
        {shortDesc ? (
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-500 dark:text-slate-400">{shortDesc}</p>
        ) : null}

        {/* Price row — pinned to the bottom so cards in a row line up */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          {startPrice !== null ? (
            <p className="min-w-0 leading-tight">
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{tx.from}</span>
              <span
                className={`text-base font-bold sm:text-lg ${
                  outOfStock ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {CURRENCY}
                {startPrice.toLocaleString('en-US')}
              </span>
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{tx.seeOptions}</p>
          )}

          <span
            aria-hidden
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1 rounded-full text-xs font-semibold transition sm:w-auto sm:px-3.5 ${
              outOfStock
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                : 'bg-emerald-500/10 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-emerald-950 dark:text-emerald-300'
            }`}
          >
            <span className="hidden sm:inline">{tx.view}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
