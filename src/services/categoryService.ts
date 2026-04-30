import { apiClient } from './apiClient'

export type CategoryDto = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await apiClient.get<CategoryDto[]>('/api/categories')
  return res.data
}
