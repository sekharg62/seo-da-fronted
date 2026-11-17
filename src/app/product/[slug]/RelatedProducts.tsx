"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DigitalServiceCard } from '@/components/DigitalServiceCard'
import type { ServiceDto } from '@/services/homeApiService'

export function RelatedProducts({ services }: { services: ServiceDto[] }) {
  const { language } = useLanguage()
  if (services.length === 0) return null
  const bn = language === 'bn'

  return (
    <section className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 pb-12" aria-labelledby="related-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="related-heading" className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
          {bn ? 'আরও দেখুন' : 'You may also like'}
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {bn ? 'সব পণ্য' : 'View all'} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {services.map((s) => (
          <DigitalServiceCard key={s.id} service={s} />
        ))}
      </div>
    </section>
  )
}
