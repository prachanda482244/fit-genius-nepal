// store/cart.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "buy" | "rent";
  rentalPeriod?: number; // in days
}

interface CartState {
  items: CartItem[];
  total: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // Update quantity if item already exists
            const updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );

            const total = updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            );

            return { items: updatedItems, total };
          } else {
            // Add new item with quantity 1
            const newItem = { ...item, quantity: 1 };
            const updatedItems = [...state.items, newItem];

            const total = updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            );

            return { items: updatedItems, total };
          }
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);
          const total = updatedItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );

          return { items: updatedItems, total };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

          const total = updatedItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );

          return { items: updatedItems, total };
        });
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      getCartTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
