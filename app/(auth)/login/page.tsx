"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, Mail, Lock, Eye, EyeOff, ArrowLeft, 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/components/layout/Navbar"; 
import { useAuthStore } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const T_LOGIN = {
  title: { id: "Masuk ke Aplikasi", en: "Sign In to atSira" },
  sub: { 
    id: "Silakan masukkan email dan kata sandi akun atSira Anda.", 
    en: "Please enter your registered email and password to access the platform." 
  },
  emailLabel: { id: "Alamat Email", en: "Email Address" },
  emailPlaceholder: { id: "tulis email anda", en: "enter your email" },
  passLabel: { id: "Kata Sandi", en: "Password" },
  btnSubmit: { id: "Masuk Sekarang", en: "Sign In Now" },
  btnBack: { id: "Kembali ke Beranda", en: "Back to Home" },
  loading: { id: "Memvalidasi akun...", en: "Authenticating..." },
  noAccount: { id: "Belum punya akun?", en: "Don't have an account yet?" },
  registerHere: { id: "Daftar di sini", en: "Sign Up here" },
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
  const [errorMessage, setErrorMessage] = useState("");

  async function processLogin(targetEmail: string, targetPassword: string) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: targetEmail, password: targetPassword });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // Ambil role asli dari tabel profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    // Role asli dari DB
    const rawRole = profile?.role || "buyer";
    
    // Normalisasi role DB yang mungkin berbeda dengan sistem atSira
    const ROLE_MAP: Record<string, string> = {
      "seller": "umkm",     // Role lama "seller" → umkm
      "farmer": "petani",   // Alias lainnya
    };
    const dbRole = ROLE_MAP[rawRole] ?? rawRole;
    
    // URL redirect berdasarkan role
    let redirectPath: string;
    if (dbRole === "petani" || dbRole === "umkm") {
      redirectPath = "/dashboard/seller";
    } else if (dbRole === "peneliti" || dbRole === "arc") {
      redirectPath = "/dashboard/arc";
    } else {
      redirectPath = `/dashboard/${dbRole}`;
    }
    
    const userName =
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.name ||
      targetEmail.split("@")[0];

    // Simpan role ke store (sudah dinormalisasi)
    login(dbRole as any, userName, {
      id: data.user.id,
      email: data.user.email || targetEmail,
    });

    setTimeout(() => {
      router.push(redirectPath);
    }, 600);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMessage("");
    setLoading(true);
    processLogin(email, password);
  }

  // Handler Pintu Pintas Demo (Quick Login Selector)
  // Handler dihapus

  // Konfigurasi 4 Peran Prototipe Juri Pilihan Anda
  // Konfigurasi dihapus

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
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src="/images/logo-atsira.png" alt="atSira Logo" className="h-12 mx-auto mb-2 brightness-0 invert object-contain" />
          </Link>
          <h1 className="font-display text-headline-md text-white mt-4 mb-2">
            {T_LOGIN.title[currentLang]}
          </h1>
          <p className="text-inverse-on-surface/70 text-sm p-1">
            {T_LOGIN.sub[currentLang]}
          </p>
        </div>

        <Card className="p-6 bg-white shadow-xl rounded-2xl mb-6 space-y-5">
          {/* FORM MANUAL */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{errorMessage}</div>
            ) : null}
            <div>
              <label className="inline-flex items-center gap-1 text-xs font-semibold text-outline uppercase mb-1.5">
                <Mail className="w-3.5 h-3.5" /> {T_LOGIN.emailLabel[currentLang]}
              </label>
              <input
                type="email"
                required
                placeholder={T_LOGIN.emailPlaceholder[currentLang]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-sand-gray bg-bone-wash text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-1 text-xs font-semibold text-outline uppercase mb-1.5">
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