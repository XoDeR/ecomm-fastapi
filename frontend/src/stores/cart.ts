import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: number
  slug: string
  name: string
  price: number // cents
  imageUrl: string | null
}

interface CartState {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      // Digital goods are bought once: duplicates are ignored
      add: (item) =>
        set((s) =>
          s.items.some((i) => i.productId === item.productId)
            ? s
            : { items: [...s.items, item] },
        ),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'ecomm-cart' },
  ),
)

export const useCartCount = () => useCartStore((s) => s.items.length)

export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price, 0))

export const useInCart = (productId: number) =>
  useCartStore((s) => s.items.some((i) => i.productId === productId))
