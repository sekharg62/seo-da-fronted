"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Headphones, Sparkles, Wallet } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { HomeHeroBackground } from './HomeHeroBackground'
import { HomeHeroStats } from './HomeHeroStats'

/** Rotating hero highlight lines — typed char-by-char with slide-in. */
const HERO_HIGHLIGHT_PHRASES = ['Netflix, CapCut, Grok', 'Canva, Gemini, VPN'] as const

const HIGHLIGHT_CHAR_MS = 46
const HIGHLIGHT_HOLD_MS = 2600

const HIGHLIGHT_GRADIENT =
  'home-hero-title-highlight inline-block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400'

function HeroAnimatedHighlight() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)
  const [reducedMotion, setReducedMotion] = useState(false)

  const phrase = HERO_HIGHLIGHT_PHRASES[phraseIndex]

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    if (visibleCount < phrase.length) {
      const t = window.setTimeout(() => setVisibleCount((c) => c + 1), HIGHLIGHT_CHAR_MS)
      return () => clearTimeout(t)
    }
    const t = window.setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % HERO_HIGHLIGHT_PHRASES.length)
      setVisibleCount(1)
    }, HIGHLIGHT_HOLD_MS)
    return () => clearTimeout(t)
  }, [reducedMotion, phrase, visibleCount])

  useEffect(() => {
    if (!reducedMotion) return
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % HERO_HIGHLIGHT_PHRASES.length)
    }, 3800)
    return () => clearInterval(id)
  }, [reducedMotion])

  return (
    <span className="relative z-10 inline-block max-w-full text-left leading-tight">
      {reducedMotion ? (
        <span className={HIGHLIGHT_GRADIENT}>{phrase}</span>
      ) : (
        Array.from({ length: visibleCount }, (_, i) => {
          const ch = phrase[i]!
          return (
            <span key={`${phraseIndex}-${i}`} className={`home-hero-char-in ${HIGHLIGHT_GRADIENT}`}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          )
        })
      )}
    </span>
  )
}

/**
 * Yellow scribble sits in the same typographic line as the highlight (absolute behind text).
 * Fixed width; vertical size tracks em so it scales with the h1. Clipped so ink doesn’t spill into line 3.
 */
function HeroHighlightScribble() {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-0 overflow-hidden text-inherit"
      aria-hidden
    >
      <svg
        viewBox="0 0 418 42"
        className="absolute bottom-0 left-0 h-[0.52em] w-[min(100%,17.5rem)] max-w-full fill-yellow-400 text-inherit opacity-90 sm:w-[20.5rem] md:w-[23rem] lg:w-[24.5rem] dark:fill-yellow-300 dark:opacity-85"
        preserveAspectRatio="none"
        overflow="hidden"
      >
        <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
      </svg>
    </span>
  )
}

/** One line of hero headline (stops typing / wrap from jumping row height vs lines 1 & 3). */
const HIGHLIGHT_LINE_MIN =
  'min-h-[1.74rem] sm:min-h-[2.59rem] md:min-h-[3.125rem] lg:min-h-[3rem]'

/** Second line: normal line height + scribble behind text only (no extra “strip” under the row). */
function HeroTitleHighlightRow() {
  return (
    <span className="relative mt-1 block w-full max-w-[min(100%,26.5rem)] sm:mt-1.5 sm:max-w-[min(100%,28rem)] md:max-w-[min(100%,30rem)]">
      <span className={`relative z-10 block w-full leading-[inherit] ${HIGHLIGHT_LINE_MIN}`}>
        <HeroAnimatedHighlight />
      </span>
      <HeroHighlightScribble />
    </span>
  )
}

export function HomeHero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-x-hidden overflow-y-visible">
      <HomeHeroBackground />
      <div className="relative z-10 mx-auto min-w-0 max-w-6xl grid grid-cols-1 gap-6 px-3 py-6 sm:px-6 sm:py-8 md:grid-cols-2 md:gap-8 md:py-10 md:items-stretch lg:py-14">
        <div className="flex min-w-0 w-full max-w-xl flex-col space-y-4 sm:space-y-5 md:max-w-none md:space-y-6">
          <div className="inline-flex w-fit max-w-full shrink-0 self-start items-center gap-2 rounded-full border border-emerald-400/20 bg-white/80 px-3 py-1.5 text-[11px] font-medium text-emerald-900 shadow-md shadow-emerald-900/[0.06] backdrop-blur-xl ring-1 ring-white/80 dark:border-emerald-500/30 dark:bg-slate-900/70 dark:text-emerald-100 dark:shadow-black/30 dark:ring-white/[0.1] sm:px-4 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span className="break-words text-left leading-snug">{t('homeBadge' as any)}</span>
          </div>
          <div className="min-w-0 space-y-3 sm:space-y-5">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="home-hero-headline break-words text-[1.45rem] font-semibold leading-[1.2] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl sm:leading-[1.15] md:text-[2.5rem] md:leading-tight lg:text-[2.75rem] lg:leading-[1.08]">
                <span className="block">{t('homeHeroTitlePrefix' as any)}</span>
                <HeroTitleHighlightRow />
                <span className="mt-1 block sm:mt-1.5">{t('homeHeroTitleSuffix' as any)}</span>
              </h1>
            </div>
            <p className="max-w-lg text-xs leading-relaxed text-slate-600 dark:text-slate-300/95 sm:text-sm md:text-base md:leading-relaxed">
              {t('homeHeroDescription' as any)}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <span className="home-hero-cta-border-outer relative isolate inline-flex w-full overflow-hidden rounded-full p-[2px] sm:w-auto">
              <span className="home-hero-cta-border-spin" aria-hidden />
              <Link
                href="#shop"
                className="home-hero-cta-premium group relative z-10 inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-6 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 ring-1 ring-white/40 transition hover:from-emerald-300 hover:to-emerald-500 hover:shadow-emerald-500/40 active:scale-[0.98] dark:shadow-emerald-900/45 dark:ring-emerald-200/20 sm:px-8 sm:py-2"
              >
                <span className="relative z-10 truncate">{t('homeCtaExploreProducts' as any)}</span>
                <ArrowRight
                  className="relative z-10 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </span>
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:text-left sm:text-[11px] sm:pl-1">
              {t('homeHeroTrustLine' as any)}
            </p>
          </div>

          <div className="mt-auto grid min-w-0 grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2 sm:gap-3">
            <div className="group min-w-0 rounded-lg border border-white/90 bg-white/75 p-3.5 shadow-md shadow-slate-900/[0.04] backdrop-blur-md transition hover:border-emerald-300/50 hover:shadow-lg hover:shadow-emerald-900/[0.05] dark:border-slate-700/90 dark:bg-slate-900/55 dark:shadow-black/25 dark:hover:border-emerald-500/35">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 shadow-inner ring-1 ring-emerald-500/15 dark:from-emerald-500/25 dark:ring-emerald-400/20">
                  <Wallet className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-hidden />
                </div>
                <p className="min-w-0 flex-1 break-words font-semibold text-slate-800 dark:text-slate-100 text-xs leading-snug sm:text-[13px]">
                  {t('homeBullet1Title' as any)}
                </p>
              </div>
              <p className="mt-2 min-w-0 pl-11 text-[11px] leading-relaxed text-slate-500 break-words dark:text-slate-400 sm:text-xs">
                {t('homeBullet1Body' as any)}
              </p>
            </div>
            <div className="group min-w-0 rounded-lg border border-white/90 bg-white/75 p-3.5 shadow-md shadow-slate-900/[0.04] backdrop-blur-md transition hover:border-emerald-300/50 hover:shadow-lg hover:shadow-emerald-900/[0.05] dark:border-slate-700/90 dark:bg-slate-900/55 dark:shadow-black/25 dark:hover:border-emerald-500/35">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 shadow-inner ring-1 ring-emerald-500/15 dark:from-emerald-500/25 dark:ring-emerald-400/20">
                  <Headphones className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-hidden />
                </div>
                <p className="min-w-0 flex-1 break-words font-semibold text-slate-800 dark:text-slate-100 text-xs leading-snug sm:text-[13px]">
                  {t('homeBullet2Title' as any)}
                </p>
              </div>
              <p className="mt-2 min-w-0 pl-11 text-[11px] leading-relaxed text-slate-500 break-words dark:text-slate-400 sm:text-xs">
                {t('homeBullet2Body' as any)}
              </p>
            </div>
          </div>
        </div>

        <HomeHeroStats />

        <div
          className="col-span-full mt-2 h-px max-w-md justify-self-center bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent dark:via-emerald-500/25 md:mt-4 md:max-w-lg"
          aria-hidden
        />
      </div>
    </section>
  )
}
