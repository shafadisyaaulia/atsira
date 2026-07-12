"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Button } from "@/components/ui/Card"; // Sesuaikan path komponen UI Anda
import { MapPin, DollarSign, TrendingUp, History, ShieldAlert } from "lucide-react";
import { useLang } from "@/components/layout/Navbar";

// Kamus Translasi Bilingual
const T_PEMASTA = {
  title: { ID: "Dasbor Komunitas PEMASTA", EN: "PEMASTA Community Dashboard" },
  sub: { 
    ID: "Mitra Lapangan & Pengumpul Data Intelijen Harga Aktual ATSIRA", 
    EN: "Field Partner & Actual Price Intelligence Data Feeder for ATSIRA" 
  },
  formTitle: { ID: "Laporkan Harga Pasar Hari Ini", EN: "Report Today's Market Price" },
  formSub: { 
    ID: "Data ini akan menjadi baseline kalkulasi AI QualitySense.", 
    EN: "This data will serve as the baseline for AI QualitySense calculations." 
  },
  region: { ID: "Pilih Wilayah Lapangan", EN: "Select Field Region" },
  premium: { ID: "Harga Grade Premium (per kg)", EN: "Premium Grade Price (per kg)" },
  standard: { ID: "Harga Grade Standard (per kg)", EN: "Standard Grade Price (per kg)" },
  economy: { ID: "Harga Grade Economy (per kg)", EN: "Economy Grade Price (per kg)" },
  submit: { ID: "Kirim Data Harga", EN: "Submit Price Data" },
  successMsg: { ID: "Data berhasil dikirim ke AI Engine!", EN: "Data successfully sent to AI Engine!" },
  recentTitle: { ID: "Riwayat Input Harga Terbaru", EN: "Recent Price Input History" }
};

export default function PemastaDashboard() {
  const lang = useLang();
  const [region, setRegion] = useState("Banda Aceh");
  const [prices, setPrices] = useState({ premium: "", standard: "", economy: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Proses integrasi database/state management Anda nanti di sini
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <PageShell>
      <div className="container-app py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 border-b border-sand-gray pb-5">
          <h1 className="font-display text-headline-md text-primary font-bold">{T_PEMASTA.title[lang]}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{T_PEMASTA.sub[lang]}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Kiri: Form Input Harga */}
          <div className="md:col-span-2">
            <Card className="p-6 border-2 border-amber-500/20 bg-amber-50/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-primary">{T_PEMASTA.formTitle[lang]}</h2>
                  <p className="text-xs text-on-surface-variant">{T_PEMASTA.formSub[lang]}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* Wilayah */}
                <div>
                  <label className="block text-xs font-semibold text-outline uppercase mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {T_PEMASTA.region[lang]}
                  </label>
                  <select 
                    value={region} 
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2.5 rounded border border-sand-gray bg-bone-wash text-sm font-medium"
                  >
                    <option value="Banda Aceh">Banda Aceh & Aceh Besar</option>
                    <option value="Aceh Jaya">Aceh Jaya (Calang)</option>
                    <option value="Gayo Lues">Gayo Lues (Blangkejeren)</option>
                    <option value="Aceh Selatan">Aceh Selatan (Tapaktuan)</option>
                  </select>
                </div>

                {/* Grid Tiga Grade */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-outline mb-1 font-mono">{T_PEMASTA.premium[lang]}</label>
                    <input 
                      type="number" required placeholder="e.g. 1450000"
                      value={prices.premium}
                      onChange={(e) => setPrices({...prices, premium: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-sand-gray bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-mono">{T_PEMASTA.standard[lang]}</label>
                    <input 
                      type="number" required placeholder="e.g. 1130000"
                      value={prices.standard}
                      onChange={(e) => setPrices({...prices, standard: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-sand-gray bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-outline mb-1 font-mono">{T_PEMASTA.economy[lang]}</label>
                    <input 
                      type="number" required placeholder="e.g. 797500"
                      value={prices.economy}
                      onChange={(e) => setPrices({...prices, economy: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-sand-gray bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-patchouli-deep text-white py-3 rounded-xl hover:bg-ink-green transition-all text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" /> {T_PEMASTA.submit[lang]}
                  </button>
                </div>

                {submitted && (
                  <div className="p-3 bg-green-50 text-green-700 text-xs rounded-lg font-medium border border-green-200 text-center animate-fade-in">
                    🎉 {T_PEMASTA.successMsg[lang]}
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* Kanan: Sidebar Riwayat Singkat */}
          <div>
            <Card className="p-5 h-full">
              <div className="flex items-center gap-2 mb-4 text-outline border-b pb-3">
                <History className="w-4 h-4" />
                <h3 className="text-xs uppercase font-semibold tracking-wide">{T_PEMASTA.recentTitle[lang]}</h3>
              </div>
              
              {/* Dummy Live Feeds Lapangan */}
              <div className="space-y-4">
                <div className="border-l-2 border-patchouli-deep pl-3 text-xs">
                  <p className="font-semibold text-primary">Gayo Lues — Grade Premium</p>
                  <p className="text-oil-gold font-bold font-mono my-0.5">Rp 1.450.000 /kg</p>
                  <p className="text-[10px] text-outline">Hari ini, 09:30 WIB · oleh Tim A</p>
                </div>
                <div className="border-l-2 border-sand-gray pl-3 text-xs">
                  <p className="font-semibold text-primary">Aceh Jaya — Grade Standard</p>
                  <p className="text-on-surface font-bold font-mono my-0.5">Rp 1.120.000 /kg</p>
                  <p className="text-[10px] text-outline">Kemarin · oleh Tim B</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}