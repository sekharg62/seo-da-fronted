export function ErrorPage({ title, message, hint, onRetry }: { title: string; message: string; hint?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm dark:border-rose-500/25 dark:bg-rose-500/10">
      <div className="mb-4 flex items-center gap-4">
        <div
          className="da-error-mark relative grid h-16 w-16 place-items-center rounded-full bg-rose-600 text-white shadow-sm ring-1 ring-rose-700/20 dark:bg-rose-500 dark:ring-rose-300/15"
          aria-hidden
        >
          <svg viewBox="0 0 52 52" className="h-10 w-10" fill="none">
            <circle className="da-error-mark__circle" cx="26" cy="26" r="24" />
            <path className="da-error-mark__x" d="M17 17 L35 35 M35 17 L17 35" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-200">{title}</h2>
      </div>

      <p className="mt-1 text-sm text-rose-800/80 dark:text-rose-200/80">{message}</p>
      {hint ? (
        <p className="mt-4 text-xs text-rose-800/70 dark:text-rose-200/70">{hint}</p>
      ) : null}

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Try again
        </button>
      ) : null}

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .da-error-mark {
            animation: da-error-pop 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .da-error-mark__circle {
            animation: da-error-circle 620ms ease-out both;
          }
          .da-error-mark__x {
            animation: da-error-x 520ms 140ms ease-out both;
          }
        }

        .da-error-mark__circle {
          stroke: rgba(255, 255, 255, 0.35);
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
        }

        .da-error-mark__x {
          stroke: #ffffff;
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
        }

        @keyframes da-error-pop {
          0% { transform: scale(0.86); opacity: 0; }
          60% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes da-error-circle {
          from { stroke-dashoffset: 160; opacity: 0.65; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes da-error-x {
          from { stroke-dashoffset: 80; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
