"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Sprout, Store, Globe2, Microscope } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const ROLES: { role: UserRole; label: string; icon: typeof Sprout }[] = [
  { role: "petani", label: "Petani / Penyuling", icon: Sprout },
  { role: "umkm", label: "UMKM Parfum", icon: Store },
  { role: "buyer", label: "Buyer (Lokal/Internasional)", icon: Globe2 },
  { role: "peneliti", label: "Peneliti ARC-USK", icon: Microscope },
];

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [role, setRole] = useState<UserRole>((params.get("role") as UserRole) || "petani");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    login(role, name || undefined);
    setTimeout(() => router.push(`/dashboard/${role}`), 600);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-bold text-primary">
            ATSIRA
          </Link>
          <h1 className="font-display text-headline-md text-primary mt-5 mb-1">Buat Akun Baru</h1>
          <p className="text-sm text-on-surface-variant">Satu akun, pilih peran Anda di ekosistem nilam.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Saya mendaftar sebagai</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.role;
                  return (
                    <button
                      type="button"
                      key={r.role}
                      onClick={() => setRole(r.role)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-md border text-xs font-medium transition-colors",
                        active
                          ? "border-primary bg-primary-fixed text-on-primary-fixed-variant"
                          : "border-sand-gray bg-bone-wash text-on-surface-variant hover:border-outline"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama Anda" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="nama@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" type="password" required placeholder="Minimal 8 karakter" />
            </div>
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" placeholder="Contoh: Banda Aceh" />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Membuat akun..." : "Daftar Sekarang"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
