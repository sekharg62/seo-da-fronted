import { apiClient } from './apiClient'

export type PostOrderFormPayload = {
  name: string
  phone: string
  email: string
  paymentMethod: string
  transactionId: string
  price: number | string
  serviceId?: string
  serviceName?: string
}

export type ServiceDto = {
  id: string
  name: string
  description?: string | null
  imgUrl?: string | null
  price: number | string
  isActive: boolean
  categoryId?: string | null
  createdAt: string
  updatedAt: string
  isTrending?: boolean
  order?: number
}

// for post order form
export async function GetServicesList(): Promise<ServiceDto[]> {
  const res = await apiClient.get(`/api/public/services-list`)
  return res.data;
}

// Public — no auth token needed
export async function postOrderForm(payload: PostOrderFormPayload) {
  const res = await apiClient.post(`/api/public/post-order-form`, payload)
  return res.data
}
