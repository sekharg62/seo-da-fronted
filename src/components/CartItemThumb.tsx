import { getServiceIconMeta } from '@/lib/digitalServices'

type Props = {
  name: string
  imgUrl?: string | null
  /** Tailwind size classes, e.g. "h-14 w-14" */
  className?: string
}

/** Small square product image for cart / order rows, with an initials fallback. */
export function CartItemThumb({ name, imgUrl, className = 'h-14 w-14' }: Props) {
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        loading="lazy"
        className={`${className} shrink-0 rounded-lg border border-slate-200 bg-white object-cover dark:border-slate-700 dark:bg-slate-800`}
      />
    )
  }
  const meta = getServiceIconMeta(name)
  return (
    <div
      aria-hidden
      className={`${className} ${meta.bg} flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700`}
    >
      <span className={`text-sm font-bold ${meta.text}`}>{name.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}
