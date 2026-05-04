import { apiClient } from './apiClient'

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

export type OrderItemCredentialDto = {
  id: string
  orderItemId: string
  slot: number
  accountEmail?: string | null
  accountPassword?: string | null
  startDate?: string | null
  expireDate?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export type OrderItemDto = {
  id: string
  orderId: string
  serviceId?: string | null
  serviceName: string
  mainAcId?: string | null
  mainAc?: { id: string; email: string } | null
  quantity: number
  price: number | string
  createdAt: string
  updatedAt: string
  service?: { id: string; name: string; price: number | string } | null
  credentials: OrderItemCredentialDto[]
}

export type OrderDto = {
  id: string
  orderNo: string
  customerId: string
  order_source?: 'ADMIN_CREATE' | 'WEBSITE' | 'POST_FORM' | string | null
  totalPrice: number | string
  paymentMethod: string
  transactionId?: string | null
  orderNotes?: string | null
  status: OrderStatus
  createdAt: string
  updatedAt: string
  issueStatus?: string | null
  issueNotes?: string | null
  customer: {
    id: string
    fullName: string
    email?: string | null
    phone?: string | null
    whatsappNumber?: string | null
    address?: string | null
    notes?: string | null
  }
  orderItems: OrderItemDto[]
}

export type CreateOrderPayload = {
  customer: {
    fullName: string
    email?: string
    phone?: string
    whatsappNumber?: string
    address?: string
  }
  items: Array<{
    serviceId: string
    serviceName: string
    quantity: number
    price: number
  }>
  totalPrice: number
  paymentMethod: string
  transactionId?: string
  orderNotes?: string
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderDto> {
  const res = await apiClient.post<OrderDto>('/api/public/orders', payload)
  return res.data
}
