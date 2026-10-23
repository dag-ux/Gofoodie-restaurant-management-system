import { create } from 'zustand';
import type { MenuItem } from '../api/menuApi';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean; 
  toggleCart: () => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isCartOpen: false, 
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })), 

  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isCartOpen: true, // Automatically open the cart when adding!
        };
      }
      return { 
        cart: [...state.cart, { ...item, quantity: 1 }],
        isCartOpen: true, // Automatically open the cart when adding!
      };
    });
  },
  // ... rest of the functions remain exactly the same
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  clearCart: () => set({ cart: [] }),
  getTotalPrice: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
  getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
}));