"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchBlogs, type BlogDto } from '@/services/homeApiService';

export function HomeBlog() {
  const [blogs, setBlogs] = useState<BlogDto[]>([])
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [blogsError, setBlogsError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setBlogsLoading(true)
      setBlogsError(null)
      try {
        const data = await fetchBlogs()
        if (!mounted) return
        setBlogs(data)
      } catch {
        if (!mounted) return
        setBlogsError('Failed to load latest blogs.')
      } finally {
        if (!mounted) return
        setBlogsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section id="latest-blog" className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Latest Blog
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">New updates from DigitalAccess DA.</p>
          </div>
          <div className="md:flex">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {blogsError ? (
          <p className="text-sm text-red-400">{blogsError}</p>
        ) : blogsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-slate-500">No blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {blogs.slice(0, 3).map((blog) => (
              <article
                key={blog.id}
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-emerald-500/40 transition"
              >
                <div className="h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {blog.imgUrl ? <img src={blog.imgUrl} alt={blog.title} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">{blog.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{blog.description}</p>
                  <div className="pt-1">
                    <Link
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 transition"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
