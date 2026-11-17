import { toPlainText } from './richTextPlain'

type ServiceText = {
  shortDesc?: string | null
  longDesc?: string | null
  description?: string | null
}

/** Full product details: longDesc, falling back to the legacy `description`. */
export function serviceDetails(s: ServiceText): string {
  return (s.longDesc ?? s.description ?? '').trim()
}

/** One–two line summary: shortDesc, falling back to the first non-empty line of the details. */
export function serviceSummary(s: ServiceText): string {
  const short = s.shortDesc?.trim()
  if (short) return short
  return toPlainText(serviceDetails(s)).split(/\n+/).map((l) => l.trim()).find(Boolean) ?? ''
}
