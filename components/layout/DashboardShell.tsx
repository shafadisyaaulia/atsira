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
  petani: [
    { label: "Dasbor", href: "/dashboard/petani", icon: LayoutDashboard },
    { label: "Penganalisis AI", href: "/dashboard/petani#analyzer", icon: Sparkles },
    { label: "Intelijen Harga", href: "/dashboard/petani#price", icon: TrendingUp },
    { label: "Kebun & Suling", href: "/dashboard/petani#farm", icon: Leaf },
  ],
  umkm: [
    { label: "Dasbor", href: "/dashboard/umkm", icon: LayoutDashboard },
    { label: "Sourcing B2B", href: "/dashboard/umkm#sourcing", icon: Package },
    { label: "Produk Saya", href: "/dashboard/umkm#products", icon: Store },
    { label: "Traceability QR", href: "/dashboard/umkm#qr", icon: QrCode },
  ],
  buyer: [
    { label: "Dasbor", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "Lacak Pesanan", href: "/dashboard/buyer#orders", icon: Package },
    { label: "Dompet & Tagihan", href: "/dashboard/buyer#wallet", icon: Wallet },
    { label: "Favorit", href: "/dashboard/buyer#favorites", icon: Heart },
  ],
  peneliti: [
    { label: "Dasbor", href: "/dashboard/peneliti", icon: LayoutDashboard },
    { label: "Antrean Verifikasi", href: "/dashboard/peneliti#queue", icon: FlaskConical },
    { label: "Portal Riset", href: "/dashboard/peneliti#research", icon: BookOpen },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  petani: "Petani & Penyuling",
  umkm: "UMKM Parfum",
  buyer: "Buyer",
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
      <aside className="hidden lg:flex w-64 flex-col bg-surface-container-lowest border-r border-surface-container-high fixed h-screen">
        <div className="p-6 border-b border-surface-container-high">
          <Link href="/" className="font-display text-xl font-bold text-primary">
            ATSIRA
          </Link>
          <p className="text-xs text-outline mt-0.5">{ROLE_LABEL[role]}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isMainDashboardLink = !item.href.includes("#");
            const active = isMainDashboardLink && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-surface-container-high space-y-1">
          <Link href="#settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-high">
            <Settings className="w-4.5 h-4.5" /> Pengaturan
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-error hover:bg-error-container/40"
          >
            <LogOut className="w-4.5 h-4.5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-surface-container-lowest border-b border-surface-container-high px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-primary">
          ATSIRA
        </Link>
        <button onClick={handleLogout} className="text-error text-sm font-medium flex items-center gap-1">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-surface-container-high bg-surface-container-lowest">
          <div>
            <p className="text-sm text-outline">Selamat datang kembali,</p>
            <p className="font-semibold text-on-surface">{user?.name ?? "Pengguna"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-semibold text-on-primary-fixed-variant">
            {(user?.name ?? "U").charAt(0)}
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-surface-container-high flex justify-around py-2">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 text-on-surface-variant px-2 py-1">
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
