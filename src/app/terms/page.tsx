import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { termsAndConditions } from '@/content/legal'
import { siteConfig } from '@/config/siteConfig'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: `Terms for using ${siteConfig.websiteName} and buying digital subscriptions: orders, payment, delivery, shared/personal plans, refunds and more.`,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <LegalPage documents={termsAndConditions} breadcrumbLabel="Terms and Conditions" />
}
