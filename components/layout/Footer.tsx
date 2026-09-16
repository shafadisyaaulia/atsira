"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { ShieldAlert, X } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Ekosistem",
    links: [
      { label: "Penganalisis AI", href: "/dashboard/seller/qualitysense", requireAuth: true, requireRole: "petani" as const },
      { label: "Rantai Pasok", href: "/traceability" },
      { label: "Pasar", href: "/marketplace" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Ketentuan Layanan", href: "/legal/terms" },
      { label: "Kebijakan Privasi", href: "/legal/privacy" },
      { label: "Kebijakan Cookie", href: "/legal/cookies" },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  petani: "Petani",
  umkm: "UMKM / Seller",
  buyer: "Buyer",
  peneliti: "Peneliti",
  pemasta: "Pemasta",
};

export function Footer() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [roleWarning, setRoleWarning] = useState(false);

  const handleAnalyzerClick = (e: React.MouseEvent, link: (typeof FOOTER_COLUMNS)[number]["links"][number]) => {
    if (!("requireAuth" in link)) return;
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if ("requireRole" in link && user.role !== link.requireRole) {
      setRoleWarning(true);
      setTimeout(() => setRoleWarning(false), 3000);
      return;
    }
    router.push(link.href);
  };

  return (
    <footer className="bg-primary text-inverse-on-surface relative">
      {roleWarning && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg bg-error-container text-on-error-container px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
          <ShieldAlert className="w-6 h-6 text-error" />
          <div className="flex-1">
            <p className="font-semibold">Akses Terbatas</p>
            <p className="text-sm opacity-90">Fitur Penganalisis AI hanya untuk Petani.</p>
          </div>
          <button onClick={() => setRoleWarning(false)} className="p-2 hover:bg-black/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Bagian Grid Atas */}
      <div className="container-app py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <p className="font-display text-4xl font-bold text-secondary-fixed mb-3">ATSIRA</p>
          <p className="text-sm text-inverse-on-surface/70 max-w-xs">
            Ekosistem digital terintegrasi pertama di Indonesia untuk perdagangan minyak nilam Aceh
            yang transparan dan terverifikasi.
          </p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-label-md uppercase tracking-wider text-inverse-on-surface/50 mb-4">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {"requireAuth" in link ? (
                    <button
                      onClick={(e) => handleAnalyzerClick(e, link)}
                      className="text-sm text-inverse-on-surface/85 hover:text-secondary-fixed transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link href={link.href} className="text-sm text-inverse-on-surface/85 hover:text-secondary-fixed transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bagian Bottom Bar dengan Integrasi Logo Pemasta */}
      <div className="border-t border-white/10 py-8">
        <div className="container-app flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-inverse-on-surface/60">
          
          {/* Teks Legal Kemitraan */}
          <div className="space-y-1.5 text-center md:text-left">
            <p>© 2026 ATSIRA Ecosystem. Bekerja sama dengan ARC-USK, Universitas Syiah Kuala.</p>
            <p className="text-inverse-on-surface/40">Ditenagai oleh teknologi NIRS-PLS &amp; verifikasi blockchain.</p>
          </div>

          {/* Badge Logo & Kemitraan Pemasta */}
          <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm hover:border-secondary-fixed/30 hover:bg-white/[0.08] transition-all">
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-secondary-fixed block tracking-wider leading-none mb-1">
                Supported & Co-Developed By
              </span>
              <span className="text-[11px] font-semibold text-white block">
                Kelompok Pemasta Nilam Aceh
              </span>
            </div>
            
            {/* Divider Garis Tipis */}
            <div className="w-px h-7 bg-white/10" />

            {/* Container Logo Pemasta */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-lg p-1 shadow-sm">
              <img 
                src="/images/logo-pemasta.png" 
                alt="Logo Resmi Pemasta Nilam" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}