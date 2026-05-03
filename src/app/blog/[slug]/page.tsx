"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { fetchBlogBySlug, type BlogDto } from '@/services/homeApiService'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [blog, setBlog] = useState<BlogDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log("params ", params)

  useEffect(() => {
    let mounted = true
    if (!slug) return
      ; (async () => {
        setLoading(true)
        setError(null)
        try {
          const data = await fetchBlogBySlug(slug)
          if (!mounted) return
          setBlog(data)
        } catch {
          if (!mounted) return
          setError('Blog not found.')
        } finally {
          if (!mounted) return
          setLoading(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [slug])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          All Blogs
        </Link>
        <Link
          href="/"
          className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          Home
        </Link>
      </div>
      {loading ? (
        <div className="space-y-4">
          <div className="h-64 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
          <div className="h-8 w-3/5 rounded bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
          <div className="h-24 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-400">{error}</div>
      ) : !blog ? (
        <div className="text-sm text-slate-500">No blog found.</div>
      ) : (
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex justify-center border-b border-slate-200 bg-slate-100 px-2 py-4 dark:border-slate-700 dark:bg-slate-800">
            {blog.imgUrl ? (
              <img
                src={blog.imgUrl}
                alt={blog.title}
                className="h-auto max-h-[min(85vh,960px)] w-auto max-w-full object-contain"
              />
            ) : null}
          </div>
          <div className="p-6 md:p-8 space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              {blog.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{blog.description}</p>
          </div>
        </article>
      )}
    </div>
  )
}
