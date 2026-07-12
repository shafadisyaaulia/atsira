"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ShoppingCart, Store, ArrowRight, User, Mail, Lock, MapPin, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store";
import { useLang } from "@/components/layout/Navbar"; 
import { cn } from "@/lib/utils/cn";

const T_REG = {
  title: { id: "Buat Akun Baru", en: "Create New Account" },
  sub: { 
    id: "Bergabunglah ke dalam ekosistem minyak nilam ATSIRA.", 
    en: "Join the premier ATSIRA patchouli oil trade & analysis ecosystem." 
  },
  roleLabel: { id: "Saya mendaftar sebagai:", en: "I am registering as:" },
  roleSeller: { id: "Seller (Petani / UMKM)", en: "Seller (Farmer / MSME)" },
  roleBuyer: { id: "Buyer (Lokal / Ekspor)", en: "International / Local Buyer" },
  nameLabel: { id: "Nama Lengkap", en: "Full Name / Company Name" },
  namePlaceholder: { id: "Masukkan nama Anda", en: "Enter your full or enterprise name" },
  emailLabel: { id: "Alamat Email", en: "Email Address" },
  passLabel: { id: "Kata Sandi", en: "Password" },
  passPlaceholder: { id: "Minimal 8 karakter", en: "Minimum 8 characters" },
  locLabel: { id: "Lokasi / Negara", en: "Location / Country" },
  locPlaceholder: { id: "Contoh: Banda Aceh / France", en: "e.g., Paris, France" },
  btnSubmit: { id: "Daftar Sekarang", en: "Register Now" },
  btnBack: { id: "Kembali ke Beranda", en: "Back to Home" },
  loading: { id: "Membuat akun...", en: "Creating account..." },
  haveAccount: { id: "Sudah punya akun?", en: "Already have an account?" },
  loginHere: { id: "Masuk di sini", en: "Sign In here" }
};

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const lang = useLang();
  const currentLang = lang.toLowerCase() as "id" | "en";
  
  const login = useAuthStore((s) => s.login);

  const paramRole = params.get("role");
  const initialRole = paramRole === "petani" || paramRole === "seller" ? "petani" : "buyer";

  const [role, setRole] = useState<"petani" | "buyer">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    login({ name: name, role: role } as any);
    
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_80%_20%,_white,_transparent_55%)]" />

      {/* Tombol Kembali (Bilingual) */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{T_REG.btnBack[currentLang]}</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-secondary-fixed">
            ATSIRA
          </Link>
          <h1 className="font-display text-headline-md text-white mt-6 mb-2">
            {T_REG.title[currentLang]}
          </h1>
          <p className="text-inverse-on-surface/70 text-sm">
            {T_REG.sub[currentLang]}
          </p>
        </div>

        <Card className="p-6 bg-white shadow-xl rounded-2xl mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-outline uppercase mb-2">
                {T_REG.roleLabel[currentLang]}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("petani")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-center transition-all",
                    role === "petani"
                      ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-semibold"
                      : "border-sand-gray bg-bone-wash text-on-surface-variant hover:border-outline"
                  )}
                >
                  <Store className={cn("w-5 h-5", role === "petani" ? "text-primary" : "text-outline")} />
                  <span className="text-xs leading-tight">{T_REG.roleSeller[currentLang]}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-center transition-all",
                    role === "buyer"
                      ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-semibold"
                      : "border-sand-gray bg-bone-wash text-on-surface-variant hover:border-outline"
                  )}
                >
                  <ShoppingCart className={cn("w-5 h-5", role === "buyer" ? "text-primary" : "text-outline")} />
                  <span className="text-xs leading-tight">{T_REG.roleBuyer[currentLang]}</span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {T_REG.nameLabel[currentLang]}
              </Label>
              <Input 
                id="name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder={T_REG.namePlaceholder[currentLang]}
                className="rounded-xl border-sand-gray bg-bone-wash text-sm"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {T_REG.emailLabel[currentLang]}
              </Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@enterprise.com" 
                className="rounded-xl border-sand-gray bg-bone-wash text-sm"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> {T_REG.passLabel[currentLang]}
              </Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={T_REG.passPlaceholder[currentLang]} 
                className="rounded-xl border-sand-gray bg-bone-wash text-sm"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {T_REG.locLabel[currentLang]}
              </Label>
              <Input 
                id="location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={T_REG.locPlaceholder[currentLang]} 
                className="rounded-xl border-sand-gray bg-bone-wash text-sm"
              />
            </div>

            <Button type="submit" disabled={loading} variant="gold" className="w-full mt-3 rounded-xl" size="lg">
              {loading ? T_REG.loading[currentLang] : T_REG.btnSubmit[currentLang]}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 inline" />}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-inverse-on-surface/60">
          {T_REG.haveAccount[currentLang]}{" "}
          <Link href="/login" className="text-secondary-fixed font-semibold hover:underline">
            {T_REG.loginHere[currentLang]}
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