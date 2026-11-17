"use client";

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchFeedbacks, type FeedbackDto } from '@/services/homeApiService';

function FeedbackStars({ stars, className = 'h-4 w-4' }: { stars: number; className?: string }) {
  const rounded = Math.round(stars)
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${stars} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={`${className} ${
            i < rounded ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300 dark:text-neutral-700'
          }`}
        />
      ))}
    </div>
  )
}

export function HomeFeedback() {
  const { t, language } = useLanguage()
  const bn = language === 'bn'
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setFeedbackLoading(true)
      setFeedbackError(null)
      try {
        const data = await fetchFeedbacks()
        if (!mounted) return
        setFeedbacks(data)
      } catch {
        if (!mounted) return
        setFeedbackError('Failed to load feedback.')
      } finally {
        if (!mounted) return
        setFeedbackLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const count = feedbacks.length
  const average = count ? feedbacks.reduce((sum, f) => sum + (Number(f.stars) || 0), 0) / count : 0
  // Repeat the list so one block is always wider than a big screen, then duplicate the block for a seamless loop.
  const repeat = count ? Math.max(1, Math.ceil(8 / count)) : 1
  const block = Array.from({ length: repeat }).flatMap(() => feedbacks)

  return (
    <section
      id="customer-feedback"
      className="bg-slate-50 dark:bg-[#0a0a0a]"
    >
      <div className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 md:py-10">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-50 md:text-2xl">
            {t('customerFeedbackTitle')}
          </h2>
          {count > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black leading-none text-gray-900 dark:text-white">
                {average.toFixed(1)}
              </span>
              <div>
                <FeedbackStars stars={average} />
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  {bn ? `${count}টি রিভিউ` : `Based on ${count} review${count === 1 ? '' : 's'}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {feedbackLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-lg border border-gray-200 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900" />
            ))}
          </div>
        ) : feedbackError ? (
          <div className="py-3 text-sm text-red-400">{feedbackError}</div>
        ) : count === 0 ? (
          <div className="py-3 text-sm text-gray-500">No feedback found.</div>
        ) : (
          <div className="da-fb-viewport relative">
            <style>{`
              @keyframes da-fb-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              .da-fb-viewport { overflow: hidden; -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent); mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent); }
              .da-fb-track { width: max-content; animation: da-fb-scroll var(--da-fb-duration, 60s) linear infinite; will-change: transform; }
              .da-fb-viewport:hover .da-fb-track, .da-fb-viewport:focus-within .da-fb-track { animation-play-state: paused; }
              @media (prefers-reduced-motion: reduce) {
                .da-fb-viewport { overflow-x: auto; }
                .da-fb-track { animation: none; }
                .da-fb-dup { display: none; }
              }
            `}</style>
            <div
              className="da-fb-track flex"
              style={{ ['--da-fb-duration' as string]: `${Math.max(40, block.length * 6)}s` }}
            >
              {[0, 1].map((dup) => (
                <div
                  key={dup}
                  className={`flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4 ${dup === 1 ? 'da-fb-dup' : ''}`}
                  aria-hidden={dup === 1 ? true : undefined}
                >
                  {block.map((fb, i) => (
                    <figure
                    key={`${fb.id}-${i}`}
                  className="flex h-full w-72 shrink-0 flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#0f0f0f] sm:w-80 sm:p-5"
                >
                  <div>
                    <FeedbackStars stars={fb.stars} />
                    <blockquote className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-neutral-200">
                      <p className="line-clamp-5">{fb.description}</p>
                    </blockquote>
                  </div>
                  <figcaption className="flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-neutral-800">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50 dark:bg-amber-950/50">
                      {fb.profileUrl ? (
                        <img
                          src={fb.profileUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                          {(fb.name ?? '').trim().slice(0, 1).toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-neutral-50">{fb.name}</p>
                      {fb.position ? (
                        <p className="truncate text-xs text-gray-500 dark:text-neutral-400">{fb.position}</p>
                      ) : null}
                    </div>
                  </figcaption>
                </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
