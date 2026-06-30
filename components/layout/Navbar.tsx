"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore, useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Penganalisis", href: "/marketplace/analyzer" },
  { label: "Pasar", href: "/marketplace" },
  { label: "Dasbor Harga", href: "/price-dashboard" },
  { label: "Ketelusuran", href: "/traceability" },
  { label: "Majalah", href: "/magazine" },
  { label: "Dampak", href: "/tracker" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  const dashboardHref = user ? `/dashboard/${user.role}` : "/login";

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-container-high">
      <div className="container-app flex items-center justify-between h-[72px]">
        <Link href="/" className="font-display text-2xl font-bold text-primary tracking-tight">
          ATSIRA
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-on-surface-variant hover:text-primary transition-colors",
                pathname === link.href && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors"
            aria-label="Keranjang belanja"
          >
            <ShoppingBag className="w-5 h-5 text-on-surface" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-clay-earth text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Button href={dashboardHref} variant="primary" size="sm">
              <UserIcon className="w-4 h-4" />
              {user.name.split(" ")[0]}
            </Button>
          ) : (
            <Button href="/login" variant="primary" size="sm">
              Hubungkan Dompet
            </Button>
          )}
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-surface-container-high bg-surface px-margin-mobile py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-on-surface border-b border-surface-container-high/60 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-4">
            <Button href="/cart" variant="ghost" className="flex-1">
              <ShoppingBag className="w-4 h-4" /> Keranjang ({cartCount})
            </Button>
            <Button href={dashboardHref} variant="primary" className="flex-1">
              {user ? user.name.split(" ")[0] : "Masuk"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
