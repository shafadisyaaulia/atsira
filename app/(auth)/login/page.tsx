"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sprout, Store, Globe2, Microscope, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const ROLE_CARDS: { role: UserRole; title: string; desc: string; icon: typeof Sprout }[] = [
  {
    role: "petani",
    title: "Petani & Penyuling",
    desc: "Jual minyak nilam, akses Penganalisis AI, dan pantau harga pasar real-time.",
    icon: Sprout,
  },
  {
    role: "umkm",
    title: "UMKM Parfum Lokal",
    desc: "Sumber bahan baku terverifikasi dan jual produk jadi ke konsumen.",
    icon: Store,
  },
  {
    role: "buyer",
    title: "Buyer (Lokal & Internasional)",
    desc: "Beli minyak nilam grosir dengan traceability dan sertifikasi lengkap.",
    icon: Globe2,
  },
  {
    role: "peneliti",
    title: "Peneliti ARC-USK",
    desc: "Verifikasi sampel, akses data riset, dan publikasi ke ATSIRA Magazine.",
    icon: Microscope,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  function handleEnter() {
    if (!selected) return;
    setLoading(true);
    login(selected);
    setTimeout(() => {
      router.push(`/dashboard/${selected}`);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,_white,_transparent_55%)]" />
      <div className="w-full max-w-3xl relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-3xl font-bold text-secondary-fixed">
            ATSIRA
          </Link>
          <h1 className="font-display text-headline-md text-white mt-6 mb-2">Masuk ke Ekosistem</h1>
          <p className="text-inverse-on-surface/70 text-sm">
            Pilih peran Anda untuk melanjutkan ke dasbor masing-masing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {ROLE_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = selected === card.role;
            return (
              <button key={card.role} onClick={() => setSelected(card.role)} className="text-left">
                <Card
                  className={cn(
                    "p-6 h-full transition-all cursor-pointer hover:shadow-elevation-2",
                    isSelected && "ring-2 ring-secondary-fixed border-secondary-fixed"
                  )}
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-md flex items-center justify-center mb-4",
                      isSelected ? "bg-secondary-container" : "bg-primary-fixed"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected ? "text-on-secondary-container" : "text-on-primary-fixed-variant")} />
                  </div>
                  <p className="font-semibold text-on-surface mb-1">{card.title}</p>
                  <p className="text-sm text-on-surface-variant">{card.desc}</p>
                </Card>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleEnter}
          disabled={!selected || loading}
          variant="gold"
          size="lg"
          className="w-full"
        >
          {loading ? "Memuat dasbor..." : "Masuk ke Dasbor"}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </Button>

        <p className="text-center text-sm text-inverse-on-surface/60 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-secondary-fixed font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
        <p className="text-center text-xs text-inverse-on-surface/40 mt-2">
          Mode demo — klik kartu peran untuk langsung mencoba dasbor tanpa registrasi.
        </p>
      </div>
    </div>
  );
}
