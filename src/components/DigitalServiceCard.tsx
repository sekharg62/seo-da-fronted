import Link from 'next/link'
import type { ServiceDto } from '@/services/homeApiService'
import { ServiceImage } from './ServiceImage'

const CURRENCY = '৳'

type Props = {
  service: ServiceDto
}

function formatStartPrice(price: number | string | undefined | null): number | null {
  if (price === undefined || price === null || price === '') return null
  const n = Number(price)
  return Number.isFinite(n) ? n : null
}

export function DigitalServiceCard({ service }: Props) {
  const startPrice = formatStartPrice(service.price)
  const outOfStock = service.isActive === false
  
  return (
    <Link
      href={`/product/${service.id}`}
      className={[
        'group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/70',
        'flex flex-col transition-all duration-200',
        outOfStock
          ? 'opacity-85 grayscale-[0.15]'
          : 'hover:shadow-lg hover:shadow-emerald-500/10',
      ].join(' ')}
      aria-label={outOfStock ? `${service.name} (Out of stock)` : service.name}
    >
      {/* Hover overlay button (covers whole card) */}
      {!outOfStock ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm">
            Select Option
          </span>
        </div>
      ) : null}

      {/* Image area */}
      <div className="relative">
        {outOfStock ? (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center text-white rounded-full border bg-red-600 border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-800 shadow-sm dark:border-rose-500/30  dark:text-rose-200">
              Out of stock
            </span>
          </div>
        ) : null}
        <ServiceImage service={service} variant="card" />
        {outOfStock ? (
          <div className="pointer-events-none absolute inset-0 bg-slate-950/10 dark:bg-black/20" aria-hidden />
        ) : null}
      </div>

      {/* Info */}
      <div
        className={[
          'relative z-0 flex flex-col gap-1.5 p-3.5 transition-all duration-200',
          outOfStock ? '' : 'group-hover:translate-y-2 group-hover:opacity-0',
        ].join(' ')}
      >
        <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">{service.name}</p>
        {startPrice !== null ? (
          <p className={outOfStock ? 'text-sm font-medium text-slate-500 dark:text-slate-400' : 'text-sm font-medium text-emerald-500'}>
            Starts from: <span className="font-bold">{CURRENCY}{startPrice.toFixed(0)}</span>
          </p>
        ) : (
          <p className="text-sm text-slate-400">See options</p>
        )}
      </div>
    </Link>
  )
}
