/**
 * Serve Cloudinary images resized + in modern formats (WebP/AVIF) for faster pages (Core Web Vitals).
 * Non-Cloudinary URLs are returned unchanged.
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/x.jpg
 *   → https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,c_limit,w_600/v123/x.jpg
 */
export function optimizedImage(url: string | null | undefined, width: number): string | undefined {
  if (!url) return undefined
  const marker = '/image/upload/'
  const i = url.indexOf(marker)
  if (!url.includes('res.cloudinary.com') || i === -1) return url
  const rest = url.slice(i + marker.length)
  // Already transformed (first segment has commas/underscored params) → leave as is
  if (/^[a-z]{1,3}_[^/]*\//.test(rest)) return url
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,c_limit,w_${width}/${rest}`
}
