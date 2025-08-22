import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],

      addToCart: (fund) =>
        set((state) => {
          if (state.cart.some((f) => f.schemeCode === fund.schemeCode)) {
            return state; // avoid duplicates
          }
          return { cart: [...state.cart, fund] };
        }),

      removeFromCart: (schemeCode) =>
        set((state) => ({
          cart: state.cart.filter((f) => f.schemeCode !== schemeCode),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "mutual-fund-cart", // key in localStorage
    }
  )
);
