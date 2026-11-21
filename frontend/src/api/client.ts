import { useAuthStore } from '@/stores/auth'

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractDetail(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object' || !('detail' in body)) return fallback
  const detail = (body as { detail: unknown }).detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    // FastAPI validation errors: [{ msg, loc, ... }]
    const msgs = detail
      .map((d) => (d as { msg?: string })?.msg)
      .filter((m): m is string => Boolean(m))
    return msgs.join('; ') || fallback
  }
  return fallback
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token
  const headers = new Headers(init.headers)
  if (init.body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (response.status === 401 && token) {
    // The token is expired or invalid - drop the session
    useAuthStore.getState().logout()
  }

  if (!response.ok) {
    let message = response.statusText || `Request failed (${response.status})`
    try {
      message = extractDetail(await response.json(), message)
    } catch {
      // no JSON body - keep the status text
    }
    throw new ApiError(response.status, message)
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const get = <T>(path: string) => request<T>(path, { method: 'GET' })

export const post = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  })
