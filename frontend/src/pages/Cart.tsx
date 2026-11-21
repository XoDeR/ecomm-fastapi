import { Trash2Icon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useCheckout } from '@/api/orders'
import { ProductImage } from '@/components/ProductImage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/format'
import { useIsAuthed } from '@/stores/auth'
import { useCartStore, useCartTotal } from '@/stores/cart'

export default function Cart() {
  const items = useCartStore((s) => s.items)
  const remove = useCartStore((s) => s.remove)
  const total = useCartTotal()
  const authed = useIsAuthed()
  const navigate = useNavigate()
  const checkout = useCheckout()

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold uppercase">Your cart is empty</h1>
        <Button asChild>
          <Link to="/">Browse the catalog</Link>
        </Button>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!authed) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    checkout.mutate(
      items.map((i) => i.productId),
      { onError: (err) => toast.error(err.message) },
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase">Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="flex flex-col">
          {items.map((item, idx) => (
            <li key={item.productId}>
              {idx > 0 && <Separator className="my-4" />}
              <div className="flex items-center gap-4">
                <Link to={`/product/${item.slug}`} className="w-20 shrink-0">
                  <ProductImage src={item.imageUrl} alt={item.name} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.slug}`} className="font-semibold hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground">{formatPrice(item.price)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.productId)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span>Total</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2">
            <Button size="lg" onClick={handleCheckout} disabled={checkout.isPending}>
              {checkout.isPending ? 'Redirecting to payment…' : 'Checkout'}
            </Button>
            {!authed && (
              <p className="text-center text-sm text-muted-foreground">
                You will be asked to log in first.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
