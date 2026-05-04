import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { fetchBlogs, type BlogDto } from '@/services/homeApiService'

export const revalidate = false // Force SSG
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Latest updates, industry insights, and stories from DigitalAccess BD — digital subscriptions, guides, and product news.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | DigitalAccess BD',
    description:
      'Discover our latest updates, industry insights, and stories about digital services and subscriptions.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | DigitalAccess BD',
    description:
      'Discover our latest updates, industry insights, and stories about digital services and subscriptions.',
  },
  robots: { index: true, follow: true },
}

export default async function BlogListPage() {
  let blogs: BlogDto[] = []
  let error: string | null = null

  try {
    blogs = await fetchBlogs()
  } catch {
    error = 'Failed to load blogs.'
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-10">
        <nav className="mb-6 flex text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-200">Blog</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-400">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Latest Blog
          </h1>
        </div>
        <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
          Discover our latest updates, industry insights, and stories.
        </p>
      </header>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none dark:hover:border-emerald-500/40"
            >
              <div className="h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {blog.imgUrl ? (
                  <img src={blog.imgUrl} alt={blog.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="space-y-2 p-4">
                <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-50">{blog.title}</h2>
                <p className="line-clamp-3 text-xs text-slate-600 dark:text-slate-300">{blog.description}</p>
                <div className="pt-2">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 rounded-md text-xs font-medium text-emerald-700 outline-none transition hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-emerald-300 dark:hover:text-emerald-200 dark:focus-visible:ring-offset-slate-950"
                  >
                    Read more <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
