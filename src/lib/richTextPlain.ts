/**
 * Dependency-free helpers for rich-text descriptions (safe to import from client components).
 * Descriptions are stored as HTML (from the admin editor). Older entries are plain text or
 * light Markdown, so every reader goes through these helpers.
 */

const HTML_TAG = /<\/?(p|br|h[1-6]|ul|ol|li|strong|b|em|i|u|a|blockquote|hr|div|span)\b[^>]*>/i

export function looksLikeHtml(value: string): boolean {
  return HTML_TAG.test(value)
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function inline(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, '$1<em>$2</em>')
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
  // bare URLs (not already inside an href)
  out = out.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>')
  return out
}

/** Light Markdown / plain text → HTML (headings, bold, italic, links, bullet lists, paragraphs). */
export function markdownToHtml(source: string): string {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const html: string[] = []
  let list: string[] = []
  let para: string[] = []

  const flushPara = () => {
    if (para.length) html.push(`<p>${para.map(inline).join('<br>')}</p>`)
    para = []
  }
  const flushList = () => {
    if (list.length) html.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`)
    list = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flushPara()
      flushList()
      continue
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      flushPara()
      flushList()
      const level = Math.min(heading[1].length + 1, 3) // # → h2 (the page already has an h1)
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      continue
    }
    const bullet = /^(?:[-*•●▪]|✅|🔷|✔️|☑️)\s+(.*)$/u.exec(line)
    if (bullet) {
      flushPara()
      list.push(bullet[1])
      continue
    }
    flushList()
    para.push(line)
  }
  flushPara()
  flushList()
  return html.join('')
}

/** Whatever is stored (HTML, Markdown or plain text) → HTML string (NOT yet sanitized). */
export function toHtml(value: string | null | undefined): string {
  const v = (value ?? '').trim()
  if (!v) return ''
  return looksLikeHtml(v) ? v : markdownToHtml(v)
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" }

/** Whatever is stored → readable plain text (cards, search, meta descriptions, JSON-LD). */
export function toPlainText(value: string | null | undefined): string {
  const v = (value ?? '').trim()
  if (!v) return ''
  if (!looksLikeHtml(v)) {
    return v.replace(/^#{1,6}\s+/gm, '').replace(/\*\*(.+?)\*\*/g, '$1').trim()
  }
  return v
    .replace(/<\/(p|h[1-6]|li|blockquote|div)>|<br\s*\/?>|<hr\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e] ?? m)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim()
}
