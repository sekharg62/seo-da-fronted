import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { BlogDto } from '@/services/homeApiService'

/** Blog card shared by /blog and the home page. Whole card is one link. */
export function BlogCard({ blog }: { blog: BlogDto }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_18px_60px_-10px_rgba(16,185,129,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-offset-neutral-950"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-neutral-900">
        {blog.imgUrl ? (
          <img
            src={blog.imgUrl}
            alt={blog.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-neutral-100 dark:group-hover:text-emerald-400">
          {blog.title}
        </h3>
        <p className="line-clamp-3 text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">{blog.description}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
