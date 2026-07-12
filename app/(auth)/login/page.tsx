"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, Mail, Lock, Eye, EyeOff, ArrowLeft, 
  Sparkles, Sprout, Droplet, FlaskConical, Store 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/components/layout/Navbar"; 
import { useAuthStore } from "@/lib/store";

const T_LOGIN = {
  title: { id: "Masuk ke Aplikasi", en: "Sign In to ATSIRA" },
  sub: { 
    id: "Silakan masukkan email dan kata sandi akun ATSIRA Anda.", 
    en: "Please enter your registered email and password to access the platform." 
  },
  emailLabel: { id: "Alamat Email", en: "Email Address" },
  passLabel: { id: "Kata Sandi", en: "Password" },
  btnSubmit: { id: "Masuk Sekarang", en: "Sign In Now" },
  btnBack: { id: "Kembali ke Beranda", en: "Back to Home" },
  loading: { id: "Memvalidasi akun...", en: "Authenticating..." },
  noAccount: { id: "Belum punya akun?", en: "Don't have an account yet?" },
  registerHere: { id: "Daftar di sini", en: "Sign Up here" },
  demoTitle: { id: "Akses Cepat Demo Juri", en: "Jury Quick Demo Access" },
  demoSub: { 
    id: "Klik ikon peran di bawah untuk simulasi login otomatis tanpa input manual.", 
    en: "Click a role icon below to simulate instant login without manual inputs." 
  }
};

export default function LoginPage() {
  const router = useRouter();
  const lang = useLang();
  const currentLang = (lang ? lang.toLowerCase() : "id") as "id" | "en";
  
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fungsi Inti Autentikasi Bawaan dengan 4 Peran Terpilih
  function processLogin(targetEmail: string) {
    let detectedRole = "buyer"; 
    const lowerEmail = targetEmail.toLowerCase();
    
    if (lowerEmail.includes("@seller.com")) {
      detectedRole = "seller";
    } else if (lowerEmail.includes("@pemasta.com")) {
      detectedRole = "pemasta";
    } else if (lowerEmail.includes("@usk.ac.id") || lowerEmail.includes("@arc.com")) {
      detectedRole = "arc"; 
    } else if (lowerEmail.includes("@buyer.com")) {
      detectedRole = "buyer";
    }

    login({ name: targetEmail.split("@")[0], role: detectedRole } as any);
    
    // Mengarahkan ke rute spesifik berdasarkan role demi kelancaran demo juri
    setTimeout(() => {
      router.push(`/dashboard/${detectedRole}`);
    }, 1000);
  }

  // Handler Kirim Form Manual
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    processLogin(email);
  }

  // Handler Pintu Pintas Demo (Quick Login Selector)
  const handleQuickDemo = (demoEmail: string) => {
    setLoading(true);
    setEmail(demoEmail);
    setPassword("••••••••");
    
    // Beri jeda visual agar efek simulasi ketik otomatis terlihat nyata bagi juri
    setTimeout(() => {
      processLogin(demoEmail);
    }, 600);
  };

  // Konfigurasi 4 Peran Prototipe Juri Pilihan Anda
  const DEMO_ROLES = [
    { name: "Seller", email: "distributor@seller.com", icon: Sprout, color: "hover:border-emerald-500 hover:bg-emerald-50/40 text-emerald-700" },
    { name: "Pemasta", email: "aman@pemasta.com", icon: Droplet, color: "hover:border-teal-500 hover:bg-teal-50/40 text-teal-700" },
    { name: "ARC Lab", email: "syakir@usk.ac.id", icon: FlaskConical, color: "hover:border-amber-500 hover:bg-amber-50/40 text-amber-700" },
    { name: "Buyer", email: "export@buyer.com", icon: Store, color: "hover:border-stone-500 hover:bg-stone-50 text-stone-700" },
  ];

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,_white,_transparent_55%)]" />

      {/* Tombol Kembali */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{T_LOGIN.btnBack[currentLang]}</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-secondary-fixed hover:opacity-90 transition-opacity">
            ATSIRA
          </Link>
          <h1 className="font-display text-headline-md text-white mt-6 mb-2">
            {T_LOGIN.title[currentLang]}
          </h1>
          <p className="text-inverse-on-surface/70 text-sm p-1">
            {T_LOGIN.sub[currentLang]}
          </p>
        </div>

        <Card className="p-6 bg-white shadow-xl rounded-2xl mb-6 space-y-5">
          {/* FORM MANUAL */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {T_LOGIN.emailLabel[currentLang]}
              </label>
              <input
                type="email"
                required
                placeholder="buyer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-sand-gray bg-bone-wash text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> {T_LOGIN.passLabel[currentLang]}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border border-sand-gray bg-bone-wash text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} variant="gold" size="lg" className="w-full mt-2 rounded-xl">
              {loading ? T_LOGIN.loading[currentLang] : T_LOGIN.btnSubmit[currentLang]}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 inline" />}
            </Button>
          </form>

          {/* ── SEPARATOR & PANEL DEBUGS / QUICK DEMO JURI ── */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> {T_LOGIN.demoTitle[currentLang]}
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] text-stone-400 text-center leading-normal">
              {T_LOGIN.demoSub[currentLang]}
            </p>
            
            {/* Grid 4 Tombol Peran Baru (Seller, Pemasta, ARC, Buyer) */}
            <div className="grid grid-cols-4 gap-2">
              {DEMO_ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.name}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickDemo(role.email)}
                    className={`p-2.5 border border-stone-200 rounded-xl flex flex-col items-center gap-1 transition-all group ${role.color} ${
                      loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                    title={role.email}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-bold tracking-tight">{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </Card>

        <p className="text-center text-sm text-inverse-on-surface/60">
          {T_LOGIN.noAccount[currentLang]}{" "}
          <Link href="/register" className="text-secondary-fixed font-semibold hover:underline">
            {T_LOGIN.registerHere[currentLang]}
          </Link>
        </p>
      </div>
    </div>
  );
}