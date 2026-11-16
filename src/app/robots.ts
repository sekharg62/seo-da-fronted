import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/confirm-order', '/create-order', '/track-order', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
