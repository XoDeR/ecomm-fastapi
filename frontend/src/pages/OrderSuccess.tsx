import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import { useOrder } from '@/api/orders'
import { OrderItems } from '@/components/OrderItems'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart'

// Give the payment webhook this long before sending the user to their account page
const POLL_BUDGET_MS = 60_000

function Message({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold uppercase">{title}</h1>
      {children}
    </div>
  )
}

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = Number(params.get('order_id'))
  const [capped, setCapped] = useState(false)
  const clearCart = useCartStore((s) => s.clear)
  const { data: order, isPending, isError } = useOrder(orderId, !capped)

  // Stop polling after the budget runs out
  useEffect(() => {
    const t = setTimeout(() => setCapped(true), POLL_BUDGET_MS)
    return () => clearTimeout(t)
  }, [])

  // The user came back from Stripe: the purchased items no longer belong in the cart
  const orderLoaded = Boolean(order) && order?.status !== 'failed'
  useEffect(() => {
    if (orderLoaded) clearCart()
  }, [orderLoaded, clearCart])

  if (!Number.isFinite(orderId) || orderId <= 0) {
    return (
      <Message title="Order not found">
        <Button asChild>
          <Link to="/">Back to catalog</Link>
        </Button>
      </Message>
    )
  }

  if (isPending) return <p className="py-16 text-center text-muted-foreground">Loading…</p>
  if (isError || !order) return <Message title="Unable to load the order" />

  if (order.status === 'failed') {
    return (
      <Message title="Payment failed">
        <Button asChild>
          <Link to="/cart">Back to cart</Link>
        </Button>
      </Message>
    )
  }

  if (order.status !== 'delivered') {
    return (
      <Message title={`Order #${order.id}`}>
        {capped ? (
          <p className="text-muted-foreground">
            Your payment is still being processed. Check{' '}
            <Link to="/account" className="font-medium text-foreground underline">
              your orders
            </Link>{' '}
            in a moment.
          </p>
        ) : (
          <p className="animate-pulse text-muted-foreground">
            {order.status === 'pending'
              ? 'Waiting for payment confirmation…'
              : 'Payment received, preparing your files…'}
          </p>
        )}
      </Message>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold uppercase">Thank you!</h1>
      <p className="mb-6 text-muted-foreground">Order #{order.id} is ready. Download your files:</p>
      <OrderItems items={order.items} />
      <Button asChild variant="outline" className="mt-6">
        <Link to="/account">View all orders</Link>
      </Button>
    </div>
  )
}
