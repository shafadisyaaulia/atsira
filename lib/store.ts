"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/types";

interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthState {
  user: SessionUser | null;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
}

const ROLE_PROFILES: Record<UserRole, SessionUser> = {
  petani: { id: "farmer-syukur-gayo", name: "Pak Syukur", role: "petani", email: "syukur@atsira.id" },
  umkm: { id: "umkm-seulawah", name: "Cut Maharani", role: "umkm", email: "maharani@seulawah.id" },
  buyer: { id: "buyer-budi", name: "Budi Santoso", role: "buyer", email: "budi@example.com" },
  peneliti: { id: "peneliti-arc", name: "Dr. Syarifullah", role: "peneliti", email: "syarifullah@arc-usk.ac.id" },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (role) => set({ user: ROLE_PROFILES[role] }),
      logout: () => set({ user: null }),
    }),
    { name: "atsira-session" }
  )
);

// ---- Cart store ----
export interface CartItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  unit: string;
  qty: number;
  category: "raw-oil" | "finished-product";
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQty: (productId, qty) =>
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "atsira-cart" }
  )
);
