import type { ServiceDto } from '@/services/homeApiService'
import { getServiceIconMeta } from '@/lib/digitalServices'
import Image from 'next/image'
import { optimizedImage } from '@/lib/imageUrl'

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
        <div className="relative mx-auto aspect-square w-full max-h-[80vh] overflow-hidden bg-gray-900">
          <img
            src={optimizedImage(service.imgUrl, 64)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl saturate-150"
          />
          <img
            src={optimizedImage(service.imgUrl, 1000)}
            alt={`${service.name} subscription`}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      )
    }

    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-white dark:bg-[#0f0f0f] aspect-4/3">
        <img
          src={service.imgUrl}
          alt={service.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div
        className={`w-full aspect-square flex items-center justify-center ${meta.bg}`}
      >
        <span className={`text-6xl font-bold ${meta.text}`}>
          {service.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className={`w-full aspect-4/3 flex items-center justify-center rounded-xl ${meta.bg}`}>
      <span className={`text-4xl font-bold ${meta.text}`}>
        {service.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}
