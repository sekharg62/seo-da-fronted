import type { Metadata } from 'next'
import { Suspense } from 'react'
import TrackOrderClient from './TrackOrderClient'

// Personal order lookups: keep out of search results.
export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Check your order status and download your bill with your order ID and phone number.',
  robots: { index: false, follow: false },
}

export default function TrackOrderPage() {
  // Suspense: the client reads ?id= from the URL (useSearchParams)
  return (
    <Suspense fallback={<div className="mx-auto min-h-[60vh] w-full max-w-4xl px-4 sm:px-6 py-10" />}>
      <TrackOrderClient />
    </Suspense>
  )
}
