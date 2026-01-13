import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  title: string
  priceCents: number
  imageUrl?: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

export function cartItemsCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function cartTotalCents(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const nextQty = Math.max(1, Math.floor(quantity))
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + nextQty }
                : i,
            ),
          })
          return
        }
        set({ items: [...get().items, { ...item, quantity: nextQty }] })
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        const nextQty = Math.max(0, Math.floor(quantity))
        if (nextQty === 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: nextQty } : i,
          ),
        })
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'accreation_cart_v1',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
