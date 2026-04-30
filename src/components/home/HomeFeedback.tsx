"use client";

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchFeedbacks, type FeedbackDto } from '@/services/homeApiService';

function FeedbackStars({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400 mb-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.floor(stars)
              ? 'fill-current'
              : i < stars
                ? 'fill-current opacity-50'
                : 'text-slate-300 dark:text-slate-700'
          }`}
        />
      ))}
    </div>
  )
}

export function HomeFeedback() {
  const { t } = useLanguage()
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

  return (
    <section
      id="customer-feedback"
      className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
            {t('customerFeedbackTitle' as any)}
          </h2>
        </div>

        {/* Feedback marquee */}
        <style>{`
          @keyframes da-feedback-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .da-feedback-marquee:hover .da-feedback-marquee-track {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .da-feedback-marquee-track { animation: none !important; }
          }
        `}</style>

        {feedbackLoading ? (
          <div className="flex gap-3 overflow-hidden">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="shrink-0 w-64 sm:w-72 lg:w-80 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-100 dark:bg-slate-800 p-4 h-32 animate-pulse"
              />
            ))}
          </div>
        ) : feedbackError ? (
          <div className="text-sm text-red-400 px-2 py-3">{feedbackError}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-sm text-slate-500 px-2 py-3">No feedback found.</div>
        ) : (
          <div className="da-feedback-marquee relative">
            <div className="overflow-hidden">
              <div
                className="da-feedback-marquee-track flex"
                style={{
                  animation: `da-feedback-marquee ${Math.max(18, feedbacks.length * 4)}s linear infinite`,
                }}
              >
                {/* Double mapped elements for seamless infinite marquee scroll */}
                {[0, 1].map((blockIdx) => (
                  <div key={blockIdx} className="flex">
                    {feedbacks.map((fb) => (
                      <div
                        key={fb.id}
                        className="shrink-0 w-64 sm:w-72 lg:w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 mr-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                            {fb.profileUrl ? (
                              <img
                                src={fb.profileUrl}
                                alt={fb.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-semibold text-slate-500">
                                {(fb.name ?? '').trim().slice(0, 1).toUpperCase() || '?'}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <FeedbackStars stars={fb.stars} />
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                              {fb.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {fb.position}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-4">
                          {fb.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
