import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { getSiteUrl } from '@/lib/siteUrl'

export type BreadcrumbItem = {
  label: string
  /** Omit for the current page (last item). */
  href?: string
}

type Props = {
  /** Trail after "Home", e.g. [{ label: 'Shop', href: '/shop' }, { label: 'Netflix' }] */
  items: BreadcrumbItem[]
  className?: string
  /** Emit schema.org BreadcrumbList JSON-LD (rich results in Google). Default true. */
  jsonLd?: boolean
}

function breadcrumbJsonLd(trail: BreadcrumbItem[]): string {
  const siteUrl = getSiteUrl()
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href === '/' ? siteUrl : `${siteUrl}${item.href}` } : {}),
    })),
  }).replace(/</g, '\\u003c')
}

/**
 * Accessible, SEO-friendly breadcrumb trail.
 * - Semantic <nav aria-label> + <ol>, current page marked with aria-current="page"
 * - Separators are decorative (hidden from screen readers)
 * - Long labels truncate on small screens instead of overflowing
 * Has no hooks, so it works in both Server and Client Components.
 */
export function Breadcrumb({ items, className = '', jsonLd = true }: Props) {
  const trail: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items]
  const lastIndex = trail.length - 1

  return (
    <>
      <nav aria-label="Breadcrumb" className={`mb-6 min-w-0 ${className}`}>
        <ol className="flex min-w-0 items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
          {trail.map((item, index) => {
            const isLast = index === lastIndex
            const isHome = index === 0
            return (
              <li
                key={`${index}-${item.label}`}
                className={`flex items-center gap-1 ${isLast ? 'min-w-0' : 'shrink-0'}`}
              >
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-neutral-600" aria-hidden />
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    title={item.label}
                    className="truncate font-medium text-slate-800 dark:text-neutral-200"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded px-1 py-0.5 -mx-1 transition hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    {isHome && <Home className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd(trail) }} />
      )}
    </>
  )
}
