import sanitizeHtml from 'sanitize-html'
import { toHtml } from './richTextPlain'

/** Server-side only (sanitize-html is large). Never render stored HTML without this. */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'hr', 'a'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: {
    h1: 'h2',
    a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer nofollow' }),
  },
}

/** Stored description (HTML, Markdown or plain text) → sanitized HTML ready for dangerouslySetInnerHTML. */
export function toSafeHtml(value: string | null | undefined): string {
  return sanitizeHtml(toHtml(value), OPTIONS)
}
