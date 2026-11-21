import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { ApiError, get } from './client'
import type { CategoryOut, ProductOut } from './types'

export interface ProductFilters {
  category?: string
  search?: string
}

function listProducts({ category, search }: ProductFilters) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (search) params.set('search', search)
  const qs = params.toString()
  return get<ProductOut[]>(`/products${qs ? `?${qs}` : ''}`)
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters.category ?? '', filters.search ?? ''],
    queryFn: () => listProducts(filters),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => get<ProductOut>(`/products/${encodeURIComponent(slug!)}`),
    enabled: Boolean(slug),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => get<CategoryOut[]>('/categories'),
    staleTime: 5 * 60_000,
  })
}

export const isNotFound = (err: unknown) => err instanceof ApiError && err.status === 404
