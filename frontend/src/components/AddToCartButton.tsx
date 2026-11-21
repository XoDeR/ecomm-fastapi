import { CheckIcon, ShoppingCartIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import type { ProductOut } from '@/api/types'
import { useCartStore, useInCart } from '@/stores/cart'

interface Props {
  product: ProductOut
  size?: React.ComponentProps<typeof Button>['size']
  className?: string
}

export function AddToCartButton({ product, size, className }: Props) {
  const add = useCartStore((s) => s.add)
  const inCart = useInCart(product.id)

  if (inCart) {
    return (
      <Button variant="secondary" size={size} className={className} disabled>
        <CheckIcon data-icon="inline-start" />
        In cart
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url,
        })
        toast.success('Product added to cart')
      }}
    >
      <ShoppingCartIcon data-icon="inline-start" />
      Add to cart
    </Button>
  )
}
