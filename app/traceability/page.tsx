"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, Calendar, CheckCircle2, QrCode, Sprout, FlaskConical, ShieldCheck, Award, ExternalLink, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ALL_PRODUCTS } from "@/lib/mock/products";

const STAGE_ICON: Record<string, any> = { 
  Kebun: Sprout, 
  Penyulingan: ShieldCheck, 
  Pengujian: FlaskConical, 
  Distribusi: MapPin, 
  Botol: QrCode 
};

const T = {
  eyebrow: { ID: "Verifikasi Transparansi Produk", EN: "Product Transparency Verification" },
  title: { ID: "Telusuri Jejak Nilam Anda", EN: "Trace Your Patchouli Journey" },
  placeholder: { ID: "Masukkan ID Batch atau Kode Produk (misal: atSira-F001 / atSira-R001)", EN: "Enter Batch ID or Product Code (e.g. atSira-F001 / atSira-R001)" },
  searchBtn: { ID: "Lacak Sekarang", EN: "Track Now" },
  hint: { ID: "Coba salin ID simulasi:", EN: "Try simulation IDs:" },
  notFound: { ID: "ID produk tidak ditemukan. Pastikan kode yang dimasukkan benar.", EN: "Product ID not found. Please check your code." },
  verified: { ID: "Terverifikasi ARC-USK", EN: "Verified by ARC-USK" },
  timelineTitle: { ID: "Perjalanan Rantai Pasok Digital", EN: "Digital Supply Chain Journey" },
  ledgerLabel: { ID: "Tercatat Permanen di Ledger Terenkripsi atSira", EN: "Permanently Recorded on atSira Encrypted Ledger" },
  emptyState: { ID: "Masukkan ID produk atau pindaikan QR Code pada botol kemasan untuk melihat rekam jejak hulu ke hilir.", EN: "Enter product ID or scan QR Code on bottle to view crop-to-bottle records." },
  paLabel: { ID: "Kadar Patchouli Alcohol", EN: "Patchouli Alcohol Level" },
  gradeLabel: { ID: "Klasifikasi Mutu", EN: "Quality Grade" },
  viewFullCert: { ID: "Buka Sertifikat Digital Lengkap", EN: "Open Full Digital Certificate" }
};

function TraceabilityContent() {
  const params = useSearchParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [loading, setLoading] = useState(false);
  const initialBatch = params.get("batch") || "";
  const [batchId, setBatchId] = useState(initialBatch);
  const [searched, setSearched] = useState<any>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    const updateLanguage = () => {
      const savedLang = localStorage.getItem("lang");
      if (savedLang === "EN" || savedLang === "ID") setLang(savedLang);
    };
    updateLanguage();
    window.addEventListener("storage", updateLanguage);
    return () => window.removeEventListener("storage", updateLanguage);
  }, []);

  const findLocalProduct = (id: string) => {
    const searchId = id.toLowerCase().trim();
    console.log("Searching for:", searchId);
    const found = ALL_PRODUCTS.find(
      (p: any) => 
        String(p.id).toLowerCase() === searchId || 
        String(p.qrBatchId || "").toLowerCase() === searchId
    );
    console.log("Found:", found);
    return found;
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFoundFlag(false);

    // 1. Cari Data Real dari Supabase (Gabungan finished_products & raw_oil_listings)
    const { data: finishedData, error: finishedError } = await supabase
      .from("finished_products")
      .select("*, coa_records(*)")
      .eq("qr_batch_id", query.trim())
      .maybeSingle();

    const { data: rawData, error: rawError } = await supabase
      .from("raw_oil_listings")
      .select("*, coa_records(*)")
      .eq("qr_batch_id", query.trim())
      .maybeSingle();

    // Mapping hasil Supabase ke format yang diharapkan traceability
    if (finishedData || rawData) {
      const dbData = finishedData || rawData;
      
      // Ambil data trace dari mock berdasarkan kategori/ID jika tersedia fallback
      const mockFallback = ALL_PRODUCTS.find(p => (p as any).qrBatchId === query.trim());

      setSearched({
        id: dbData.qr_batch_id,
        title: dbData.title,
        imageUrl: dbData.image_url || mockFallback?.imageUrl || "/images/patchouli-oil-placeholder.jpg",
        isRealDb: true,
        coa: dbData.coa_records ? { paLevel: dbData.coa_records.pa_level } : (mockFallback as any)?.coa,
        traceability: (mockFallback as any)?.traceability || [
          {
            stage: "Botol",
            title: { ID: "Produk Terverifikasi", EN: "Verified Product" },
            description: { ID: "Produk telah masuk dalam database atSira.", EN: "Product registered in atSira database." },
            date: new Date().toLocaleDateString(),
            location: "atSira System",
          }
        ]
      });
    } else {
      // 2. Fallback ke Data Mock Local
      const localFound = findLocalProduct(query);
      if (localFound) {
        setSearched({ ...localFound, isRealDb: false });
      } else {
        setSearched(null);
        setNotFoundFlag(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialBatch) performSearch(initialBatch);
  }, [initialBatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(batchId);
  };

  const getLocalizedText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field["ID"] || field["EN"] || "";
  };

  return (
    <PageShell>
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 py-16 text-white relative">
        <div className="container-app relative z-10 px-4 max-w-4xl mx-auto">
          <SectionEyebrow className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2">
            {T.eyebrow[lang]}
          </SectionEyebrow>
          <h1 className="font-display text-2xl md:text-4xl font-black mb-6 tracking-tight">
            {T.title[lang]}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <Input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder={T.placeholder[lang]}
                className="pl-12 bg-white text-stone-900 rounded-xl border-none focus:ring-2 focus:ring-amber-500 h-12"
              />
            </div>
            <Button type="submit" disabled={loading} className="rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 px-6 h-12">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : T.searchBtn[lang]}
            </Button>
          </form>
          
          <p className="text-[11px] text-white/70 mt-4 bg-black/30 inline-block px-3 py-1 rounded-full border border-white/10">
            <span className="font-bold text-amber-400">{T.hint[lang]}</span> atSira-F001, atSira-R001
          </p>
        </div>
      </section>

      <section className="py-12 bg-stone-50 min-h-[50vh]">
        <div className="container-app max-w-3xl px-4 mx-auto">
          {notFoundFlag && (
            <Card className="p-8 text-center border-red-200 bg-red-50/50 rounded-2xl">
              <p className="text-sm text-red-800 font-medium">{T.notFound[lang]}</p>
            </Card>
          )}

          {searched && (
            <div className="space-y-6">
              <Card className="p-6 border-l-4 border-l-emerald-600 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                <img src={searched.imageUrl || searched.img} alt="Product" className="w-24 h-24 rounded-xl object-cover shadow-sm border border-stone-200" />
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
                    <h2 className="font-display text-lg font-black text-stone-900">{getLocalizedText(searched.title)}</h2>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {T.verified[lang]}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-stone-500 mb-4">BATCH CODE: <span className="bg-stone-100 px-2 py-0.5 rounded font-bold text-stone-800">{searched.id}</span></p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-stone-50 p-3 rounded-xl border border-stone-200 mb-3">
                    <div>
                      <p className="text-[10px] text-stone-500 font-bold uppercase">{T.paLabel[lang]}</p>
                      <p className="font-mono text-base font-black text-amber-700 flex items-center gap-1 justify-center sm:justify-start">
                        <Award className="w-4 h-4 text-amber-500" /> {searched.coa?.paLevel || 30}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 font-bold uppercase">{T.gradeLabel[lang]}</p>
                      <p className="font-bold text-stone-900 text-sm">
                        {(searched.coa?.paLevel || 30) >= 32 ? "Grade A Export Quality" : "Standard Quality"}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => router.push(`/traceability/${searched.id}`)}
                    className="w-full sm:w-auto bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold rounded-xl gap-2"
                  >
                    {T.viewFullCert[lang]} <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>

              {/* TIMELINE */}
              <Card className="p-6 bg-white rounded-2xl border border-stone-200 space-y-6">
                <p className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-600" /> {T.timelineTitle[lang]}
                </p>

                <div className="relative border-l-2 border-emerald-200 ml-4 pl-6 space-y-6">
                  {searched.traceability?.map((stage: any, idx: number) => {
                    const Icon = STAGE_ICON[stage.stage] ?? MapPin;
                    return (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">{stage.stage}</span>
                            <span className="text-[10px] text-stone-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {stage.date}</span>
                          </div>
                          <p className="font-bold text-xs text-stone-900">{getLocalizedText(stage.title)}</p>
                          <p className="text-xs text-stone-600">{getLocalizedText(stage.description)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {!searched && !notFoundFlag && (
            <Card className="p-12 text-center bg-white border border-stone-200 rounded-2xl">
              <QrCode className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-xs text-stone-500 max-w-sm mx-auto">{T.emptyState[lang]}</p>
            </Card>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default function TraceabilityPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Memuat Halaman Traceability...</div>}>
      <TraceabilityContent />
    </Suspense>
  );
}