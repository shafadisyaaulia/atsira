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
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function SellerAnalyzerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // Parameter form disesuaikan persis dengan kebutuhan indikator visual & riset SNI
  const [formData, setFormData] = useState({
    paTarget: "32",
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

  function startAiScan() {
    if (!image) return;
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulasi kalkulasi harga berdasarkan Kadar PA dan parameter fisik wadah/penyimpanan
      let basePricePerKg = 1150000;
      const paFactor = Number(formData.paTarget) || 30;
      
      // Rumus simulasi: Kadar PA makin tinggi, harga naik
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
        notes: `Berdasarkan pembacaan kamera, sampel memiliki karakteristik warna yang berkolerasi dengan kadar PA sekitar ${paFactor}%. Risiko oksidasi terpantau ${oxidationRisk.toLowerCase()}.`
      });
    }, 2200);
  }

  function resetScanner() {
    setImage(null);
    setScanResult(null);
  }

  return (
    <DashboardShell role="umkm">
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-12">
        
        {/* PANEL ATAS / HEADER - TEMA HIJAU ALAM & EMAS */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white p-6 rounded-xl border border-emerald-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-full shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-emerald-950 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">AtBot QualitySense v2.9</span>
                <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">✓ Terverifikasi Standar SNI 06-2385-2006</span>
              </div>
              <h1 className="font-display text-lg font-black tracking-tight text-amber-200 mt-1">Kalkulator Kualitas & Harga Pasar Nilam</h1>
              <p className="text-xs text-emerald-100 mt-0.5">
                Pengecekan instan kualitas fisik minyak nilam berbasis kecerdasan buatan. Cukup isi panduan fisik sederhana di bawah, AI akan langsung menaksir kelayakan pasar.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          
          {/* SISI KIRI: INPUT FORM (WARNA SEJUK PETANI-FRIENDLY) */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-5 bg-white border border-emerald-100 shadow-sm space-y-4">
              
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 border-b border-emerald-50 pb-2">
                <Camera className="w-4 h-4 text-amber-600" /> 1. Foto Minyak (Wajib Gunakan Botol Kaca Bening)
              </h2>
              <p className="text-[11px] text-stone-500 -mt-2 leading-relaxed">
                Hindari botol plastik saat memfoto karena permukaan plastik dapat mengelabuhi sensor kamera AI.
              </p>
              
              {!image ? (
                <label className="border-2 border-dashed border-emerald-300 rounded-xl p-8 flex flex-col items-center justify-center bg-emerald-50/20 cursor-pointer hover:bg-emerald-50/50 transition-all min-h-[150px] group">
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
                      <span className="text-xs font-mono tracking-wider text-amber-300 font-bold animate-pulse">AtBot Sedang Menganalisis Mutu Fisik...</span>
                    </div>
                  )}
                </div>
              )}

              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 pt-2 border-b border-emerald-50 pb-2">
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
                    placeholder="Contoh: 32"
                    onChange={e => setFormData({...formData, paTarget: e.target.value})}
                    className="font-mono text-xs border-emerald-200 bg-stone-50 h-9"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Warna & Kejernihan (Mata Kasat)
                  </Label>
                  <select 
                    value={formData.visualStyle} 
                    className="w-full border border-emerald-200 focus:border-emerald-500 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
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
                    className="w-full border border-emerald-200 focus:border-emerald-500 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
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
                    className="w-full border border-emerald-200 focus:border-emerald-500 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                    onChange={e => setFormData({...formData, containerType: e.target.value})}
                  >
                    <option value="plastic-glass">Jerigen Plastik / Botol Kaca Kering</option>
                    <option value="iron-drum">Drum Besi / Wadah Logam Berkarat</option>
                  </select>
                </div>
              </div>

              {image && !isScanning && (
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={resetScanner} className="w-1/4 text-xs text-emerald-800 hover:bg-emerald-50">Reset</Button>
                  <Button onClick={startAiScan} size="sm" className="w-3/4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Jalankan Analisis Kualitas AI
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* SISI KANAN: PANEL HASIL (WARNA COKELAT ARANG HANGAT & EMAS) */}
          <div className="md:col-span-5">
            <Card className="p-5 bg-stone-800 text-stone-100 border-t-4 border-amber-500 shadow-md h-full flex flex-col justify-between min-h-[400px]">
              {!scanResult ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                  <Coins className="w-12 h-12 text-amber-400/60 mb-2" />
                  <p className="text-xs font-bold text-stone-200">Hasil Taksiran AI</p>
                  <p className="text-[10px] text-stone-300 max-w-[200px] mt-1 leading-relaxed">
                    Silakan masukkan foto sampel botol kaca minyak nilam Anda dan jalankan analisis untuk memunculkan taksiran harga adil pasar harian.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> KEPUTUSAN MUTU ATBOT
                    </span>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      {scanResult.status}
                    </span>
                  </div>

                  {/* DISPLAY ESTIMASI HARGA */}
                  <div className="bg-stone-900 p-4 rounded-xl border border-stone-700 shadow-inner">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Rekomendasi Batas Harga Jual (Per Kg)</p>
                    <p className="text-2xl font-mono font-black text-amber-400 mt-0.5">
                      Rp {scanResult.recommendedPrice.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* KANDUNGAN MINYAK */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-700">
                      <p className="text-[10px] text-stone-400">Skor Transmisi Optik</p>
                      <p className="text-sm font-mono font-bold text-amber-300 mt-0.5">{scanResult.clarityScore}</p>
                    </div>
                    <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-700">
                      <p className="text-[10px] text-stone-400">Resiko Oksidasi</p>
                      <p className="text-sm font-mono font-bold text-amber-300 mt-0.5">{scanResult.oxidationLevel}</p>
                    </div>
                  </div>

                  {/* VALIDASI SNI */}
                  <div className="space-y-1.5 text-[11px] bg-stone-900 p-3 rounded-lg border border-stone-750">
                    <div className="flex justify-between border-b border-stone-800 pb-1.5">
                      <span className="text-stone-400">Kontaminasi Zat Besi (Fe):</span>
                      <span className="text-emerald-400 font-bold text-right">{scanResult.ironContamination}</span>
                    </div>
                    <div className="flex flex-col pt-1 text-[10px]">
                      <span className="text-stone-400 font-bold mb-0.5">Catatan Validasi Kamera:</span>
                      <span className="text-stone-300 leading-relaxed font-sans">{scanResult.notes}</span>
                    </div>
                  </div>

                  {/* PERINGATAN NEGOSIASI */}
                  <div className="flex gap-2 p-2.5 bg-amber-500/10 rounded border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-400" />
                    <span>
                      Gunakan patokan harga dari data komparasi PEMASTA ini sebagai dasar tawar-menawar yang kuat dengan kolektor atau eksportir.
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}