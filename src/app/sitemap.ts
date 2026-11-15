import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'
import { fetchBlogs } from '@/services/homeApiService'
import { getActiveServices } from '@/lib/catalog'
import { LEGAL_LAST_UPDATED } from '@/content/legal'

const LEGAL_LAST_MODIFIED = new Date(LEGAL_LAST_UPDATED)

function parseLastModified(...values: (string | undefined)[]): Date | undefined {
  for (const value of values) {
    if (!value) continue
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date
  }
  return undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    const blogs = await fetchBlogs()
    for (const blog of blogs) {
      routes.push({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: parseLastModified(blog.updatedAt, blog.createdAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  } catch {
    // Keep static routes when the API is unavailable at build time.
  }

  try {
    const services = await getActiveServices()
    for (const service of services) {
      if (!service.isActive || !service.slug) continue
      routes.push({
        url: `${baseUrl}/product/${service.slug}`,
        lastModified: parseLastModified(service.updatedAt, service.createdAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch {
    // Keep static routes when the API is unavailable at build time.
  }

  return routes
}
