import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * On-demand ISR hook called by the backend after admin changes to services / plans.
 *   POST /api/revalidate   header: x-revalidate-secret: <REVALIDATE_SECRET>
 *   body: { "tags": ["services", "service:chatgpt-plus"] }
 */
const ALLOWED_TAG = /^(services|service:[a-z0-9-]{1,120})$/

function isAuthorized(provided: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || !provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string' && ALLOWED_TAG.test(t)).slice(0, 50)
    : []
  if (tags.length === 0) {
    return NextResponse.json({ message: 'No valid tags' }, { status: 400 })
  }

  // expire: 0 → next request fetches fresh data (prices/stock must not stay stale).
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return NextResponse.json({ revalidated: tags, now: Date.now() })
}
