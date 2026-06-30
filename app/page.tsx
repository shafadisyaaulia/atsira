import Link from "next/link";
import { ArrowRight, Leaf, FlaskConical, Sparkles, CheckCircle2, ShieldCheck, Quote } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card, SectionEyebrow, Badge } from "@/components/ui/Card";
import { IMPACT_METRICS, PRICE_HISTORY, formatIDR } from "@/lib/mock";
import HeroSection from "@/components/shared/HeroSection";

const ECOSYSTEM_LAYERS = [
  {
    icon: Leaf,
    label: "Lapisan 01",
    title: "Hulu (Upstream)",
    desc: "Memberdayakan 5.000+ petani lokal dengan wawasan budidaya berbasis AI dan pemetaan tanah regeneratif.",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=500&fit=crop",
  },
  {
    icon: FlaskConical,
    label: "Lapisan 02",
    title: "Tengah (Midstream)",
    desc: "Proses distilasi terverifikasi blockchain. Setiap batch diproses dengan sidik jari digital untuk kemurnian total.",
    img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=500&fit=crop",
  },
  {
    icon: Sparkles,
    label: "Lapisan 03",
    title: "Hilir (Downstream)",
    desc: "Pasar Langsung-ke-Global yang menghubungkan rumah wewangian premium dengan produk Nilam Aceh terverifikasi.",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=500&fit=crop",
  },
];

export default function HomePage() {
  return (
    <PageShell>
   <HeroSection />
      {/* 3-LAYER ECOSYSTEM */}
      <section className="py-24 bg-surface">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-2">
              Rantai Asal-Usul
            </h2>
            <div className="w-12 h-1 bg-clay-earth mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ECOSYSTEM_LAYERS.map((layer) => (
              <Card key={layer.title} className="overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={layer.img}
                    alt={layer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-xs uppercase tracking-wider text-secondary-fixed font-semibold mb-1">
                      {layer.label}
                    </p>
                    <p className="font-display text-xl font-bold text-white">{layer.title}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-on-surface-variant">{layer.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI VERIFICATION SHOWCASE */}
      <section className="py-24 bg-primary text-inverse-on-surface relative overflow-hidden">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <Card className="bg-primary-container/40 border border-secondary-fixed/30 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-secondary-fixed" />
                </div>
                <span className="text-sm font-semibold text-on-primary-container">Penganalisis Nilam v2.4</span>
              </div>
              <Badge variant="ai">AI AKTIF</Badge>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs text-on-primary-container/70 mb-1">
                  <span>Tingkat Kemurnian</span>
                  <span>96,3%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-on-primary-container/70 mb-1">
                  <span>Bandingkan Otentik</span>
                  <span>1,48</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-md p-3">
                <p className="text-[10px] uppercase text-on-primary-container/50 mb-1">Profil Terpilih</p>
                <p className="text-sm font-semibold text-secondary-fixed">Beta Tinggi</p>
              </div>
              <div className="bg-white/5 rounded-md p-3">
                <p className="text-[10px] uppercase text-on-primary-container/50 mb-1">Kode Lokasi</p>
                <p className="text-sm font-mono text-on-primary-container">ACEH_001</p>
              </div>
            </div>
            <Button href="/marketplace/analyzer" variant="gold" className="w-full">
              Mulai Pindai
            </Button>
          </Card>

          <div>
            <SectionEyebrow className="text-secondary-fixed">Teknologi Presisi</SectionEyebrow>
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg mb-5 text-balance">
              Verifikasi Kemurnian Berbasis AI
            </h2>
            <p className="text-body-lg text-inverse-on-surface/75 mb-7">
              Menggunakan model pembelajaran mesin canggih yang dilatih oleh peneliti di ARC-USK,
              Penganalisis Nilam memastikan setiap tetes minyak memenuhi standar kemewahan internasional
              sebelum mencapai pasar.
            </p>
            <ul className="space-y-3 mb-8">
              {["Analisis Komposisi Kimia Instan", "Autentikasi Batch Blockchain", "Penilaian Kualitas Waktu Nyata"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-secondary-fixed flex-shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <Button href="/marketplace/analyzer" variant="gold" size="lg">
              Coba Penganalisis Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* LIVE METRICS */}
      <section className="py-20 bg-surface-container-low">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-headline-md text-primary mb-1">Wawasan Pasar Global</h2>
              <p className="text-sm text-on-surface-variant">
                Evaluasi waktu nyata Nilam Aceh terhadap indeks internasional.
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
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFFvYGardEFoCENoaSF7swTl_SekC0fN9ZpXEbyFer8TUVas5NREjsiyDJsTXab2APHVC1jf8oEMVe_sJ1SnhqexXYHvvEkFlaVZwdAoGJw1vgbFNcPWlYumpXpy1c0a220kdGdDI5zR6bq2Jyrf4E-hYGEvdgu70ZcOrF5unot10TZ3MqB8BP10yR9DvLtHHULQ7Tfdr7dGYALKtEiRLO5jmmF4D0E3rIx67he66w8AD1L1F80mUYEyrqYGjN-BRQKhq8J0hbhz9e')",
                }}
              />
              <div className="absolute inset-0 bg-ink-green/10" />
            </div>

            {/* Floating Quote Card */}
            <div className="absolute -bottom-10 -right-4 sm:-right-10 bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-xs border border-sand-gray">
              <p
                className="text-ink-green mb-2 italic"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", lineHeight: "32px", fontWeight: "600" }}
              >
                &ldquo;Kami tidak hanya menjual minyak; kami melindungi warisan yang hampir hilang.&rdquo;
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
            <SectionEyebrow>Akar Kami</SectionEyebrow>
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-5 text-balance">
              Berakar Secara Berkelanjutan. Terverifikasi Secara Digital.
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              ATSIRA dibangun dalam kemitraan mendalam dengan Atsiri Research Center (ARC) di Universitas
              Syiah Kuala. Bersama-sama, kami telah merevitalisasi ekonomi nilam di Aceh, memastikan petani
              menerima harga yang adil sementara dunia menerima minyak semurni mungkin.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="font-display text-3xl font-bold text-primary">10.000+</p>
                <p className="text-sm text-on-surface-variant">Mata Pencaharian Didukung</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-primary">200%</p>
                <p className="text-sm text-on-surface-variant">Peningkatan Pendapatan bagi Petani</p>
              </div>
            </div>
            <Link href="/tracker" className="text-primary font-semibold text-sm underline-offset-4 hover:underline">
              Baca Laporan Dampak 2026 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-app">
          <div className="bg-primary rounded-lg px-8 py-16 lg:px-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,_white,_transparent_60%)]" />
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-white mb-4 relative z-10 text-balance">
              Bergabunglah dalam Renaisans Wewangian
            </h2>
            <p className="text-inverse-on-surface/75 max-w-xl mx-auto mb-9 relative z-10">
              Apakah Anda seorang petani Aceh, operator distilasi, atau merek wewangian global, ATSIRA
              menyediakan alat untuk tumbuh bersama.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Button href="/register?role=petani" variant="gold" size="lg">
                Gabung sebagai Petani
              </Button>
              <Button href="/register?role=buyer" variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Gabung sebagai Mitra
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
