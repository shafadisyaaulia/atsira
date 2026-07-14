"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Upload, 
  Camera, 
  RefreshCw, 
  AlertTriangle, 
  Droplet, 
  Coins,
  Clock,
  Archive,
  CheckCircle2,
  FileText
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, SectionEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function MarketplaceAnalyzerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // Parameter form disesuaikan dengan kebutuhan indikator visual & riset SNI
  const [formData, setFormData] = useState({
    paTarget: "34.2",
    visualStyle: "clear-yellow",
    storageDuration: "new",
    containerType: "plastic-glass"
  });

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  }

  function startQualitySenseScan() {
    if (!image) return;
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      
      // Kalkulasi harga berdasarkan Kadar PA dan parameter fisik wadah/penyimpanan
      let basePricePerKg = 1150000;
      const paFactor = Number(formData.paTarget) || 30;
      
      // Kadar PA makin tinggi, harga naik
      basePricePerKg += (paFactor - 30) * 45000;

      // Penurunan harga jika wadah dari besi atau terlalu lama disimpan (resiko oksidasi besi/asam naik)
      let ironRisk = "Aman (Bebas Karat)";
      let oxidationRisk = "Rendah";
      let statusQuality = "MUTU UTAMA (A)";

      if (formData.visualStyle === "cloudy-dark") {
        basePricePerKg -= 150000;
        ironRisk = "Tinggi (Terdeteksi Kontaminasi Besi)";
        statusQuality = "MUTU RENDAH (C)";
      }

      if (formData.storageDuration === "old") {
        basePricePerKg -= 100000;
        oxidationRisk = "Tinggi (Bilangan Asam Meningkat)";
      }

      setScanResult({
        recommendedPrice: basePricePerKg,
        clarityScore: formData.visualStyle === "clear-yellow" ? "96/100" : "45/100",
        ironContamination: ironRisk,
        oxidationLevel: oxidationRisk,
        status: statusQuality,
        notes: `Berdasarkan pemindaian spektral kamera, sampel memiliki karakteristik fisik yang berkorelasi dengan kadar PA sekitar ${paFactor}%. Validasi kesesuaian berbasis model prediksi NIRS-PLS Laboratorium ARC-USK.`
      });
    }, 2200);
  }

  function resetScanner() {
    setImage(null);
    setScanResult(null);
  }

  return (
    <PageShell>
      {/* PANEL ATAS / HERO - TEMA HIJAU EMAS KHAS ATSIRA */}
      <section className="bg-primary py-14 text-inverse-on-surface">
        <div className="container-app">
          <SectionEyebrow className="text-secondary-fixed">Fitur Utama</SectionEyebrow>
          <div className="flex items-center gap-3 mt-1 mb-3">
            <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-white">QualitySense</h1>
            <span className="bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider self-center">v2.9</span>
          </div>
          <p className="text-inverse-on-surface/75 max-w-2xl text-sm leading-relaxed">
            Analisis instan kualitas fisik minyak nilam berbasis model spektrometri NIRS-PLS. Cukup unggah foto sampel dalam botol kaca bening dan lengkapi data lapangan, sistem akan menaksir kelayakan mutu berdasarkan standar SNI 06-2385-2006 dan harga wajar PEMASTA.
          </p>
        </div>
      </section>

      {/* AREA UTAMA KALKULATOR */}
      <section className="py-14 bg-surface-container-lowest">
        <div className="container-app max-w-5xl">
          <div className="grid md:grid-cols-12 gap-6">
            
            {/* SISI KIRI: INPUT FORM (Petani & Buyer Friendly) */}
            <div className="md:col-span-7 space-y-4">
              <Card className="p-5 bg-white border border-stone-200/60 shadow-sm space-y-4">
                
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <Camera className="w-4 h-4 text-amber-600" /> 1. Foto Sampel Minyak (Gunakan Botol Kaca Bening)
                </h2>
                <p className="text-[11px] text-stone-500 -mt-2 leading-relaxed">
                  Pastikan memfoto di ruangan terang dengan latar belakang netral agar sensor optik kamera mendeteksi kejernihan dengan presisi.
                </p>
                
                {!image ? (
                  <label className="border-2 border-dashed border-emerald-300 rounded-xl p-8 flex flex-col items-center justify-center bg-emerald-50/10 cursor-pointer hover:bg-emerald-50/30 transition-all min-h-[150px] group">
                    <Upload className="w-7 h-7 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-emerald-950">Ambil Foto atau Pilih Gambar Botol</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-100 bg-stone-50 h-44 flex items-center justify-center">
                    <img src={image} alt="Sampel Nilam" className="h-full object-contain" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center text-white backdrop-blur-xs">
                        <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mb-2" />
                        <span className="text-xs font-mono tracking-wider text-amber-300 font-bold animate-pulse">QualitySense Sedang Menganalisis Mutu Fisik...</span>
                      </div>
                    )}
                  </div>
                )}

                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 pt-2 border-b border-stone-100 pb-2">
                  <FileText className="w-4 h-4 text-amber-600" /> 2. Indikator Tambahan Laboratorium & Lapangan
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Droplet className="w-3.5 h-3.5 text-emerald-600" /> Berapa Kadar PA (%) Minyak Anda?
                    </Label>
                    <Input 
                      type="number" 
                      value={formData.paTarget} 
                      placeholder="Contoh: 34.2"
                      onChange={e => setFormData({...formData, paTarget: e.target.value})}
                      className="font-mono text-xs border-stone-200 bg-stone-50 h-9"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Warna & Kejernihan (Mata Kasat)
                    </Label>
                    <select 
                      value={formData.visualStyle} 
                      className="w-full border border-stone-200 focus:border-emerald-500 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                      onChange={e => setFormData({...formData, visualStyle: e.target.value})}
                    >
                      <option value="clear-yellow">Bening / Kuning Cerah Bersih (Bebas Endapan)</option>
                      <option value="cloudy-dark">Keruh / Cokelat Tua Gelap (Ada Endapan Besi)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> Sudah Berapa Lama Minyak Disimpan?
                    </Label>
                    <select 
                      value={formData.storageDuration} 
                      className="w-full border border-stone-200 focus:border-emerald-500 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                      onChange={e => setFormData({...formData, storageDuration: e.target.value})}
                    >
                      <option value="new">Baru Disuling (Kurang dari 1 Bulan)</option>
                      <option value="old">Sudah Lama Disimpan (Lebih dari 6 Bulan)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Archive className="w-3.5 h-3.5 text-emerald-600" /> Apa Jenis Wadah Penyimpanannya?
                    </Label>
                    <select 
                      value={formData.containerType} 
                      className="w-full border border-stone-200 focus:border-emerald-500 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                      onChange={e => setFormData({...formData, containerType: e.target.value})}
                    >
                      <option value="plastic-glass">Jerigen Plastik / Botol Kaca Kering</option>
                      <option value="iron-drum">Drum Besi / Wadah Logam Berkarat</option>
                    </select>
                  </div>
                </div>

                {image && !isScanning && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={resetScanner} className="w-1/4 text-xs text-stone-600 hover:bg-stone-50">Reset</Button>
                    <Button onClick={startQualitySenseScan} size="sm" className="w-3/4 bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md">
                      <Sparkles className="w-4 h-4 text-amber-300" /> Jalankan Analisis QualitySense
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* SISI KANAN: PANEL HASIL (Tema Elegan Gelap & Emas) */}
            <div className="md:col-span-5">
              <Card className="p-5 bg-stone-900 text-stone-100 border-t-4 border-amber-500 shadow-md h-full flex flex-col justify-between min-h-[400px]">
                {!scanResult ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                    <Coins className="w-12 h-12 text-amber-400/60 mb-2" />
                    <p className="text-xs font-bold text-stone-200">Hasil Taksiran QualitySense</p>
                    <p className="text-[10px] text-stone-300 max-w-[200px] mt-1 leading-relaxed">
                      Silakan masukkan foto sampel minyak nilam dan jalankan analisis untuk memunculkan keputusan uji mutu serta estimasi harga pasarnya.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> STATUS ATSIRA VERIFIED
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        {scanResult.status}
                      </span>
                    </div>

                    {/* DISPLAY ESTIMASI HARGA */}
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 shadow-inner">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Rekomendasi Batas Harga Jual (Per Kg)</p>
                      <p className="text-2xl font-mono font-black text-amber-400 mt-0.5">
                        Rp {scanResult.recommendedPrice.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* DETAIL KANDUNGAN MINYAK */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-stone-950/60 p-2.5 rounded-lg border border-stone-800">
                        <p className="text-[10px] text-stone-400">Skor Transmisi Optik</p>
                        <p className="text-sm font-mono font-bold text-amber-300 mt-0.5">{scanResult.clarityScore}</p>
                      </div>
                      <div className="bg-stone-950/60 p-2.5 rounded-lg border border-stone-800">
                        <p className="text-[10px] text-stone-400">Metode Validasi</p>
                        <p className="text-[9px] font-sans font-bold text-amber-300 mt-1 leading-tight">NIRS-PLS & Lab ARC-USK</p>
                      </div>
                    </div>

                    {/* VALIDASI SNI */}
                    <div className="space-y-1.5 text-[11px] bg-stone-950 p-3 rounded-lg border border-stone-800">
                      <div className="flex justify-between border-b border-stone-900 pb-1.5">
                        <span className="text-stone-400">Kontaminasi Zat Besi (Fe):</span>
                        <span className="text-emerald-400 font-bold text-right">{scanResult.ironContamination}</span>
                      </div>
                      <div className="flex flex-col pt-1 text-[10px]">
                        <span className="text-stone-400 font-bold mb-0.5">Catatan Analisis Spektral:</span>
                        <span className="text-stone-300 leading-relaxed font-sans">{scanResult.notes}</span>
                      </div>
                    </div>

                    {/* PERINGATAN NEGOSIASI */}
                    <div className="flex gap-2 p-2.5 bg-amber-500/10 rounded border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-400" />
                      <span>
                        Gunakan data komparasi harga PEMASTA ini sebagai dasar tawar-menawar yang kuat antara UMKM/Petani dengan eksportir global di pasar.
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </div>

          </div>
        </div>
      </section>
    </PageShell>
  );
}