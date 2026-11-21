import { ArrowLeftIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { isNotFound, useProduct } from '@/api/catalog'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductImage } from '@/components/ProductImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/format'

export default function Product() {
  const { slug } = useParams()
  const { data: product, isPending, error } = useProduct(slug)

  if (isPending) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-2xl uppercase">
          {isNotFound(error) ? 'Product not found' : 'Unable to load the product'}
        </p>
        <Button asChild variant="outline">
          <Link to="/">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to={`/?category=${encodeURIComponent(product.category_slug)}`}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to catalog
        </Link>
      </Button>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductImage src={product.image_url} alt={product.name} />
        <div className="flex flex-col items-start gap-4">
          <Badge variant="secondary" className="uppercase">
            {product.category_slug}
          </Badge>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-muted-foreground">{formatPrice(product.price)}</p>
          <p className="whitespace-pre-line text-muted-foreground">{product.description}</p>
          <AddToCartButton product={product} size="lg" />
          <p className="text-sm text-muted-foreground">
            Digital product — a download link is available right after payment.
          </p>
        </div>
      </div>
    </div>
  )
}
