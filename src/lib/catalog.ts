import { cache } from 'react'
import type { ServiceDto } from '@/services/homeApiService'
import type { BlogDto } from '@/services/homeApiService'
import type { ServicePlanDto } from '@/services/servicePlanService'

/**
 * Server-side catalog reads for product pages / sitemap.
 * Cached in the Next.js Data Cache with tags so the backend can purge them on change
 * (POST /api/revalidate), with a time-based fallback of CATALOG_REVALIDATE_SECONDS.
 */
export const CATALOG_REVALIDATE_SECONDS = 300

export const catalogTags = {
  all: 'services',
  service: (slug: string) => `service:${slug}`,
}

export type ServiceDetailDto = ServiceDto & { servicePlans: ServicePlanDto[] }

function apiBaseUrl(): string {
  return (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
}

/** Service + plans in one request. Returns null when the service does not exist. */
export const getServiceDetail = cache(async (slug: string): Promise<ServiceDetailDto | null> => {
  const res = await fetch(`${apiBaseUrl()}/api/public/service-details/${encodeURIComponent(slug)}`, {
    next: {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: [catalogTags.all, catalogTags.service(slug)],
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load service "${slug}": ${res.status}`)
  return res.json()
})

/** Active services (card fields only) — used for static params and the sitemap. */
export const getActiveServices = cache(async (): Promise<ServiceDto[]> => {
  const res = await fetch(`${apiBaseUrl()}/api/public/services`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [catalogTags.all] },
  })
  if (!res.ok) throw new Error(`Failed to load services: ${res.status}`)
  return res.json()
})

/** Homepage "trending" list (same endpoint the client used to call). */
export const getTrendingServices = cache(async (): Promise<ServiceDto[]> => {
  const res = await fetch(`${apiBaseUrl()}/api/public/trending`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [catalogTags.all] },
  })
  if (!res.ok) throw new Error(`Failed to load trending services: ${res.status}`)
  return res.json()
})

export type CategoryDto = { id: string; name: string; description?: string | null }

export const getCategories = cache(async (): Promise<CategoryDto[]> => {
  const res = await fetch(`${apiBaseUrl()}/api/categories`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [catalogTags.all, 'categories'] },
  })
  if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`)
  return res.json()
})

/** Blog list, cached in the Next.js Data Cache; purged by the backend via the `blogs` tag. */
export const getBlogs = cache(async (): Promise<BlogDto[]> => {
  const res = await fetch(`${apiBaseUrl()}/api/blogs`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ['blogs'] },
  })
  if (!res.ok) throw new Error(`Failed to load blogs: ${res.status}`)
  return res.json()
})

/** Single blog by slug. Returns null when it does not exist. */
export const getBlogBySlug = cache(async (slug: string): Promise<BlogDto | null> => {
  const res = await fetch(`${apiBaseUrl()}/api/blogs/${encodeURIComponent(slug)}`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ['blogs'] },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load blog "${slug}": ${res.status}`)
  return res.json()
})
