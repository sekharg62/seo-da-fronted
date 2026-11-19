import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { disclaimer } from '@/content/legal'
import { siteConfig } from '@/config/siteConfig'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `${siteConfig.websiteName} is an independent digital service provider and is not affiliated with any of the brands mentioned. All trademarks belong to their respective owners.`,
  alternates: { canonical: '/disclaimer' },
}

export default function DisclaimerPage() {
  return <LegalPage documents={disclaimer} breadcrumbLabel="Disclaimer" />
}
