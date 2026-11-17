import { toSafeHtml } from '@/lib/richText'

/** Server component: renders a stored description as sanitized rich text. */
export function RichText({ value, className = '' }: { value: string | null | undefined; className?: string }) {
  const html = toSafeHtml(value)
  if (!html) return null
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
