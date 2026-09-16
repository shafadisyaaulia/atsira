const fs = require('fs');

const content = `"use client";

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
  login: (role: UserRole, name?: string, overrides?: Partial<SessionUser>) => void;
  logout: () => void;
}

const ROLE_PROFILES: Record<UserRole, { role: UserRole }> = {
  petani: { role: "petani" },
  umkm: { role: "umkm" },
  buyer: { role: "buyer" },
  peneliti: { role: "peneliti" },
  pemasta: { role: "pemasta" },
};

const VALID_ROLES = ["petani", "umkm", "buyer", "peneliti", "pemasta"];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (role, name, overrides = {}) =>
        set({
          user: {
            id: overrides.id || "00000000-0000-0000-0000-000000000000",
            name: name || overrides.name || "User",
            role,
            email: overrides.email || "user@atsira.id",
          },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "atsira-session",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          const role = persistedState?.user?.role;
          if (role && !VALID_ROLES.includes(role)) {
            return { user: null };
          }
        }
        return persistedState as AuthState;
      },
    }
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
`;

const rest = fs.readFileSync('lib/store.ts', 'utf8');
// Grab from line 64 onward (ARC store and Pemasta store)
const arcStart = rest.indexOf('// ---- ARC Certification Store ----');
const arcPart = arcStart !== -1 ? rest.substring(arcStart) : '';

fs.writeFileSync('lib/store.ts', content + '\n' + arcPart, 'utf8');
