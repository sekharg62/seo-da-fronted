import { apiClient } from './apiClient'

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

/** Response of POST /api/public/orders/track — enough to show status and print a bill. */
export type TrackedOrder = {
  orderNo: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  totalPrice: number | string
  paymentMethod: string
  transactionId?: string | null
  userPaymentMethodNumber?: string | null
  orderNotes?: string | null
  customer: { fullName: string; phone?: string | null; email?: string | null; whatsappNumber?: string | null }
  orderItems: {
    id: string
    serviceName: string
    quantity: number
    price: number | string
    service?: { slug?: string | null; imgUrl?: string | null } | null
  }[]
}

/** Throws an Error whose message is the API's (already user-friendly) message. */
export async function trackOrder(orderNo: string, phone: string): Promise<TrackedOrder> {
  try {
    const res = await apiClient.post<TrackedOrder>('/api/public/orders/track', { orderNo: orderNo.trim(), phone })
    return res.data
  } catch (err) {
    const message = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message
    throw new Error(typeof message === 'string' ? message : 'Could not check the order. Please try again.')
  }
}
