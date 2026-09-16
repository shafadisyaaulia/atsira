"use client";

import Link from "next/link";
import { ArrowRight, Leaf, FlaskConical, Sparkles, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card, SectionEyebrow, Badge } from "@/components/ui/Card";
import { IMPACT_METRICS } from "@/lib/mock";
import HeroSection from "@/components/shared/HeroSection";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

// 1. Hubungkan hook bahasa langsung dari Navbar Anda
import { useLang } from "@/components/layout/Navbar";

// 2. Kamus Translasi Lokal untuk Semua Komponen di HomePage
const T_HOME = {
  // Bagian Showcase AI
  aiEyebrow: { ID: "Teknologi Presisi", EN: "Precision Technology" },
  aiTitle: { ID: "Verifikasi Kemurnian Berbasis AI", EN: "AI-Powered Purity Verification" },
  aiDesc: {
    ID: "Menggunakan model pembelajaran mesin canggih yang dilatih oleh peneliti di ARC-USK, Penganalisis Nilam memastikan setiap tetes minyak memenuhi standar kemewahan internasional sebelum mencapai pasar.",
    EN: "Utilizing advanced machine learning models trained by researchers at ARC-USK, the Patchouli Analyzer ensures every single drop of oil meets international luxury standards before reaching the market."
  },
  aiFeatures: [
    { ID: "Analisis Komposisi Kimia Instan", EN: "Instant Chemical Composition Analysis" },
    { ID: "Autentikasi Batch Blockchain", EN: "Blockchain Batch Authentication" },
    { ID: "Penilaian Kualitas Waktu Nyata", EN: "Real-Time Quality Assessment" }
  ],
  aiCardTitle: { ID: "Penganalisis Nilam v2.4", EN: "Patchouli Analyzer v2.4" },
  aiPurity: { ID: "Tingkat Kemurnian", EN: "Purity Level" },
  aiAuthentic: { ID: "Bandingkan Otentik", EN: "Authenticity Ratio" },
  aiProfile: { ID: "Profil Terpilih", EN: "Selected Profile" },
  aiCode: { ID: "Kode Lokasi", EN: "Location Code" },
  aiBtnScan: { ID: "Mulai Pindai", EN: "Start Scan" },
  aiBtnTry: { ID: "Coba Penganalisis Sekarang", EN: "Try Analyzer Now" },

  // Bagian Metrik Pasar
  marketTitle: { ID: "Wawasan Pasar Global", EN: "Global Market Insights" },
  marketDesc: {
    ID: "Evaluasi waktu nyata Nilam Aceh terhadap indeks internasional.",
    EN: "Real-time evaluation of Aceh Patchouli against international indices."
  },

  // Bagian Testimoni / Akar Kami
  rootsEyebrow: { ID: "Akar Kami", EN: "Our Roots" },
  rootsTitle: { ID: "Berakar Secara Berkelanjutan. Terverifikasi Secara Digital.", EN: "Sustainably Rooted. Digitally Verified." },
  rootsDesc: {
    ID: "ATSIRA dibangun dalam kemitraan mendalam dengan Atsiri Research Center (ARC) di Universitas Syiah Kuala. Bersama-sama, kami telah merevitalisasi ekonomi nilam di Aceh, memastikan petani menerima harga yang adil sementara dunia menerima minyak semurni mungkin.",
    EN: "ATSIRA is built in deep partnership with the Atsiri Research Center (ARC) at Syiah Kuala University. Together, we have revitalized the patchouli economy in Aceh, ensuring farmers receive fair prices while the world receives the purest oil possible."
  },
  rootsStat1: { ID: "Mata Pencaharian Didukung", EN: "Livelihoods Supported" },
  rootsStat2: { ID: "Peningkatan Pendapatan bagi Petani", EN: "Income Increase for Farmers" },
  rootsReport: { ID: "Baca Laporan Dampak 2026 →", EN: "Read the 2026 Impact Report →" },
  rootsQuote: {
    ID: "“Kami tidak hanya menjual minyak; kami melindungi warisan yang hampir hilang.”",
    EN: "“We don't just sell oil; we protect a heritage that was almost lost.”"
  },

  // Bagian CTA bawah
  ctaTitle: { ID: "Bergabunglah dalam Renaisans Wewangian", EN: "Join the Fragrance Renaissance" },
  ctaDesc: {
    ID: "Apakah Anda seorang petani Aceh, operator distilasi, atau merek wewangian global, ATSIRA menyediakan alat untuk tumbuh bersama.",
    EN: "Whether you are an Aceh farmer, distillation operator, or a global fragrance brand, ATSIRA provides the tools to grow together."
  },
  ctaBtnFarmer: { ID: "Gabung sebagai Petani", EN: "Join as Farmer" },
  ctaBtnPartner: { ID: "Gabung sebagai Mitra", EN: "Join as Partner" }
};

export default function HomePage() {
  // 3. Ambil nilai state bahasa aktif saat ini ("ID" atau "EN")
  const lang = useLang();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/pemasta/field-stories")
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setStories(json.data.map((s: any) => ({
            id: s.slug,
            title: s.title,
            category: s.category,
            description: s.excerpt,
            author: s.author,
            authorRole: s.author_role,
            imageUrl: s.image_url || null,
            date: new Date(s.published_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const [showRoleModal, setShowRoleModal] = useState(false);

  const ROLE_LABELS: Record<string, string> = {
    petani: "Petani",
    umkm: "UMKM / Seller",
    buyer: "Buyer",
    peneliti: "Peneliti",
    pemasta: "Pemasta",
  };

  const handleAnalyzerAccess = useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "petani") {
      setShowRoleModal(true);
      return;
    }
    router.push("/marketplace/analyzer");
  }, [user, router]);

  return (
    <PageShell>
      <HeroSection />

      {/* AI VERIFICATION SHOWCASE */}
      <section className="py-24 bg-primary text-inverse-on-surface relative overflow-hidden">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <Card className="bg-primary-container/40 border border-secondary-fixed/30 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-secondary-fixed" />
                </div>
                <span className="text-sm font-semibold text-on-primary-container">{T_HOME.aiCardTitle[lang]}</span>
              </div>
              <Badge variant="ai">AI AKTIF</Badge>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs text-on-primary-container/70 mb-1">
                  <span>{T_HOME.aiPurity[lang]}</span>
                  <span>96,3%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-on-primary-container/70 mb-1">
                  <span>{T_HOME.aiAuthentic[lang]}</span>
                  <span>1,48</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-md p-3">
                <p className="text-[10px] uppercase text-on-primary-container/50 mb-1">{T_HOME.aiProfile[lang]}</p>
                <p className="text-sm font-semibold text-secondary-fixed">Beta Tinggi</p>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <p className="text-[10px] uppercase text-on-primary-container/50 mb-1">{T_HOME.aiCode[lang]}</p>
                <p className="text-sm font-mono text-on-primary-container">ACEH_001</p>
              </div>
            </div>
            <Button onClick={handleAnalyzerAccess} variant="gold" className="w-full">
              {T_HOME.aiBtnScan[lang]}
            </Button>
          </Card>

          <div>
            <SectionEyebrow className="text-secondary-fixed">{T_HOME.aiEyebrow[lang]}</SectionEyebrow>
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg mb-5 text-balance">
              {T_HOME.aiTitle[lang]}
            </h2>
            <p className="text-body-lg text-inverse-on-surface/75 mb-7">
              {T_HOME.aiDesc[lang]}
            </p>
            <ul className="space-y-3 mb-8">
              {T_HOME.aiFeatures.map((item) => (
                <li key={item[lang]} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary-fixed flex-shrink-0" />
                  {item[lang]}
                </li>
              ))}
            </ul>
            <Button onClick={handleAnalyzerAccess} variant="gold" size="lg">
              {T_HOME.aiBtnTry[lang]}
            </Button>
          </div>
        </div>
      </section>

      {/* Role Warning Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowRoleModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-surface-container rounded-full"
            >
              <X className="w-5 h-5 text-on-surface" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="bg-error-container p-4 rounded-full mb-4">
                <ShieldAlert className="w-8 h-8 text-error" />
              </div>
              <h3 className="font-display text-headline-md text-primary mb-2">Akses Terbatas</h3>
              <p className="text-on-surface-variant mb-6">
                Fitur Penganalisis AI hanya tersedia untuk <strong>Petani</strong>.
              </p>
              <Button onClick={() => setShowRoleModal(false)} variant="primary" className="w-full">
                Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE METRICS */}
      <section className="py-20 bg-surface-container-low">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-headline-md text-primary mb-1">{T_HOME.marketTitle[lang]}</h2>
              <p className="text-sm text-on-surface-variant">
                {T_HOME.marketDesc[lang]}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPACT_METRICS.slice(0, 4).map((m) => (
              <Card key={m.label} className="p-5">
                <p className="text-xs uppercase tracking-wide text-outline mb-2">{m.label}</p>
                <p className="font-display text-2xl font-bold text-primary mb-1">{m.value}</p>
                {m.change && <p className="text-xs text-[#1a7a3e] font-semibold">↗ {m.change}</p>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROOTS / TESTIMONIAL */}
      <section className="py-24 bg-surface">
        <div className="container-app flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
          {/* Left: Image */}
          <div className="lg:w-1/2 relative">
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl relative">
              <img
                src="/images/hero-bg.png"
                alt="Tim ATSIRA"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ink-green/10" />
            </div>

            {/* Floating Quote Card */}
            <div className="absolute -bottom-10 -right-4 sm:-right-10 bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-xs border border-sand-gray">
              <p
                className="text-ink-green mb-2 italic"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}
              >
                {T_HOME.rootsQuote[lang]}
              </p>
              <p
                className="text-clay-earth"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}
              >
                — Dr. Syaifullah, ARC-USK
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="lg:w-1/2">
            <SectionEyebrow>{T_HOME.rootsEyebrow[lang]}</SectionEyebrow>
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-5 text-balance">
              {T_HOME.rootsTitle[lang]}
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              {T_HOME.rootsDesc[lang]}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="font-display text-3xl font-bold text-primary">10.000+</p>
                <p className="text-sm text-on-surface-variant">{T_HOME.rootsStat1[lang]}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-primary">200%</p>
                <p className="text-sm text-on-surface-variant">{T_HOME.rootsStat2[lang]}</p>
              </div>
            </div>
            <Link href="/tracker" className="text-primary font-semibold text-sm underline-offset-4 hover:underline">
              {T_HOME.rootsReport[lang]}
            </Link>
          </div>
        </div>
      </section>

      {/* NILAM STORY HUB (Dari Pemasta) */}
      {stories.length > 0 && (
        <section className="py-24 bg-surface-container-lowest border-t border-surface-container-high">
          <div className="container-app">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <SectionEyebrow>{lang === "ID" ? "Cerita Komunitas" : "Community Stories"}</SectionEyebrow>
              <h2 className="font-display text-headline-lg-mobile lg:text-4xl text-primary mt-4 mb-4 text-balance">
                {lang === "ID" ? "Nilam Story Hub" : "Patchouli Story Hub"}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {lang === "ID" 
                  ? "Kabar terbaru, edukasi, dan dokumentasi lapangan langsung dari para Pahlawan Nilam (Pemasta) di berbagai daerah."
                  : "Latest updates, education, and field documentation straight from our Patchouli Heroes (Pemasta) across regions."}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.slice(0, 3).map((s) => (
                <Card key={s.id} className="p-6 border border-stone-200 flex flex-col gap-4 hover:shadow-lg transition-all group bg-white">
                  {s.imageUrl && (
                    <div className="rounded-xl overflow-hidden aspect-[16/10] mb-2">
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {s.category}
                    </span>
                    <span className="text-xs font-semibold text-stone-400">{s.date}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-stone-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-3 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">
                        {s.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-stone-700">{s.author}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-full">{s.authorRole}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="container-app">
          <div className="bg-primary rounded-lg px-8 py-16 lg:px-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,_white,_transparent_60%)]" />
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-white mb-4 relative z-10 text-balance">
              {T_HOME.ctaTitle[lang]}
            </h2>
            <p className="text-inverse-on-surface/75 max-w-xl mx-auto mb-9 relative z-10">
              {T_HOME.ctaDesc[lang]}
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Button href="/register?role=petani" variant="gold" size="lg">
                {T_HOME.ctaBtnFarmer[lang]}
              </Button>
              <Button href="/register?role=buyer" variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                {T_HOME.ctaBtnPartner[lang]}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

