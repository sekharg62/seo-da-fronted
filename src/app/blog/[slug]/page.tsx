import type { Metadata } from 'next'
import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { fetchBlogBySlug, fetchBlogs, type BlogDto } from '@/services/homeApiService'
import { Breadcrumb } from '@/components/Breadcrumb'
import { getSiteUrl } from '@/lib/siteUrl'
import { siteConfig } from '@/config/siteConfig'

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
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/blog/${slug}`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: blog.imgUrl || undefined,
    author: { '@type': 'Organization', name: siteConfig.websiteName, url: siteUrl },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteConfig.websiteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/Blue.png` },
    },
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
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
    <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: blogPostingJsonLd(blog, slug) }}
      />
      <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: blog.title }]} className="mb-4" />
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800/60 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-neutral-100 hover:bg-gray-200 dark:hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          All Blogs
        </Link>
      </div>
      <article className="overflow-hidden rounded-lg border border-gray-200 bg-white/70 dark:border-neutral-800 dark:bg-[#0f0f0f]">
        {blog.imgUrl ? (
          <div className="relative aspect-video max-h-[70vh] w-full overflow-hidden bg-gray-900">
            {/* Blurred copy fills the frame so any aspect ratio looks intentional */}
            <img
              src={blog.imgUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl saturate-150"
            />
            {/* Real image is shown whole (never cropped) */}
            <img
              src={blog.imgUrl}
              alt={blog.title}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        ) : null}
        <div className="mx-auto w-full max-w-4xl space-y-4 p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-neutral-50 flex items-center gap-2">
            <FileText className="h-6 w-6 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
            {blog.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            <time dateTime={blog.createdAt}>
              {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </p>
          <div className="text-sm md:text-base text-slate-700 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
            {blog.description}
          </div>
        </div>
      </article>
    </div>
  )
}
