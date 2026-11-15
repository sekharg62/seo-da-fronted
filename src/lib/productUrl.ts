/** Canonical storefront URL for a service (slug, falling back to id for legacy rows). */
export function productHref(service: { id: string; slug?: string | null }): string {
  return `/product/${encodeURIComponent(service.slug || service.id)}`
}
