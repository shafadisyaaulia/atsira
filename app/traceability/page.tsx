"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search, MapPin, Calendar, CheckCircle2, ShieldCheck, QrCode, Sprout, FlaskConical, Award } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDateID } from "@/lib/mock";

// ── IMPORT DATABASE PRODUK UTAMA ──
import { ALL_PRODUCTS } from "@/lib/mock/products";

// Pemetaan Ikon Lini Masa
const STAGE_ICON: Record<string, any> = { 
  Kebun: Sprout, 
  Penyulingan: ShieldCheck, 
  Pengujian: FlaskConical, 
  Distribusi: MapPin, 
  Botol: QrCode 
};

// ====== KAMUS BAHASA LOKAL ======
const T = {
  eyebrow: { ID: "Verifikasi Transparansi Produk", EN: "Product Transparency Verification" },
  title: { ID: "Telusuri Jejak Nilam Anda", EN: "Trace Your Patchouli Journey" },
  placeholder: { ID: "Masukkan ID Batch atau ID Produk, contoh: fp-sabun-nilam", EN: "Enter Batch ID or Product ID, e.g., fp-sabun-nilam" },
  searchBtn: { ID: "Lacak Sekarang", EN: "Track Now" },
  hint: { ID: "Coba salin ID produk simulasi berikut:", EN: "Try copying these simulation IDs:" },
  notFound: { ID: "ID Batch / Produk tidak ditemukan. Silakan periksa kembali kode Anda atau coba 'fp-sabun-nilam'.", EN: "Batch / Product ID not found. Please check your code or try 'fp-sabun-nilam'." },
  verified: { ID: "Terverifikasi", EN: "Verified" },
  timelineTitle: { ID: "Perjalanan Dokumen & Produk", EN: "Product & Document Journey" },
  ledgerLabel: { ID: "Dicatat secara permanen di ledger aman ATSIRA", EN: "Permanently recorded on ATSIRA secured ledger" },
  emptyState: { ID: "Masukkan ID produk atau ID batch Anda di atas untuk melihat seluruh riwayat perjalanan dari hulu ke hilir.", EN: "Enter your product ID or batch ID above to view the entire crop-to-bottle history." }
};

function TraceabilityContent() {
  const params = useSearchParams();
  const lang = typeof window !== "undefined" && localStorage.getItem("lang") === "EN" ? "EN" : "ID";

  // Ambil data default dari URL parameter jika ada (?batch=...) atau gunakan 'fp-sabun-nilam' untuk awalan demonstrasi
  const initialBatch = params.get("batch") || "";
  
  // Fungsi pencarian mandiri di database ALL_PRODUCTS
  const findProduct = (id: string | null) => {
    if (!id) return null;
    return ALL_PRODUCTS.find(
      (p: any) => 
        String(p.id).toLowerCase() === id.toLowerCase().trim() || 
        String(p.qrBatchId || "").toLowerCase() === id.toLowerCase().trim()
    ) || null;
  };

  const [batchId, setBatchId] = useState(initialBatch);
  const [searched, setSearched] = useState<any>(findProduct(initialBatch));
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!batchId.trim()) return;
    
    const found = findProduct(batchId);
    setSearched(found);
    setNotFoundFlag(!found);
  }

  // Fungsi pembantu translasi teks dinamis string/objek
  const getLocalizedText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field["ID"] || field["EN"] || "";
  };

  // Ambil data CoA secara adaptif
  const coa = searched ? (searched.coa || searched.coaSnapshot || searched.coaFields || { paLevel: 30 }) : null;
  // Ambil data lini masa, buat fallback jika produk mentah/belum diisi data pelacakan
  const traceability = searched?.traceability || [
    { stage: "Kebun", title: { ID: "Pemetikan Daun Tradisional", EN: "Traditional Leaf Harvesting" }, description: { ID: "Dipanen dari perkebunan binaan terverifikasi.", EN: "Harvested from verified target plantation." }, date: "2026-04-01", location: "Aceh, Indonesia", verified: true },
    { stage: "Pengujian", title: { ID: "Uji Lab Kemurnian", EN: "Lab Purity Testing" }, description: { ID: "Lolos standar mutu laboratorium ARC USK.", EN: "Passed quality standards of ARC USK Laboratory." }, date: "2026-04-05", location: "ARC Banda Aceh", verified: true }
  ];

  return (
    <PageShell>
      {/* SECTION HERO */}
      <section className="bg-gradient-to-r from-emerald-950 via-primary to-amber-950 py-16 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
        <div className="container-app relative z-10 px-4 max-w-4xl mx-auto">
          <SectionEyebrow className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2">
            {T.eyebrow[lang]}
          </SectionEyebrow>
          <h1 className="font-display text-2xl md:text-4xl font-black mb-6 tracking-tight">
            {T.title[lang]}
          </h1>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <Input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder={T.placeholder[lang]}
                className="pl-12 bg-white text-on-surface rounded-xl border-none focus:ring-2 focus:ring-amber-500 h-12"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 px-6 h-12">
              {T.searchBtn[lang]}
            </Button>
          </form>
          
          <p className="text-[11px] text-white/70 mt-4 bg-black/20 inline-block px-3 py-1 rounded-full border border-white/5">
            <span className="font-bold text-amber-400">{T.hint[lang]}</span> fp-sabun-nilam, fin-1, atau raw-1
          </p>
        </div>
      </section>

      {/* SECTION KONTEN HASIL PELACAKAN */}
      <section className="py-12 bg-gradient-to-b from-surface via-surface-container-lowest/30 to-surface">
        <div className="container-app max-w-3xl px-4 mx-auto">
          
          {/* Gagal Menemukan Dokumen */}
          {notFoundFlag && (
            <Card className="p-8 text-center border-red-200 bg-red-50/30 rounded-2xl shadow-sm animate-in fade-in">
              <p className="text-sm text-red-800 font-medium">
                {T.notFound[lang]}
              </p>
            </Card>
          )}

          {/* Data Ditemukan */}
          {searched && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Kartu Detail Ringkasan Batch */}
              <Card className="p-5 md:p-6 border-l-4 border-l-emerald-600 rounded-2xl shadow-md flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-white">
                <img src={searched.imageUrl || searched.img} alt={getLocalizedText(searched.title)} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow border border-surface-container-high" />
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
                    <p className="font-display text-lg font-black text-primary tracking-tight">{getLocalizedText(searched.title)}</p>
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {T.verified[lang]}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-outline mb-4">ID Referensi: <span className="bg-surface-container-low px-2 py-0.5 rounded text-on-surface">{searched.id}</span></p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gradient-to-r from-surface-container-lowest to-surface p-3 rounded-xl border border-surface-container-high">
                    <div>
                      <p className="text-[11px] text-outline font-bold uppercase tracking-wider">Kadar Patchouli Alcohol</p>
                      <p className="font-mono text-lg font-black text-amber-600 flex items-center gap-1 justify-center sm:justify-start">
                        <Award className="w-4 h-4 text-amber-500" /> {coa?.paLevel || 30}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-outline font-bold uppercase tracking-wider">Klasifikasi Grade</p>
                      <p className="font-black text-on-surface text-base pt-0.5">
                        {(coa?.paLevel || 30) >= 32 ? "⭐️ Premium Quality" : "Standard Quality"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Garis Lini Masa Lacak Perjalanan */}
              <div>
                <p className="font-display text-xl font-black text-primary tracking-tight mb-6 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-600" />
                  {T.timelineTitle[lang]}
                </p>
                
                <div className="relative border-l-2 border-dashed border-emerald-200/80 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
                  {traceability.map((stage: any, idx: number) => {
                    const Icon = STAGE_ICON[stage.stage] ?? MapPin;
                    return (
                      <div key={idx} className="relative group">
                        {/* Bulatan Ikon Timeline */}
                        <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-600 to-primary text-white flex items-center justify-center flex-shrink-0 z-10 shadow group-hover:scale-110 transition-transform">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        
                        {/* Kartu Detail Aktivitas */}
                        <Card className="p-5 border border-surface-container-high bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between border-b border-surface-container-low pb-2 mb-2 flex-wrap gap-2">
                            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {stage.stage}
                            </span>
                            <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {formatDateID(stage.date)}
                            </span>
                          </div>
                          <p className="font-bold text-sm text-on-surface mb-1">{getLocalizedText(stage.title)}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed mb-1">{getLocalizedText(stage.description)}</p>
                          {stage.location && (
                            <p className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-2 bg-emerald-50/50 inline-flex px-2 py-0.5 rounded">
                              <MapPin className="w-3 h-3" /> {stage.location}
                            </p>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bukti Keamanan Hash Ledger Permanen */}
              <Card className="p-4 bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low rounded-xl border border-surface-container-high shadow-inner">
                <p className="text-[10px] uppercase font-black tracking-widest text-outline mb-1">{T.ledgerLabel[lang]}</p>
                <p className="font-mono text-[11px] text-emerald-800 font-bold break-all bg-emerald-50/40 p-2 rounded border border-emerald-100/50">
                  0x8a7e9c1f2d3b4a5e6f7d8c9b0a1f2e3d4c5b6a7e8f9d0c1b2a3e4f5d6c7b8a9e
                </p>
              </Card>
            </div>
          )}

          {/* Tampilan Kosong Belum Melakukan Pencarian */}
          {!searched && !notFoundFlag && (
            <Card className="p-12 text-center text-on-surface-variant bg-white border border-surface-container-high rounded-2xl shadow-sm max-w-xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-emerald-100 text-primary flex items-center justify-center rounded-2xl mx-auto mb-4 shadow-inner">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xs leading-relaxed max-w-sm mx-auto text-outline">
                {T.emptyState[lang]}
              </p>
            </Card>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default function TraceabilityPage() {
  return (
    <Suspense>
      <TraceabilityContent />
    </Suspense>
  );
}