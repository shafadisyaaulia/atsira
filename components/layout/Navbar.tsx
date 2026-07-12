"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag, Menu, X, User as UserIcon,
  ChevronDown, Globe, LayoutDashboard, Settings, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore, useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

// ── Modul State Bahasa Internal Terintegrasi Event Global + Mesin Otomatis
let _lang: "ID" | "EN" = "ID";
const _listeners: Array<() => void> = [];

// Fungsi toggle yang memancarkan sinyal ke LocalStorage & Memicu Engine Otomatis
function toggleLang() {
  _lang = _lang === "ID" ? "EN" : "ID";
  
  if (typeof window !== "undefined") {
    localStorage.setItem("atsira-lang", _lang);
    
    // 1. PICU ENGINE OTOMATIS: Beri tahu Google Translate tersembunyi untuk beraksi
    const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = _lang === "EN" ? "en" : "id";
      googleCombo.dispatchEvent(new Event('change'));
    }

    // Pancarkan sinyal cadangan agar jika ada komponen custom yang membutuhkan event tahu bahasa telah berubah
    const event = new CustomEvent("atsira-language-changed", { detail: _lang });
    window.dispatchEvent(event);
  }
  
  _listeners.forEach((fn) => fn());
}

export function useLang() {
  const [lang, setLang] = useState<"ID" | "EN">(_lang);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("atsira-lang") as "ID" | "EN";
      if (savedLang && (savedLang === "ID" || savedLang === "EN")) {
        _lang = savedLang;
        setLang(savedLang);
        
        // Pertahankan bahasa pilihan saat halaman di-refresh
        setTimeout(() => {
          const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (googleCombo) {
            googleCombo.value = savedLang === "EN" ? "en" : "id";
            googleCombo.dispatchEvent(new Event('change'));
          }
        }, 800);
      }
    }

    const fn = () => setLang(_lang);
    _listeners.push(fn);

    const handleGlobalChange = (e: Event) => {
      const customEvent = e as CustomEvent<"ID" | "EN">;
      if (customEvent.detail !== _lang) {
        _lang = customEvent.detail;
        fn();
      }
    };

    window.addEventListener("atsira-language-changed", handleGlobalChange);

    return () => { 
      const i = _listeners.indexOf(fn); 
      if (i > -1) _listeners.splice(i, 1); 
      window.removeEventListener("atsira-language-changed", handleGlobalChange);
    };
  }, []);
  
  return lang;
}

// ── Kamus Penerjemahan Navigasi (Tetap dipertahankan untuk redundansi menu)
const T = {
  market:    { ID: "Marketplace",   EN: "Marketplace" },
  trace:     { ID: "NilamTrace",    EN: "NilamTrace" },
  story:     { ID: "NilamStory",    EN: "NilamStory" },
  connect:   { ID: "ATSIRA Connect", EN: "ATSIRA Connect" },
  help:      { ID: "Help Center",   EN: "Help Center" },
  cart:      { ID: "Keranjang",     EN: "Cart" },
  login:     { ID: "Masuk Aplikasi", EN: "Sign In" },
  dashboard: { ID: "Dasbor Saya",   EN: "My Dashboard" },
  profile:   { ID: "Profil Akun",   EN: "Account Profile" },
  logout:    { ID: "Keluar",        EN: "Sign Out" },
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useLang();
  
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  
  const dashboardHref = user ? `/dashboard/${user.role}` : "/login"; 

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-container-high">
      <div className="container-app flex items-center justify-between h-[72px] relative">

        {/* 
          FIX LOGO: 
          1. Menggunakan w-[160px] h-full relative untuk mengunci area ruang logo.
          2. Ditambahkan kelas `notranslate` dan atribut `translate="no"` agar Google Translate membiarkan elemen ini utuh.
          3. Tag img dibuat absolute dengan h-[76px] agar frame gambar melebar maksimal tanpa merusak tinggi navbar.
        */}
        <div className="flex items-center h-full w-[160px] relative justify-start flex-shrink-0 notranslate" translate="no">
          <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 block transition-opacity hover:opacity-90">
            <img 
              src="/images/logo atsira.png" 
              alt="ATSIRA Logo"
              className="h-[76px] w-auto object-contain max-w-none block" 
            />
          </Link>
        </div>

        {/* Navigasi Tengah Desktop */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          <Link
            href="/marketplace"
            className={cn(
              "text-sm font-medium text-on-surface-variant hover:text-primary transition-colors",
              isActive("/marketplace") && "text-primary font-semibold"
            )}
          >
            {T.market[lang]}
          </Link>

          <Link href="/traceability"
            className={cn("text-sm font-medium text-on-surface-variant hover:text-primary transition-colors",
              isActive("/traceability") && "text-primary font-semibold")}>
            {T.trace[lang]}
          </Link>

          <Link href="/magazine"
            className={cn("text-sm font-medium text-on-surface-variant hover:text-primary transition-colors",
              isActive("/magazine") && "text-primary font-semibold")}>
            {T.story[lang]}
          </Link>

          <Link href="/community"
            className={cn("text-sm font-medium text-on-surface-variant hover:text-primary transition-colors",
              isActive("/community") && "text-primary font-semibold")}>
            {T.connect[lang]}
          </Link>

          <Link href="/bantuan"
            className={cn("text-sm font-medium text-on-surface-variant hover:text-primary transition-colors",
              isActive("/bantuan") && "text-primary font-semibold")}>
            {T.help[lang]}
          </Link>
        </nav>

        {/* Navigasi Kanan Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Tombol Ganti Bahasa Global */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50/50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === "ID" ? "🇮🇩 ID" : "🇺🇸 EN"}</span>
          </button>

          {/* Keranjang Belanja */}
          <Link href="/cart"
            className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors"
            aria-label={T.cart[lang]}>
            <ShoppingBag className="w-5 h-5 text-on-surface" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-clay-earth text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Autentikasi Dropdown Dinamis */}
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant transition-all"
              >
                <UserIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-on-surface">{user.name.split(" ")[0]}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-on-surface-variant transition-transform", profileOpen && "rotate-180")} />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-elevation-3 border border-surface-container-high overflow-hidden py-1">
                  <div className="px-4 py-2.5 border-b border-surface-container-high bg-surface-container-low/50">
                    <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">Role: {user.role}</p>
                    <p className="text-sm font-medium text-on-surface truncate">{user.name}</p>
                  </div>

                  <Link href={dashboardHref} onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    {T.dashboard[lang]}
                  </Link>

                  <Link href="/settings" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <Settings className="w-4 h-4 text-on-surface-variant" />
                    {T.profile[lang]}
                  </Link>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      router.push("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-clay-earth hover:bg-red-50 transition-colors border-t border-surface-container-high text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {T.logout[lang]}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button href="/login" variant="primary" size="sm" className="rounded-full px-5">
              {T.login[lang]}
            </Button>
          )}
        </div>

        {/* Hamburger Menu Mobile */}
        <button className="lg:hidden p-2"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Tutup menu" : "Buka menu"}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Navigasi Mobile */}
      {open && (
        <div className="lg:hidden border-t border-surface-container-high bg-surface px-4 py-4 flex flex-col gap-1">
          {[
            { label: T.market[lang], href: "/marketplace" },
            { label: T.trace[lang],  href: "/traceability" },
            { label: T.story[lang],  href: "/magazine" },
            { label: T.connect[lang],href: "/community" },
            { label: T.help[lang],   href: "/bantuan" },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-on-surface border-b border-surface-container-high/60 last:border-0">
              {link.label}
            </Link>
          ))}

          {/* Ganti Bahasa Mobile */}
          <div className="flex gap-3 mt-4">
            <button onClick={() => { toggleLang(); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-amber-300 bg-amber-50/50 text-sm font-bold text-amber-950 flex-1 justify-center shadow-sm">
              <Globe className="w-4 h-4 text-amber-700" /> {lang === "ID" ? "Switch to English (EN)" : "Ganti ke Bhs Indonesia (ID)"}
            </button>
          </div>

          <div className="flex gap-3 mt-2">
            <Button href="/cart" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
              <ShoppingBag className="w-4 h-4" /> {T.cart[lang]} ({cartCount})
            </Button>
            {user ? (
              <Button href={dashboardHref} variant="primary" className="flex-1" onClick={() => setOpen(false)}>
                <LayoutDashboard className="w-4 h-4 mr-1" /> {T.dashboard[lang]}
              </Button>
            ) : (
              <Button href="/login" variant="primary" className="flex-1" onClick={() => setOpen(false)}>
                {T.login[lang]}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}