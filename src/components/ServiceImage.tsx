import type { ServiceDto } from '@/services/homeApiService'
import { getServiceIconMeta } from '@/lib/digitalServices'
import Image from 'next/image'

export type ServiceImageVariant = 'card' | 'detail'

type Props = {
  service: ServiceDto
  variant?: ServiceImageVariant
}

export function ServiceImage({ service, variant = 'card' }: Props) {
  const meta = getServiceIconMeta(service.name)

  if (service.imgUrl) {
    if (variant === 'detail') {
      return (
        <div className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800/80">
          <img
            src={service.imgUrl}
            alt={service.name}
            className="mx-auto max-h-[min(75vh,640px)] w-auto max-w-full object-contain"
          />
        </div>
      )
    }

    return (
      <img
        src={service.imgUrl}
        alt={service.name}
        className="h-60 w-full rounded-xl bg-white object-cover dark:bg-slate-800"
      />
    )
  }

  if (variant === 'detail') {
    return (
      <div
        className={`w-full h-64 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 ${meta.bg}`}
      >
        <span className={`text-6xl font-bold ${meta.text}`}>
          {service.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className={`w-full h-36 flex items-center justify-center rounded-xl ${meta.bg}`}>
      <span className={`text-4xl font-bold ${meta.text}`}>
        {service.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}
