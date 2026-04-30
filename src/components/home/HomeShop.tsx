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

export function HomeShop() {
  const { t } = useLanguage()
  const [apiServices, setApiServices] = useState<ServiceDto[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  return (
    <section
      id="shop"
      className="scroll-mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
            {t('shopSectionTitle' as any)}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('shopSectionSubtitle' as any)}
          </p>
        </div>
        {servicesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 overflow-hidden animate-pulse">
                <div className="h-36 bg-slate-200 dark:bg-slate-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {apiServices.slice(0, 8).map((service) => (
              <DigitalServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition"
          >
            {t('viewAll' as any)}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
