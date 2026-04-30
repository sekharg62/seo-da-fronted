export type FeedbackDto = {
  id: string
  name: string
  stars: number
  position: string
  profileUrl: string
  description: string
  createdAt: string
  updatedAt: string
}

export type BlogDto = {
  id: string
  title: string
  description: string
  imgUrl: string
  createdAt: string
  updatedAt: string
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function normalizeServiceDto(raw: ServiceDto): ServiceDto {
  const r = raw as ServiceDto & {
    Order?: number
    sortOrder?: number
    SortOrder?: number
    Price?: number | string
  }
  let next: ServiceDto = { ...raw }

  const v: unknown = r.order ?? r.Order ?? r.sortOrder ?? r.SortOrder
  if (v !== undefined && v !== null) {
    if (!(typeof v === 'string' && v.trim() === '')) {
      const n = typeof v === 'number' ? v : Number(v)
      if (Number.isFinite(n)) next = { ...next, order: Math.trunc(n) }
    }
  }

  const p: unknown = r.price ?? r.Price
  if (p !== undefined && p !== null) {
    if (!(typeof p === 'string' && p.trim() === '')) {
      const pn = typeof p === 'number' ? p : Number(p)
      if (Number.isFinite(pn)) next = { ...next, price: pn }
    }
  }

  return next
}

export function sortServicesByOrderField(services: ServiceDto[]): ServiceDto[] {
  return [...services].sort((a, b) => {
    const oa = typeof a.order === 'number' ? a.order : 99999
    const ob = typeof b.order === 'number' ? b.order : 99999
    return oa - ob
  })
}

export async function fetchTrendingServices(): Promise<ServiceDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/trending`);
    if (!res.ok) {
      throw new Error(`Error fetching trending services: ${res.statusText}`);
    }
    const data: ServiceDto[] = await res.json();
    return data.map(normalizeServiceDto);
  } catch (error) {
    console.error("Failed to fetch trending services:", error);
    throw error;
  }
}

export async function fetchServices(all = false): Promise<ServiceDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services`);
    if (!res.ok) {
      throw new Error(`Error fetching services: ${res.statusText}`);
    }
    const data: ServiceDto[] = await res.json();
    return data.map(normalizeServiceDto);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    throw error;
  }
}

export async function fetchServiceDetail(id: string): Promise<ServiceDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services/${id}`);
    if (!res.ok) {
      throw new Error(`Error fetching service detail: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch service detail:", error);
    throw error;
  }
}


export async function fetchFeedbacks(): Promise<FeedbackDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/feedback`);
    if (!res.ok) {
      throw new Error(`Error fetching feedbacks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    throw error;
  }
}

export async function fetchBlogs(): Promise<BlogDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs`);
    if (!res.ok) {
      throw new Error(`Error fetching blogs: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    throw error;
  }
}

export async function fetchBlogById(id: string): Promise<BlogDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
    if (!res.ok) {
      throw new Error(`Error fetching blog: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    throw error;
  }
}
