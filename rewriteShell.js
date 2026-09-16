const fs = require('fs');

const content = `"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, 
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
  ShoppingBag,
  Languages,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { toggleLang, getLang, subscribeLang } from "@/lib/language";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  // 1. ROLE PETANI - Diarahkan ke halaman seller, dengan label "Petani"
  petani: [
    { label: "Petani Home", href: "/dashboard/seller", icon: LayoutDashboard },
    { label: "AtBot QualitySense (AI)", href: "/dashboard/seller/qualitysense", icon: Sparkles },
    { label: "Minyak Mentah Saya", href: "/dashboard/seller/produk", icon: Store },
    { label: "B2B Sourcing", href: "/dashboard/seller/pengadaan", icon: Package },
    { label: "Pesanan B2B", href: "/dashboard/seller/pesanan", icon: QrCode },
  ],

  // 2. ROLE UMKM / SELLER PANEL
  umkm: [
    { label: "Seller Home", href: "/dashboard/seller", icon: LayoutDashboard },
    { label: "AtBot QualitySense (AI)", href: "/dashboard/seller/qualitysense", icon: Sparkles },
    { label: "My Products", href: "/dashboard/seller/produk", icon: Store },
    { label: "B2B Sourcing", href: "/dashboard/seller/pengadaan", icon: Package },
    { label: "Order Incoming", href: "/dashboard/seller/pesanan", icon: QrCode },
  ],

  // 3. ROLE BUYER / MITRA INDUSTRI
  buyer: [
    { label: "Dasbor Buyer", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "Sourcing Hub", href: "/dashboard/buyer/market", icon: ShoppingBag },
    { label: "Lacak Pesanan", href: "/dashboard/buyer/pesanan", icon: Package },
    { label: "Dompet & Tagihan", href: "/dashboard/buyer/dompet", icon: Wallet },
    { label: "Produk Favorit", href: "/dashboard/buyer/favorite", icon: Heart },
  ],

  // 4. ROLE PENELITI / VERIFIKATOR LAB
  peneliti: [
    { label: "Dasbor Peneliti", href: "/dashboard/peneliti", icon: LayoutDashboard },
    { label: "Antrean Verifikasi", href: "/dashboard/peneliti/verifikasi", icon: FlaskConical },
    { label: "Portal Riset Atsiri", href: "/dashboard/peneliti/riset", icon: BookOpen },
  ],

  // 5. ROLE PEMASTA / DATA LAPANGAN
  pemasta: [
    { label: "Dasbor Pemasta", href: "/dashboard/pemasta", icon: LayoutDashboard },
    { label: "Nilam Story Hub", href: "/dashboard/pemasta?tab=story-hub", icon: BookOpen },
    { label: "Log Harga Pasar", href: "/dashboard/pemasta?tab=harga", icon: TrendingUp },
    { label: "Dokumentasi Kebun", href: "/dashboard/pemasta?tab=kebun", icon: Leaf },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  petani: "Petani & Penyuling",
  umkm: "Seller Panel",
  buyer: "Buyer Panel",
  peneliti: "Peneliti ARC-USK",
  pemasta: "Pemasta Node",
};

export function DashboardShell({ role: roleProp, children }: { role?: UserRole; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  // Auto-detect role from store if not provided via prop
  const role: UserRole = roleProp ?? (user?.role as UserRole) ?? "buyer";
  const navItems = NAV_BY_ROLE[role] ?? [];
  const [lang, setLang] = useState<"ID"|"EN">("ID");
  
  useEffect(() => {
    setLang(getLang() as "ID"|"EN");
    return subscribeLang(() => setLang(getLang() as "ID"|"EN"));
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      
      {/* SIDEBAR DESKTOP (Kiri) */}
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
            const isBaseDashboard = item.href === "/dashboard/seller" || item.href === "/dashboard/petani" || item.href === "/dashboard/buyer" || item.href === "/dashboard/peneliti" || item.href === "/dashboard/pemasta";
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
        <div className="p-4 border-t border-surface-container-high space-y-2 bg-stone-50/50">
          <div className="flex gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm w-full"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === "ID" ? "ID" : "EN"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100/50 hover:border-red-200"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </aside>

      {/* NAVBAR ATAS UNTUK MOBILE SCREEN */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-surface-container-lowest border-b border-surface-container-high px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-black text-emerald-950">
          ATSIRA
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/community" className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-950 text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all">
            <Users className="w-3 h-3 text-emerald-700" /> Connect
          </Link>
          <button onClick={handleLogout} className="text-red-600 text-xs font-bold flex items-center gap-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KONTEN UTAMA DASHBOARD (Kanan) */}
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0 flex flex-col min-h-screen">
        
        {/* HEADER WELCOME */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-surface-container-high bg-surface-container-lowest shrink-0">
          <div>
            <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Welcome back,</p>
            <p className="font-black text-stone-900 text-sm mt-0.5">{user?.name ?? "Users"}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/community" className="group flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-900 px-4 py-2 rounded-full border border-emerald-300 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <Users className="w-4 h-4 text-emerald-700 group-hover:text-emerald-900" />
              <span className="text-[11px] font-black tracking-wide">ATSIRA Connect</span>
            </Link>
            <div className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center font-black text-xs text-emerald-100 uppercase shadow-sm border border-emerald-950">
              {(user?.name ?? "U").charAt(0)}
            </div>
          </div>
        </header>
        
        {/* AREA INJEKSI HALAMAN KONTEN */}
        <main className="flex-1 p-5 lg:p-8 bg-stone-50/40">
          {children}
        </main>
      </div>

      {/* BOTTOM NAVIGATION BAR UNTUK MOBILE SCREEN */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-surface-container-high flex justify-around py-1.5 shadow-lg">
        {navItems.slice(0, 5).map((item) => { 
          const Icon = item.icon;
          const isBaseDashboard = item.href === "/dashboard/seller" || item.href === "/dashboard/buyer" || item.href === "/dashboard/peneliti" || item.href === "/dashboard/pemasta";
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
              <Icon className={cn("w-4 h-4", active ? "text-emerald-700" : "text-stone-400")} />
              <span className="text-[9px] tracking-tight text-center whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
`;

fs.writeFileSync('components/layout/DashboardShell.tsx', content, 'utf8');
