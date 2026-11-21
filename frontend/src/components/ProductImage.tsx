import { PackageIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Props {
  src: string | null
  alt: string
  className?: string
}

/** Square product image with a neutral placeholder when the product has no image. */
export function ProductImage({ src, alt, className }: Props) {
  return (
    <div
      className={cn(
        'flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-t from-neutral-100 to-neutral-200',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
      ) : (
        <PackageIcon className="size-1/4 text-neutral-400" aria-hidden />
      )}
    </div>
  )
}
