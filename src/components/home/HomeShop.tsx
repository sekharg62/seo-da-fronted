"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DigitalServiceCard } from '@/components/DigitalServiceCard'
import {
  fetchTrendingServices,
  sortServicesByOrderField,
  type ServiceDto
} from '@/services/homeApiService'

/** `initialServices` comes from the server so products are in the HTML (SEO); falls back to a client fetch. */
export function HomeShop({ initialServices }: { initialServices?: ServiceDto[] }) {
  const { t } = useLanguage()
  const [apiServices, setApiServices] = useState<ServiceDto[]>(() =>
    initialServices ? sortServicesByOrderField(initialServices) : [],
  )
  const [servicesLoading, setServicesLoading] = useState(!initialServices)

  useEffect(() => {
    if (initialServices) return
    let mounted = true
    ;(async () => {
      setServicesLoading(true)
      try {
        const svcs = await fetchTrendingServices()
        if (!mounted) return
        setApiServices(sortServicesByOrderField(svcs))
      } catch {
        // silent — cards just won't show
      } finally {
        if (mounted) setServicesLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [initialServices])

  return (
    <section
      id="shop"
      className="scroll-mt-20 bg-slate-50 dark:bg-white/[0.025]"
    >
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-neutral-50 mb-1">
            {t('shopSectionTitle' as any)}
          </h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            {t('shopSectionSubtitle' as any)}
          </p>
        </div>
        {servicesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden animate-pulse">
                <div className="aspect-4/3 bg-slate-200 dark:bg-neutral-900" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-neutral-900" />
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-neutral-900" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            {apiServices.map((service) => (
              <DigitalServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/60 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-neutral-100 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 transition"
          >
            {t('viewAll' as any)}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
