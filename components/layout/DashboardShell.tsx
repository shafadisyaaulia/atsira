"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Store,
  TrendingUp,
  QrCode,
  Settings,
  LogOut,
  FlaskConical,
  BookOpen,
  Package,
  Wallet,
  Heart,
  Leaf,
  ShoppingBag, // Kita tambahkan ikon tas belanja untuk Sourcing Hub
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  // 1. ROLE PETANI
  petani: [
    { label: "Dasbor Utama", href: "/dashboard/petani", icon: LayoutDashboard },
    { label: "Penganalisis AI", href: "/dashboard/petani/analyzer", icon: Sparkles },
    { label: "Intelijen Harga", href: "/dashboard/petani/harga", icon: TrendingUp },
    { label: "Kebun & Suling", href: "/dashboard/petani/kebun", icon: Leaf },
  ],
  
  // 2. ROLE UMKM / SELLER PANEL
  umkm: [
    { label: "Seller Home", href: "/dashboard/seller", icon: LayoutDashboard },
    { label: "AtBot QualitySense (AI)", href: "/dashboard/seller/qualitysense", icon: Sparkles },
    { label: "My Products", href: "/dashboard/seller/produk", icon: Store },
    { label: "B2B Sourcing", href: "/dashboard/seller/pengadaan", icon: Package },
    { label: "Order Incoming", href: "/dashboard/seller/pesanan", icon: QrCode },
  ],
  
  // 3. ROLE BUYER / MITRA INDUSTRI (Disesuaikan dengan menu Sourcing Hub Baru)[cite: 2]
  buyer: [
    { label: "Dasbor Buyer", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "Sourcing Hub", href: "/dashboard/buyer/market", icon: ShoppingBag }, // <-- SINKRONISASI DI SINI
    { label: "Lacak Pesanan", href: "/dashboard/buyer/pesanan", icon: Package },
    { label: "Dompet & Tagihan", href: "/dashboard/buyer/dompet", icon: Wallet },
    { label: "Produk Favorit", href: "/dashboard/buyer/favorit", icon: Heart },
  ],
  
  // 4. ROLE PENELITI / VERIFIKATOR LAB[cite: 2]
  peneliti: [
    { label: "Dasbor Peneliti", href: "/dashboard/peneliti", icon: LayoutDashboard },
    { label: "Antrean Verifikasi", href: "/dashboard/peneliti/verifikasi", icon: FlaskConical },
    { label: "Portal Riset Atsiri", href: "/dashboard/peneliti/riset", icon: BookOpen },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  petani: "Petani & Penyuling",
  umkm: "Seller Panel",
  buyer: "Buyer Panel",
  peneliti: "Peneliti ARC-USK",
};

export function DashboardShell({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navItems = NAV_BY_ROLE[role];

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      
      {/* ─── SIDEBAR DESKTOP (Kiri) ─── */}
      <aside className="hidden lg:flex w-64 flex-col bg-surface-container-lowest border-r border-surface-container-high fixed h-screen z-50">
        
        {/* LOGO & INDIKATOR PANEL */}
        <div className="p-6 border-b border-surface-container-high">
          <Link href="/" className="font-display text-xl font-black text-emerald-950 tracking-tight">
            ATSIRA
          </Link>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">
            {ROLE_LABEL[role]}
          </p>
        </div>
        
        {/* MENU DINAMIS BERDASARKAN ROLE */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            // Logika Deteksi Menu Aktif yang Presisi
            const isBaseDashboard = item.href === `/dashboard/${role}`;
            const active = isBaseDashboard
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                  active
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-emerald-400" : "text-stone-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* MENU BAWAH SIDEBAR */}
        <div className="p-4 border-t border-surface-container-high space-y-1 bg-stone-50/50">
          <Link 
            href="#settings" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <Settings className="w-4 h-4 text-stone-400" /> Arrangement
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-red-600 hover:bg-red-50 text-left transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Go out
          </button>
        </div>
      </aside>

      {/* ─── NAVBAR ATAS UNTUK MOBILE SCREEN ─── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-surface-container-lowest border-b border-surface-container-high px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-black text-emerald-950">
          ATSIRA
        </Link>
        <button onClick={handleLogout} className="text-red-600 text-xs font-bold flex items-center gap-1">
          <LogOut className="w-4 h-4" /> Go out
        </button>
      </div>

      {/* ─── KONTEN UTAMA DASHBOARD (Kanan) ─── */}
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0 flex flex-col min-h-screen">
        
        {/* HEADER WELCOME */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-surface-container-high bg-surface-container-lowest shrink-0">
          <div>
            <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Welcome back,</p>
            <p className="font-black text-stone-900 text-sm mt-0.5">{user?.name ?? "Users"}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center font-black text-xs text-emerald-100 uppercase shadow-sm border border-emerald-950">
            {(user?.name ?? "U").charAt(0)}
          </div>
        </header>
        
        {/* AREA INJEKSI HALAMAN KONTEN */}
        <main className="flex-1 p-5 lg:p-8 bg-stone-50/40">
          {children}
        </main>
      </div>

      {/* ─── BOTTOM NAVIGATION BAR UNTUK MOBILE SCREEN ─── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-surface-container-high flex justify-around py-1.5 shadow-lg">
        {navItems.slice(0, 5).map((item) => { 
          const Icon = item.icon;
          const isBaseDashboard = item.href === `/dashboard/${role}`;
          const active = isBaseDashboard
            ? pathname === item.href
            : pathname.startsWith(item.href);
            
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 transition-all rounded-md",
                active ? "text-stone-900 font-extrabold scale-105" : "text-stone-400"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5", active ? "text-emerald-700" : "text-stone-400")} />
              <span className="text-[9px] tracking-tight text-center whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}