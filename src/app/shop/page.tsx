import type { Metadata } from 'next'
import { getActiveServices, getCategories, type CategoryDto } from '@/lib/catalog'
import { getSiteUrl } from '@/lib/siteUrl'
import { productHref } from '@/lib/productUrl'
import { siteConfig } from '@/config/siteConfig'
import type { ServiceDto } from '@/services/homeApiService'
import ShopClient from './ShopClient'

/** ISR: refreshed at most every 5 min, or instantly via /api/revalidate. */
export const revalidate = 300

const TITLE = 'Shop Premium Subscriptions'
const DESCRIPTION = `Browse all digital subscriptions at ${siteConfig.websiteName}: ChatGPT Plus, Gemini Pro, Netflix, YouTube Premium, CapCut Pro, Amazon Prime, VPN and more. Shared & personal plans, pay with bKash, Nagad or Rocket.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/shop' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/shop', type: 'website' },
}

function itemListJsonLd(services: ServiceDto[]): string {
  const siteUrl = getSiteUrl()
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}${productHref(s)}`,
      name: s.name,
    })),
  }).replace(/</g, '\\u003c')
}

export default async function ShopPage() {
  let services: ServiceDto[] = []
  let categories: CategoryDto[] = []
  let error: string | null = null

  const [svcResult, catResult] = await Promise.allSettled([getActiveServices(), getCategories()])
  if (svcResult.status === 'fulfilled') services = svcResult.value
  else error = 'Failed to load services.'
  if (catResult.status === 'fulfilled') categories = catResult.value

  return (
    <>
      {services.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJsonLd(services) }} />
      )}
      <ShopClient services={services} categories={categories} error={error} />
    </>
  )
}
