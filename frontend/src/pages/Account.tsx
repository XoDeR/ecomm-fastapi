import { Link } from 'react-router'

import { useMyOrders } from '@/api/orders'
import type { OrderOut, OrderStatus } from '@/api/types'
import { OrderItems } from '@/components/OrderItems'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatPrice } from '@/lib/format'
import { useAuthStore } from '@/stores/auth'

const STATUS: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Awaiting payment', variant: 'outline' },
  paid: { label: 'Paid', variant: 'secondary' },
  delivered: { label: 'Delivered', variant: 'default' },
  failed: { label: 'Payment failed', variant: 'destructive' },
}

function OrderCard({ order }: { order: OrderOut }) {
  const status = STATUS[order.status]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-3">
            Order #{order.id}
            <Badge variant={status.variant}>{status.label}</Badge>
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <span className="text-lg font-bold">{formatPrice(order.total)}</span>
      </CardHeader>
      {order.status === 'delivered' && (
        <CardContent>
          <OrderItems items={order.items} />
        </CardContent>
      )}
    </Card>
  )
}

export default function Account() {
  const email = useAuthStore((s) => s.email)
  const { data: orders, isPending, isError } = useMyOrders()

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">My orders</h1>
      {email && <p className="mt-1 mb-8 text-muted-foreground">{email}</p>}

      {isPending && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load your orders</AlertTitle>
          <AlertDescription>Please try again later.</AlertDescription>
        </Alert>
      )}

      {orders?.length === 0 && (
        <div className="py-16 text-center">
          <p className="mb-4 text-2xl uppercase">No orders yet</p>
          <Button asChild>
            <Link to="/">Browse the catalog</Link>
          </Button>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  )
}
