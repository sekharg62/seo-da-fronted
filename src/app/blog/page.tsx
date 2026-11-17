import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { fetchBlogs, type BlogDto } from '@/services/homeApiService'
import { BlogCard } from '@/components/BlogCard'
import { Breadcrumb } from '@/components/Breadcrumb'

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
    <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-10">
        <Breadcrumb items={[{ label: 'Blog' }]} />
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-400">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Latest Blog
          </h1>
        </div>
        <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-neutral-400">
          Discover our latest updates, industry insights, and stories.
        </p>
      </header>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-neutral-400">No blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}
