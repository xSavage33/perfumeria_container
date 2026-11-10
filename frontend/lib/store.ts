import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, Cart, Product } from './api';

function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

interface CartStore {
  sessionId: string;
  cart: Cart;
  isLoading: boolean;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      cart: { items: [], subtotal: 0, itemCount: 0 },
      isLoading: false,
      isCartOpen: false,

      setCartOpen: (open) => set({ isCartOpen: open }),

      fetchCart: async () => {
        const { sessionId } = get();
        set({ isLoading: true });
        try {
          const cart = await api.getCart(sessionId);
          set({ cart, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addToCart: async (product, quantity = 1) => {
        const { sessionId } = get();
        set({ isLoading: true });
        try {
          const price = product.discountPrice || product.price;
          const cart = await api.addToCart(sessionId, product.id, Number(price), quantity);
          set({ cart, isLoading: false, isCartOpen: true });
        } catch {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { sessionId } = get();
        set({ isLoading: true });
        try {
          const cart = await api.updateCartItem(sessionId, productId, quantity);
          set({ cart, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId) => {
        const { sessionId } = get();
        set({ isLoading: true });
        try {
          const cart = await api.removeFromCart(sessionId, productId);
          set({ cart, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        const { sessionId } = get();
        set({ isLoading: true });
        try {
          const cart = await api.clearCart(sessionId);
          set({ cart, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'elcontainer-cart',
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);
