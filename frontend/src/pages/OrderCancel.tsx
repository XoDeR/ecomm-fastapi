import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export default function OrderCancel() {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-2 text-3xl font-bold uppercase">Payment cancelled</h1>
      <p className="mb-6 text-muted-foreground">Nothing was charged. Your cart is still saved.</p>
      <Button asChild>
        <Link to="/cart">Back to cart</Link>
      </Button>
    </div>
  )
}
