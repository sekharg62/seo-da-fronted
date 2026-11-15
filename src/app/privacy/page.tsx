import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { privacyPolicy } from '@/content/legal'
import { siteConfig } from '@/config/siteConfig'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Learn how ${siteConfig.websiteName} collects, uses and protects your personal information when you buy digital subscriptions.`,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPolicyPage() {
  return <LegalPage documents={privacyPolicy} breadcrumbLabel="Privacy Policy" />
}
