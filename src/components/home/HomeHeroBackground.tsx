import { HomeHeroFloatingMarks } from './HomeHeroFloatingMarks'

/**
 * Decorative full-bleed layers for the home hero (pointer-events none).
 */
export function HomeHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/95 via-slate-50 to-slate-50 dark:from-emerald-950/35 dark:via-slate-950 dark:to-slate-950" />

      <div className="home-hero-bg-blob-a absolute -left-[18%] -top-[32%] h-[min(92vw,540px)] w-[min(92vw,540px)] rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-500/[0.22]" />
      <div className="home-hero-bg-blob-b absolute -right-[12%] top-[5%] h-[min(72vw,440px)] w-[min(72vw,440px)] rounded-full bg-teal-300/25 blur-3xl dark:bg-cyan-500/[0.14]" />
      <div className="home-hero-bg-blob-c absolute -bottom-[28%] left-[12%] h-[min(85vw,500px)] w-[min(85vw,500px)] rounded-full bg-sky-200/20 blur-3xl dark:bg-emerald-600/[0.12]" />

      <HomeHeroFloatingMarks />

      <div className="home-hero-bg-grid absolute inset-0" />
      <div className="home-hero-bg-texture absolute inset-0" />
      <div className="home-hero-bg-shine absolute inset-0" />
      <div className="home-hero-bg-vignette absolute inset-0" />
    </div>
  )
}
