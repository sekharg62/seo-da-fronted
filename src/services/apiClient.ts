import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

/**
 * Storefront API client — anonymous by design.
 * The storefront has no login, so it must never send an Authorization header:
 * a stale `auth_token` left in localStorage (e.g. from the admin app on the same
 * origin) made public endpoints answer 401, and the old interceptor then
 * redirected to a non-existent /login page (404).
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
