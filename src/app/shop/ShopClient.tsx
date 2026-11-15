"use client"

import { useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { DigitalServiceCard } from '@/components/DigitalServiceCard'
import type { ServiceDto } from '@/services/homeApiService'
import type { CategoryDto } from '@/lib/catalog'

type Props = {
  /** Rendered on the server so products are in the HTML for search engines */
  services: ServiceDto[]
  categories: CategoryDto[]
  error?: string | null
}

export default function ShopClient({ services, categories, error = null }: Props) {
  const { t } = useLanguage()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  const filteredServices = useMemo(() => {
    return selectedCategoryId ? services.filter((s) => s.categoryId === selectedCategoryId) : services
  }, [services, selectedCategoryId])

  const visibleCategories = useMemo(() => {
    return categories.filter((c) => services.some((s) => s.categoryId === c.id))
  }, [categories, services])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
              {t('shopPageTitle' as any)}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('shopPageSubtitle' as any)}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => setSelectedCategoryId('')}
                className={[
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                  selectedCategoryId === ''
                    ? 'border-emerald-500 bg-emerald-500 text-emerald-950 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900/60',
                ].join(' ')}
              >
                All
              </button>

              {visibleCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    selectedCategoryId === c.id
                      ? 'border-emerald-500 bg-emerald-500 text-emerald-950 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900/60',
                  ].join(' ')}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-center py-20 text-red-500 dark:text-red-400">{error}</div>
          )}

          {!error && filteredServices.length === 0 && (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              No services {selectedCategoryId ? 'found for this category.' : 'available.'}
            </div>
          )}

          {!error && filteredServices.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredServices.map((service) => (
                <DigitalServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
    </div>
  )
}
