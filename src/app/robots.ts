import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/confirm-order', '/post-order'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
