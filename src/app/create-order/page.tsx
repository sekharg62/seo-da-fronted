import type { Metadata } from 'next'
import { OrderForm } from '@/components/OrderForm'

// Customer form (already-paid orders): keep it out of search results.
export const metadata: Metadata = {
  title: 'Create Order',
  description: 'Already paid? Submit your payment and service details so we can process your order quickly.',
  robots: { index: false, follow: false },
}

export default function CreateOrderPage() {
  return <OrderForm />
}
