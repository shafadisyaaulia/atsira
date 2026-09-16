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

// ---- ARC Certification Store ----
export interface ArcRequest {
  id: string; // e.g. "BCH-099"
  nodeName: string;
  region: string;
  status: "Menunggu" | "Dalam Pengujian" | "Terverifikasi" | "Ditolak";
  date: string;
  farmerId: string;
}

interface ArcState {
  queue: ArcRequest[];
  coas: any[];
  addRequest: (req: Omit<ArcRequest, "id" | "status" | "date">) => void;
  updateStatus: (id: string, status: ArcRequest["status"]) => void;
  addCoa: (coa: any) => void;
}

export const useArcStore = create<ArcState>()(
  persist(
    (set, get) => ({
      queue: [
        { id: "BCH-092", nodeName: "Kelompok Suling Jaya", status: "Menunggu", date: "2026-09-12", region: "Aceh Selatan", farmerId: "petani-1" },
        { id: "BCH-071", nodeName: "Koperasi Nilam Babahrot", status: "Dalam Pengujian", date: "2026-09-11", region: "Aceh Barat", farmerId: "petani-2" },
        { id: "BCH-068", nodeName: "Suling Murni Gayo", status: "Terverifikasi", date: "2026-09-10", region: "Gayo", farmerId: "petani-3" },
      ],
      coas: [
        {
          id: "COA-2026-001", batch_id: "BCH-068", product_name: "Minyak Nilam Mentah",
          farmer_name: "Mahmud", region: "Gayo", pa_level: 33.5, acid_number: 3.2,
          density: 0.95, color: "Kuning Muda", viscosity: "Cair", method: "GC-MS",
          confidence_score: 98, grade: "Grade A", notes: "Sesuai standar ekspor SNI",
          issued_by: "ARC-USK", analyzed_at: "2026-09-11",
        }
      ],
      addRequest: (req) => {
        const id = "BCH-" + Math.floor(Math.random() * 900 + 100);
        const date = new Date().toISOString().split("T")[0];
        set({ queue: [{ ...req, id, status: "Menunggu", date }, ...get().queue] });
      },
      updateStatus: (id, status) => {
        set({ queue: get().queue.map(q => q.id === id ? { ...q, status } : q) });
      },
      addCoa: (coa) => {
        set({ 
          coas: [coa, ...get().coas],
          queue: get().queue.map(q => q.id === coa.batch_id ? { ...q, status: "Terverifikasi" } : q) 
        });
      }
    }),
    { name: "atsira-arc" }
  )
);
interface PemastaState {
  marketPrices: any[];
  addMarketPrice: (price: any) => void;
  stories: any[];
  addStory: (story: any) => void;
}

export const usePemastaStore = create<PemastaState>()(
  persist(
    (set, get) => ({
      marketPrices: [
        { id: "PRC-100", date: "2026-09-15", region: "Aceh Jaya", pricePerKg: 1350000, pa: 32, qty: 150 }
      ],
      stories: [
        { id: "STR-1", title: "Panen Raya Nilam", category: "Edukasi", description: "Panen raya bersama kelompok tani...", author: "Pemasta Node", date: "2026-09-14" }
      ],
      addMarketPrice: (price) => set({ marketPrices: [{ ...price, id: "PRC-" + Math.floor(Math.random() * 900 + 100), date: new Date().toISOString().split("T")[0] }, ...get().marketPrices] }),
      addStory: (story) => set({ stories: [{ ...story, id: "STR-" + Math.floor(Math.random() * 900 + 100), date: new Date().toISOString().split("T")[0] }, ...get().stories] }),
    }),
    { name: "atsira-pemasta-store" }
  )
);
