import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/siteConfig'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.websiteName} — Premium Digital Subscriptions`,
    short_name: siteConfig.websiteName,
    description: 'Premium digital subscriptions in Bangladesh. Pay with bKash, Nagad or Rocket.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#10b981',
    lang: 'bn',
    icons: [
      { src: '/Blue.png', sizes: 'any', type: 'image/png' },
    ],
  }
}
