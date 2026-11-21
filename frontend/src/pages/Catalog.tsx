import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'

import { useCategories, useProducts } from '@/api/catalog'
import type { ProductOut } from '@/api/types'
import { ProductCard } from '@/components/ProductCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

const SORTS = {
  default: { label: 'By default', compare: null },
  price_asc: { label: 'Price: low to high', compare: (a: ProductOut, b: ProductOut) => a.price - b.price },
  price_desc: { label: 'Price: high to low', compare: (a: ProductOut, b: ProductOut) => b.price - a.price },
  name_asc: { label: 'Name: A-Z', compare: (a: ProductOut, b: ProductOut) => a.name.localeCompare(b.name) },
  name_desc: { label: 'Name: Z-A', compare: (a: ProductOut, b: ProductOut) => b.name.localeCompare(a.name) },
} as const
type SortKey = keyof typeof SORTS

const isSortKey = (v: string | null): v is SortKey => v !== null && v in SORTS

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? undefined
  const search = params.get('search') ?? undefined
  const sortParam = params.get('sort')
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'default'

  const { data: categories } = useCategories()
  const { data, isPending, isError, refetch, isPlaceholderData } = useProducts({ category, search })

  const products = useMemo(() => {
    const compare = SORTS[sort].compare
    return compare && data ? [...data].sort(compare) : data
  }, [data, sort])

  const title = search
    ? `Search results: “${search}”`
    : (categories?.find((c) => c.slug === category)?.name ?? (category ? category : 'All products'))

  const setSort = (value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'default') next.delete('sort')
    else next.set('sort', value)
    setParams(next, { replace: true })
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold uppercase">{title}</h1>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-52" aria-label="Sort products">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORTS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load products</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again.
            <Button variant="outline" size="sm" className="mt-2 w-fit" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      )}

      {products && products.length === 0 && (
        <div className="py-16 text-center">
          <p className="mb-4 text-2xl uppercase">Nothing found</p>
          <Button asChild variant="outline">
            <Link to="/">Browse all products</Link>
          </Button>
        </div>
      )}

      {products && products.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-8 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isPlaceholderData ? 'opacity-60' : ''}`}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
