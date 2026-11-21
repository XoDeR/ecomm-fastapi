import { Link } from 'react-router'

import type { ProductOut } from '@/api/types'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductImage } from '@/components/ProductImage'
import { formatPrice } from '@/lib/format'

export function ProductCard({ product }: { product: ProductOut }) {
  return (
    <article className="flex flex-col gap-3">
      <Link to={`/product/${product.slug}`} className="block">
        <ProductImage src={product.image_url} alt={product.name} />
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">
            <Link to={`/product/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h2>
          <p className="mt-1 font-bold text-muted-foreground">{formatPrice(product.price)}</p>
        </div>
        <AddToCartButton product={product} size="sm" className="shrink-0" />
      </div>
    </article>
  )
}
