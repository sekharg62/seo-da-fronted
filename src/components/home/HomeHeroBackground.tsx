import { HomeHeroFloatingMarks } from './HomeHeroFloatingMarks'

/**
 * Decorative full-bleed layers for the home hero (pointer-events none).
 */
export function HomeHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/95 via-slate-50 to-slate-50 dark:from-black dark:via-black dark:to-black" />

      <div className="home-hero-bg-blob-a dark:hidden absolute -left-[18%] -top-[32%] h-[min(92vw,540px)] w-[min(92vw,540px)] rounded-full bg-amber-400/30 blur-3xl dark:bg-amber-500/[0.22]" />
      <div className="home-hero-bg-blob-b dark:hidden absolute -right-[12%] top-[5%] h-[min(72vw,440px)] w-[min(72vw,440px)] rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/[0.14]" />
      <div className="home-hero-bg-blob-c dark:hidden absolute -bottom-[28%] left-[12%] h-[min(85vw,500px)] w-[min(85vw,500px)] rounded-full bg-orange-200/20 blur-3xl dark:bg-amber-600/[0.12]" />

      <HomeHeroFloatingMarks />

      <div className="home-hero-bg-grid absolute inset-0" />
      <div className="home-hero-bg-texture dark:hidden absolute inset-0" />
      <div className="home-hero-bg-shine dark:hidden absolute inset-0" />
      <div className="home-hero-bg-vignette dark:hidden absolute inset-0" />
    </div>
  )
}
