export function SuccessPage({ title, message, hint }: { title: string; message: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/25 dark:bg-emerald-500/10">
      <div className="mb-4 flex items-center gap-4">
        <div
          className="da-success-check relative grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/20 dark:bg-emerald-500 dark:ring-emerald-300/15"
          aria-hidden
        >
          <svg viewBox="0 0 52 52" className="h-10 w-10" fill="none">
            <circle className="da-success-check__circle" cx="26" cy="26" r="24" />
            <path className="da-success-check__tick" d="M14 27 L22 35 L38 18" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">{title}</h2>
      </div>
      <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-200/80">{message}</p>
      {hint ? (
        <p className="mt-4 text-xs text-emerald-800/70 dark:text-emerald-200/70">{hint}</p>
      ) : null}

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .da-success-check {
            animation: da-success-pop 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .da-success-check__circle {
            animation: da-success-circle 620ms ease-out both;
          }
          .da-success-check__tick {
            animation: da-success-tick 520ms 140ms ease-out both;
          }
        }

        .da-success-check__circle {
          stroke: rgba(255, 255, 255, 0.35);
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
        }

        .da-success-check__tick {
          stroke: #ffffff;
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
        }

        @keyframes da-success-pop {
          0% { transform: scale(0.86); opacity: 0; }
          60% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes da-success-circle {
          from { stroke-dashoffset: 160; opacity: 0.65; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes da-success-tick {
          from { stroke-dashoffset: 48; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
