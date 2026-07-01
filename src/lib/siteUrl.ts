import { siteConfig } from '@/config/siteConfig'

/** Canonical site origin for sitemap, robots, and absolute SEO URLs. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  return siteConfig.websiteUrl.replace(/\/$/, '')
}
