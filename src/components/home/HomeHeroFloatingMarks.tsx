/**
 * Abstract “service-style” marks (sparkle, hub, play, frame, globe) — not official brand logos.
 * Low-opacity, slow drift behind hero content.
 */
export function HomeHeroFloatingMarks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Sparkle — blue → violet gradient */}
      <div className="home-hero-float-mark home-hero-float-mark-a absolute left-[6%] top-[18%] h-12 w-12 opacity-[0.14] sm:left-[10%] sm:top-[22%] sm:h-14 sm:w-14 dark:opacity-[0.1]">
        <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="hf-grad-spark" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path
            fill="url(#hf-grad-spark)"
            d="M32 2 38 24 60 30 38 36 32 58 26 36 4 30 26 24 32 2Z"
          />
        </svg>
      </div>

      {/* Hex hub — soft “AI / network” feel */}
      <div className="home-hero-float-mark home-hero-float-mark-b absolute right-[8%] top-[12%] h-16 w-16 opacity-[0.11] sm:right-[12%] sm:h-[4.5rem] sm:w-[4.5rem] dark:opacity-[0.3]">
        <svg viewBox="0 0 128 128" fill="none" className="h-full w-full" aria-hidden>
          <mask
            id="hf-float-c-mask"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="8"
            y="8"
            width="112"
            height="112"
          >
            <path
              d="M63.892 8C62.08 38.04 38.04 62.08 8 63.892V64.108C38.04 65.92 62.08 89.96 63.892 120H64.108C65.92 89.96 89.96 65.92 120 64.108V63.892C89.96 62.08 65.92 38.04 64.108 8H63.892Z"
              fill="url(#hf-float-c-paint0)"
            />
          </mask>
          <g mask="url(#hf-float-c-mask)">
            <path
              d="M64 0C99.3216 0 128 28.6784 128 64C128 99.3216 99.3216 128 64 128C28.6784 128 0 99.3216 0 64C0 28.6784 28.6784 0 64 0Z"
              fill="url(#hf-float-c-paint1)"
            />
          </g>
          <defs>
            <linearGradient
              id="hf-float-c-paint0"
              x1="100.892"
              y1="30.04"
              x2="22.152"
              y2="96.848"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#217BFE" />
              <stop offset="0.14" stopColor="#1485FC" />
              <stop offset="0.27" stopColor="#078EFB" />
              <stop offset="0.52" stopColor="#548FFD" />
              <stop offset="0.78" stopColor="#A190FF" />
              <stop offset="0.89" stopColor="#AF94FE" />
              <stop offset="1" stopColor="#BD99FE" />
            </linearGradient>
            <linearGradient
              id="hf-float-c-paint1"
              x1="47.988"
              y1="82.52"
              x2="96.368"
              y2="32.456"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#217BFE" />
              <stop offset="0.14" stopColor="#1485FC" />
              <stop offset="0.27" stopColor="#078EFB" />
              <stop offset="0.52" stopColor="#548FFD" />
              <stop offset="0.78" stopColor="#A190FF" />
              <stop offset="0.89" stopColor="#AF94FE" />
              <stop offset="1" stopColor="#BD99FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Gradient starburst (user-provided mark) — streaming / AI vibe */}
      <div className="home-hero-float-mark home-hero-float-mark-c absolute bottom-[38%] left-[4%] h-11 w-11 opacity-[0.12] sm:bottom-[42%] sm:left-[6%] sm:h-12 sm:w-12 dark:opacity-[0.09]">
        <svg viewBox="0 0 128 128" fill="none" className="h-full w-full" aria-hidden>
          <mask
            id="hf-float-c-mask"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="8"
            y="8"
            width="112"
            height="112"
          >
            <path
              d="M63.892 8C62.08 38.04 38.04 62.08 8 63.892V64.108C38.04 65.92 62.08 89.96 63.892 120H64.108C65.92 89.96 89.96 65.92 120 64.108V63.892C89.96 62.08 65.92 38.04 64.108 8H63.892Z"
              fill="url(#hf-float-c-paint0)"
            />
          </mask>
          <g mask="url(#hf-float-c-mask)">
            <path
              d="M64 0C99.3216 0 128 28.6784 128 64C128 99.3216 99.3216 128 64 128C28.6784 128 0 99.3216 0 64C0 28.6784 28.6784 0 64 0Z"
              fill="url(#hf-float-c-paint1)"
            />
          </g>
          <defs>
            <linearGradient
              id="hf-float-c-paint0"
              x1="100.892"
              y1="30.04"
              x2="22.152"
              y2="96.848"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#217BFE" />
              <stop offset="0.14" stopColor="#1485FC" />
              <stop offset="0.27" stopColor="#078EFB" />
              <stop offset="0.52" stopColor="#548FFD" />
              <stop offset="0.78" stopColor="#A190FF" />
              <stop offset="0.89" stopColor="#AF94FE" />
              <stop offset="1" stopColor="#BD99FE" />
            </linearGradient>
            <linearGradient
              id="hf-float-c-paint1"
              x1="47.988"
              y1="82.52"
              x2="96.368"
              y2="32.456"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#217BFE" />
              <stop offset="0.14" stopColor="#1485FC" />
              <stop offset="0.27" stopColor="#078EFB" />
              <stop offset="0.52" stopColor="#548FFD" />
              <stop offset="0.78" stopColor="#A190FF" />
              <stop offset="0.89" stopColor="#AF94FE" />
              <stop offset="1" stopColor="#BD99FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Frame / clip corners — edit / creator vibe */}
      <div className="home-hero-float-mark home-hero-float-mark-d absolute right-[6%] top-[42%] h-14 w-14 opacity-[0.11] md:right-[8%] dark:opacity-[0.08]">
        <svg viewBox="0 0 56 56" className="h-full w-full text-slate-800 dark:text-slate-100">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            d="M10 22V14a4 4 0 014-4h8M46 22V14a4 4 0 00-4-4h-8M10 34v8a4 4 0 004 4h8M46 34v8a4 4 0 01-4 4h-8"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Small secondary sparkle */}
      <div className="home-hero-float-mark home-hero-float-mark-e absolute left-[32%] top-[8%] h-7 w-7 opacity-[0.1] sm:left-[38%] dark:opacity-[0.07]">
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <defs>
            <linearGradient id="hf-grad-spark2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <path fill="url(#hf-grad-spark2)" d="M20 2 24 16 38 20 24 24 20 38 16 24 2 20 16 16 20 2Z" />
        </svg>
      </div>

      {/* Globe — connectivity */}
      <div className="home-hero-float-mark home-hero-float-mark-f absolute bottom-[28%] right-[18%] h-12 w-12 opacity-[0.1] sm:right-[22%] dark:opacity-[0.075]">
        <svg viewBox="0 0 48 48" className="h-full w-full text-sky-600 dark:text-sky-400">
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.45" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
            d="M6 24h36M24 6c4 8 4 28 0 36M24 6c-4 8 -4 28 0 36"
          />
        </svg>
      </div>
    </div>
  )
}
