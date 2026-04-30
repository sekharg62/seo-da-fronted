"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { fetchBlogs, type BlogDto } from '@/services/homeApiService'

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchBlogs()
        if (!mounted) return
        setBlogs(data)
      } catch {
        if (!mounted) return
        setError('Failed to load blogs.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-slate-900 md:text-3xl dark:text-slate-50">
          <span className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-500/10">
            <FileText className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          </span>
          Latest Blog
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Read our latest updates.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none"
            />
          ))}
        </div>
      ) : error ? (
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
                    href={`/blog/${blog.id}`}
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
