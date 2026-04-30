"use client";

import { useEffect, useRef, useState } from 'react'
import {
  BadgeCheck,
  CheckCircle2,
  LayoutGrid,
  Package,
  Receipt,
  Rocket,
  ShoppingBag,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const TICKER_CHIPS = [
  {
    labelKey: 'homeStatTicker1' as const,
    Icon: CheckCircle2,
    chipClass:
      'bg-emerald-500/15 text-emerald-900 ring-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-50 dark:ring-emerald-400/35',
  },
  {
    labelKey: 'homeStatTicker2' as const,
    Icon: BadgeCheck,
    chipClass:
      'bg-sky-500/15 text-sky-900 ring-sky-500/30 dark:bg-sky-500/20 dark:text-sky-50 dark:ring-sky-400/35',
  },
  {
    labelKey: 'homeStatTicker3' as const,
    Icon: Rocket,
    chipClass:
      'bg-violet-500/15 text-violet-900 ring-violet-500/30 dark:bg-violet-500/20 dark:text-violet-50 dark:ring-violet-400/35',
  },
  {
    labelKey: 'homeStatTicker4' as const,
    Icon: Receipt,
    chipClass:
      'bg-amber-500/15 text-amber-950 ring-amber-500/30 dark:bg-amber-500/20 dark:text-amber-50 dark:ring-amber-400/35',
  },
] as const

const STATS = [
  {
    target: 100,
    suffix: '+',
    titleKey: 'homeStatProducts' as const,
    subKey: 'homeStatProductsSub' as const,
    statusKey: 'homeStatProductsStatus' as const,
    icon: Package,
  },
  {
    target: 10,
    suffix: '+',
    titleKey: 'homeStatCategories' as const,
    subKey: 'homeStatCategoriesSub' as const,
    statusKey: 'homeStatCategoriesStatus' as const,
    icon: LayoutGrid,
  },
  {
    target: 200,
    suffix: '+',
    titleKey: 'homeStatDailyOrders' as const,
    subKey: 'homeStatDailyOrdersSub' as const,
    statusKey: 'homeStatDailyOrdersStatus' as const,
    icon: ShoppingBag,
  },
  {
    target: 3283,
    suffix: '+',
    titleKey: 'homeStatCustomers' as const,
    subKey: 'homeStatCustomersSub' as const,
    statusKey: 'homeStatCustomersStatus' as const,
    icon: Users,
  },
]

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function useAnimatedCount(target: number, active: boolean, durationMs = 2000, delayMs = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let frame = 0
    let cancelled = false

    const startAnim = () => {
      const start = performance.now()
      const tick = (now: number) => {
        if (cancelled) return
        const elapsed = now - start
        const t = Math.min(elapsed / durationMs, 1)
        setValue(Math.round(easeOutCubic(t) * target))
        if (t < 1) {
          frame = requestAnimationFrame(tick)
        }
      }
      frame = requestAnimationFrame(tick)
    }

    const timer = window.setTimeout(startAnim, delayMs)
    return () => {
      cancelled = true
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [active, target, durationMs, delayMs])

  return value
}

function StatCell({
  target,
  suffix,
  titleKey,
  subKey,
  statusKey,
  icon: Icon,
  active,
  delayIndex,
}: (typeof STATS)[number] & { active: boolean; delayIndex: number }) {
  const { t } = useLanguage()
  const count = useAnimatedCount(target, active, 2000, delayIndex * 100)

  return (
    <div className="group relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-emerald-200/70 bg-emerald-50/80 p-3 shadow-sm shadow-emerald-900/[0.06] backdrop-blur-sm transition hover:border-emerald-400/60 hover:shadow-md dark:border-emerald-900/40 dark:bg-emerald-950/25 dark:shadow-black/30 sm:rounded-xl sm:p-4 md:p-5">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/15 blur-2xl transition group-hover:bg-emerald-400/25 dark:bg-emerald-500/10" aria-hidden />

      <div className="relative flex min-w-0 items-start justify-between gap-1.5 sm:gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-900 text-white shadow-inner ring-2 ring-white/30 dark:bg-emerald-600 dark:ring-emerald-400/20 sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
        </div>
        <span className="inline-flex min-w-0 max-w-[58%] items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase leading-tight tracking-wide text-emerald-800 shadow-sm ring-1 ring-emerald-200/80 dark:bg-slate-900/80 dark:text-emerald-200 dark:ring-emerald-800/60 sm:max-w-[52%] sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px] md:text-[11px]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" aria-hidden />
          <span className="truncate">{t(statusKey as any)}</span>
        </span>
      </div>

      <div className="relative mt-3 flex min-w-0 flex-1 flex-col justify-end gap-0.5 sm:mt-4 sm:gap-1">
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-4xl">
          {count}
          <span className="text-emerald-600 dark:text-emerald-400">{suffix}</span>
        </p>
        <p className="break-words text-xs font-semibold text-emerald-900 dark:text-emerald-200 sm:text-sm">
          {t(titleKey as any)}
        </p>
        <p className="break-words text-[11px] leading-relaxed text-emerald-800/85 dark:text-emerald-300/90 sm:text-xs">
          {t(subKey as any)}
        </p>
      </div>
    </div>
  )
}

export function HomeHeroStats() {
  const { t } = useLanguage()
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '40px 0px 0px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex h-full min-w-0 w-full max-w-full flex-col md:mx-0 md:max-w-[520px] lg:justify-self-end"
    >
      <div className="relative flex h-full min-w-0 flex-col gap-2 sm:gap-3 md:gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-2 items-stretch gap-2 sm:gap-3 md:gap-4">
          {STATS.map((stat, idx) => (
            <StatCell key={stat.titleKey} {...stat} active={active} delayIndex={idx} />
          ))}
        </div>

        <div className="mt-2 min-w-0 rounded-lg border border-slate-200/70 bg-slate-50/70 p-2.5 dark:border-slate-700/70 dark:bg-slate-950/40 sm:mt-3 sm:rounded-xl sm:p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 sm:text-[11px]">
              {t('homeStatUpdatesLabel' as any)}
            </p>
            <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 sm:px-2 sm:py-1 sm:text-[11px]">
              {t('homeStatUpdatesBadge' as any)}
            </span>
          </div>

          <div className="mt-2 min-w-0 overflow-hidden py-0.5">
            <div
              className="da-home-stats-marquee inline-flex items-center gap-2 whitespace-nowrap sm:gap-3"
              aria-hidden
            >
              {[0, 1].map((dup) => (
                <div key={dup} className="inline-flex items-center gap-2 pr-1 sm:gap-3 sm:pr-2">
                  {TICKER_CHIPS.map(({ labelKey, Icon, chipClass }) => (
                    <span
                      key={`${dup}-${labelKey}`}
                      className={`inline-flex max-w-[9.5rem] shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold shadow-sm ring-1 backdrop-blur-sm sm:max-w-none sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${chipClass}`}
                    >
                      <Icon className="h-3 w-3 shrink-0 opacity-95 sm:h-3.5 sm:w-3.5" />
                      <span className="truncate">{t(labelKey as any)}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .da-home-stats-marquee {
          animation: da-home-stats-marquee 14s linear infinite;
        }
        @keyframes da-home-stats-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .da-home-stats-marquee { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
