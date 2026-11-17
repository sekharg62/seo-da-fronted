"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { fetchBlogs, type BlogDto } from '@/services/homeApiService';

export function HomeBlog() {
  const [blogs, setBlogs] = useState<BlogDto[]>([])
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [blogsError, setBlogsError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
      ; (async () => {
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
    <section id="latest-blog" className="bg-slate-50 dark:bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-8 md:py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-neutral-50 mb-1">
              Latest Blog
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">New updates from DigitalAccess DA.</p>
          </div>
          <div className="md:flex">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800/60 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-neutral-100 hover:bg-gray-200 dark:hover:bg-neutral-800 transition"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {blogsError ? (
          <p className="text-sm text-red-400">{blogsError}</p>
        ) : blogsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-white/60 dark:bg-[#0f0f0f] border border-gray-200 dark:border-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-gray-500">No blogs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {blogs.slice(0, 4).map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
