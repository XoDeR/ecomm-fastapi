import { useMutation, useQuery } from '@tanstack/react-query'

import { get, post } from './client'
import type { OrderCreateOut, OrderOut } from './types'

import { useAuthStore } from '@/stores/auth'

export const createOrder = (productIds: number[]) =>
  post<OrderCreateOut>('/orders', { product_ids: productIds })

export function useCheckout() {
  return useMutation({
    mutationFn: createOrder,
    // The user leaves for Stripe Checkout; the cart is cleared once they return successfully
    onSuccess: (data) => window.location.assign(data.checkout_url),
  })
}

export function useMyOrders() {
  const authed = useAuthStore((s) => s.token !== null)
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => get<OrderOut[]>('/orders'),
    enabled: authed,
  })
}

const POLL_MS = 2000

/** Fetches one order; polls while the payment webhook is still being processed. */
export function useOrder(orderId: number, poll: boolean) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => get<OrderOut>(`/orders/${orderId}`),
    enabled: Number.isFinite(orderId) && orderId > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (!poll || status === 'delivered' || status === 'failed') return false
      return POLL_MS
    },
  })
}
