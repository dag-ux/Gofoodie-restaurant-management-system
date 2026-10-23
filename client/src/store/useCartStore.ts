// client/src/store/useCartStore.ts
import { create } from 'zustand';
import type { MenuItem } from '../api/menuApi';

// We extend MenuItem to include a quantity
export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        // If item is already in cart, increase quantity
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      // If item is not in cart, add it with quantity 1
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    });
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Calculate total price
  getTotalPrice: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Calculate total items (for the cart badge)
  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
}));