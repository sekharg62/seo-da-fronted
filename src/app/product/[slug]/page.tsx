import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { siteConfig } from '@/config/siteConfig'
import { getSiteUrl } from '@/lib/siteUrl'
import { getActiveServices, getServiceDetail, type ServiceDetailDto } from '@/lib/catalog'
import ProductDetailClient from './ProductDetailClient'

/** ISR: pages are static, refreshed at most every 5 min or instantly via /api/revalidate. */
export const revalidate = 300
/** Products added after the build are rendered on first request, then cached. */
export const dynamicParams = true

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const services = await getActiveServices()
    return services.filter((s) => s.slug).map((s) => ({ slug: s.slug }))
  } catch {
    return [] // API unavailable at build time → render on demand
  }
}

/**
 * Resolves the route param to a service. Legacy /product/<uuid> and non-canonical
 * casings 308-redirect to /product/<slug> so search engines consolidate on one URL.
 */
async function loadService(rawSlug: string): Promise<ServiceDetailDto> {
  let slug = rawSlug
  try {
    slug = decodeURIComponent(rawSlug)
  } catch {
    notFound()
  }
  slug = slug.trim().toLowerCase()
  const service = await getServiceDetail(slug)
  if (!service) notFound()
  if (service.slug && service.slug !== rawSlug) {
    permanentRedirect(`/product/${encodeURIComponent(service.slug)}`)
  }
  return service
}

function toMetaDescription(service: ServiceDetailDto): string {
  const text = (service.description || `Buy ${service.name} subscription at the best price in Bangladesh.`)
    .trim()
    .replace(/\s+/g, ' ')
  return text.length <= 160 ? text : `${text.slice(0, 157)}…`
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const service = await loadService((await params).slug)
  const url = `/product/${service.slug}`
  const title = `${service.name} Subscription`
  const description = toMetaDescription(service)
  const images = service.imgUrl ? [{ url: service.imgUrl, alt: service.name }] : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images },
    twitter: {
      card: service.imgUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: service.imgUrl ? [service.imgUrl] : undefined,
    },
    robots: { index: service.isActive !== false, follow: true },
  }
}

function productJsonLd(service: ServiceDetailDto): string {
  const siteUrl = getSiteUrl()
  const prices = service.servicePlans
    .flatMap((p) => [Number(p.sharedPrice), Number(p.personalPrice)])
    .filter((n) => Number.isFinite(n) && n > 0)
  const fallback = Number(service.price)
  const low = prices.length ? Math.min(...prices) : fallback
  const high = prices.length ? Math.max(...prices) : fallback

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: service.name,
    description: service.description || undefined,
    image: service.imgUrl || undefined,
    sku: service.id,
    url: `${siteUrl}/product/${service.slug}`,
    brand: { '@type': 'Brand', name: siteConfig.websiteName },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BDT',
      lowPrice: low,
      highPrice: high,
      offerCount: Math.max(prices.length, 1),
      availability:
        service.isActive === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  }).replace(/</g, '\\u003c')
}

export default async function ProductPage({ params }: Params) {
  const service = await loadService((await params).slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd(service) }} />
      {/* key resets plan/qty state when navigating between products */}
      <ProductDetailClient key={service.id} service={service} />
    </>
  )
}
