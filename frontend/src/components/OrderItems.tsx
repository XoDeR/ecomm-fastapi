import { DownloadIcon } from 'lucide-react'

import { API_URL } from '@/api/client'
import type { OrderItemOut } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'

/** Items of a delivered order with their download links. */
export function OrderItems({ items }: { items: OrderItemOut[] }) {
  return (
    <ul className="divide-y border-y">
      {items.map((item) => (
        <li key={item.product_id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{item.product_name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(item.price_at_purchase)}</p>
          </div>
          {item.download_token ? (
            <Button asChild size="sm">
              <a href={`${API_URL}/downloads/${item.download_token}`}>
                <DownloadIcon data-icon="inline-start" />
                Download
              </a>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">Link expired</span>
          )}
        </li>
      ))}
    </ul>
  )
}
