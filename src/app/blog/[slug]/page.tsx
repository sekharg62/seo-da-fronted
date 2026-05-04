import type { Metadata } from 'next'
import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { fetchBlogBySlug, fetchBlogs, type BlogDto } from '@/services/homeApiService'

export const revalidate = false
export const dynamic = 'force-static'
/** Only slugs returned at build time from the API are valid (true static). */
export const dynamicParams = false

const getBlogBySlug = cache(async (slug: string) => fetchBlogBySlug(slug))

function toMetaDescription(text: string): string {
  const t = text.trim().replace(/\s+/g, ' ')
  if (t.length <= 160) return t
  return `${t.slice(0, 157)}…`
}

export async function generateStaticParams() {
  try {
    const blogs = await fetchBlogs()
    return blogs.map((blog) => ({
      slug: blog.slug,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  let blog: BlogDto
  try {
    blog = await getBlogBySlug(slug)
  } catch {
    notFound()
  }

  const title = blog.title
  const description = toMetaDescription(blog.description)
  const ogImages = blog.imgUrl
    ? [{ url: blog.imgUrl, alt: blog.title }]
    : undefined

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      images: ogImages,
    },
    twitter: {
      card: blog.imgUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: blog.imgUrl ? [blog.imgUrl] : undefined,
    },
    robots: { index: true, follow: true },
  }
}

function blogPostingJsonLd(blog: BlogDto, slug: string) {
  const url = `https://digitalaccess-bd.com/blog/${slug}`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: blog.imgUrl || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'DigitalAccess BD',
      url: 'https://digitalaccess-bd.com',
    },
  }
  return JSON.stringify(data)
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let blog: BlogDto
  try {
    blog = await getBlogBySlug(slug)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: blogPostingJsonLd(blog, slug) }}
      />
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
            <FileText className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            {blog.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <time dateTime={blog.createdAt}>
              {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </p>
          <div className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {blog.description}
          </div>
        </div>
      </article>
    </div>
  )
}
