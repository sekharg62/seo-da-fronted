export type ServicePlanDto = {
  id: string
  serviceId: string
  months: number
  sharedPrice: number | string
  personalPrice: number | string
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function fetchServicePlans(serviceId?: string): Promise<ServicePlanDto[]> {
  try {
    const query = serviceId ? `?serviceId=${encodeURIComponent(serviceId)}` : ''
    const res = await fetch(`${API_BASE_URL}/api/public/service-plans${query}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch service plans: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error("Failed to fetch service plans:", error)
    throw error
  }
}
