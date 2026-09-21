const fs = require('fs');

const content = `"use client";

import { useState } from "react";
import { Sparkles, Upload, Camera, RefreshCw, AlertTriangle, Droplet, Coins, Clock, Archive, CheckCircle2, FileText, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SellerAnalyzerPage() {
  const supabase = createSupabaseBrowserClient();
  const { user } = useAuthStore();
  
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [formData, setFormData] = useState({ paTarget: "", visualStyle: "clear-yellow", storageDuration: "new", containerType: "plastic-glass" });

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result as string); setScanResult(null); setScanError(null); };
      reader.readAsDataURL(file);
    }
  }

  async function startAiScan() {
    const pa = Number(formData.paTarget);
    if (!pa || pa <= 0 || pa > 100) { setScanError("Masukkan nilai kadar PA yang valid (1-100%)."); return; }
    setIsScanning(true); setScanResult(null); setScanError(null);
    try {
      const res = await fetch("/api/analyzer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paActual: pa }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menjalankan analisis");
      setScanResult(json.result);
      setDataSource(json.dataSource || null);
    } catch (err: any) {
      setScanError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsScanning(false);
    }
  }

  async function saveToMyProducts() {
    if (!user) { alert("Login diperlukan"); return; }
    if (!scanResult) return;
    setIsSaving(true);
    
    const shortId = "BCH-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    const { error } = await supabase.from("products").insert([
      {
        title: "Minyak Nilam Mentah - " + scanResult.grade,
        price: scanResult.recommendedPriceMin,
        stock: 10,
        unit: "kg",
        category: "Minyak Mentah (Crude Oil)",
        image_url: image || "/images/products/minyak nilam.png",
        is_raw: true,
        seller_id: user.id,
        qr_batch_id: shortId,
        is_verified: true
      }
    ]);

    setIsSaving(false);
    if (error) {
      alert("Gagal menyimpan ke My Products: " + error.message);
    } else {
      alert("Berhasil disimpan! Label atSira Verified telah ditambahkan.");
      window.location.href = "/dashboard/seller/produk";
    }
  }

  function resetScanner() { setImage(null); setScanResult(null); setScanError(null); setDataSource(null); setFormData({ ...formData, paTarget: "" }); }

  const gradeColor: Record<string, string> = { "Grade A": "text-emerald-400", "Grade B": "text-amber-300", "Grade C": "text-orange-400" };
  const gradeLabel: Record<string, string> = { "Grade A": "MUTU A - SUPER / EKSPOR", "Grade B": "MUTU B - LOKAL TOP", "Grade C": "MUTU C - STANDARD" };
  const canScan = formData.paTarget.trim() !== "" && !isScanning;

  return (
    <DashboardShell role="umkm">
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-12">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white p-6 rounded-xl border border-emerald-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-emerald-950 p-2.5 rounded-full shadow-inner"><Sparkles className="w-6 h-6 animate-pulse" /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-emerald-950 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">AtBot QualitySense v3.0</span>
                <span className="text-[11px] text-amber-300 font-medium">Terverifikasi Standar SNI 06-2385-2006</span>
              </div>
              <h1 className="font-display text-lg font-black tracking-tight text-amber-200 mt-1">Kalkulator Kualitas &amp; Harga Pasar Nilam</h1>
              <p className="text-xs text-emerald-100 mt-0.5">Masukkan kadar PA minyak nilam Anda. Sistem akan menghitung grade dan rekomendasi harga adil berdasarkan data harga terbaru dari Pemasta.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-4">
            <Card className="p-5 bg-white border border-emerald-100 shadow-sm space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 border-b border-emerald-50 pb-2">
                  <Camera className="w-4 h-4 text-amber-600" /> 1. Foto Minyak <span className="text-stone-400 font-normal normal-case">(Opsional)</span>
                </h2>
                <p className="text-[11px] text-stone-500 mt-1 mb-2">Foto hanya untuk dokumentasi. Hindari botol plastik.</p>
                {!image ? (
                  <label className="border-2 border-dashed border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center bg-emerald-50/20 cursor-pointer hover:bg-emerald-50/50 transition-all min-h-[100px] group">
                    <Upload className="w-6 h-6 text-emerald-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-emerald-800">Ambil Foto atau Pilih Gambar Botol</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-100 bg-stone-50 h-36 flex items-center justify-center">
                    <img src={image} alt="Sampel Nilam" className="h-full object-contain" />
                    <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-stone-800/70 text-white text-[10px] px-2 py-0.5 rounded">Hapus</button>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 border-b border-emerald-50 pb-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-600" /> 2. Indikator Kadar PA &amp; Kondisi Fisik
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Droplet className="w-3.5 h-3.5 text-emerald-600" /> Berapa Kadar PA (%) Minyak Anda? <span className="text-red-500">*</span>
                    </Label>
                    <Input type="number" value={formData.paTarget} placeholder="Contoh: 32" min={1} max={100}
                      onChange={e => setFormData({...formData, paTarget: e.target.value})}
                      className="font-mono text-xs border-emerald-200 bg-stone-50 h-9" />
                    <p className="text-[10px] text-stone-400 mt-1">Grade A &ge;32% &middot; Grade B 30-31.9% &middot; Grade C &lt;30%</p>
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Warna &amp; Kejernihan (Mata Kasat)
                    </Label>
                    <select value={formData.visualStyle} className="w-full border border-emerald-200 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                      onChange={e => setFormData({...formData, visualStyle: e.target.value})}>
                      <option value="clear-yellow">Bening / Kuning Cerah Bersih (Bebas Endapan)</option>
                      <option value="cloudy-dark">Keruh / Cokelat Tua Gelap (Ada Endapan Besi)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> Sudah Berapa Lama Minyak Disimpan?
                    </Label>
                    <select value={formData.storageDuration} className="w-full border border-emerald-200 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                      onChange={e => setFormData({...formData, storageDuration: e.target.value})}>
                      <option value="new">Baru Disuling (Kurang dari 1 Bulan)</option>
                      <option value="old">Sudah Lama Disimpan (Lebih dari 6 Bulan)</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                      <Archive className="w-3.5 h-3.5 text-emerald-600" /> Apa Jenis Wadah Penyimpanannya?
                    </Label>
                    <select value={formData.containerType} className="w-full border border-emerald-200 bg-stone-50 rounded-md text-xs p-2 outline-none h-9"
                      onChange={e => setFormData({...formData, containerType: e.target.value})}>
                      <option value="plastic-glass">Jerigen Plastik / Botol Kaca Kering</option>
                      <option value="iron-drum">Drum Besi / Wadah Logam Berkarat</option>
                    </select>
                  </div>
                </div>
              </div>

              {scanError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{scanError}</p>}

              <div className="flex gap-2 pt-1">
                <Button variant="secondary" size="sm" onClick={resetScanner} className="w-1/4 text-xs text-emerald-800 hover:bg-emerald-50 bg-stone-100">Reset</Button>
                <Button onClick={startAiScan} disabled={!canScan} size="sm"
                  className="w-3/4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md">
                  {isScanning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis...</> : <><Sparkles className="w-4 h-4 text-amber-300" /> Jalankan Analisis QualitySense</>}
                </Button>
              </div>
            </Card>
          </div>

          <div className="md:col-span-5">
            <Card className="p-5 bg-stone-800 text-stone-100 border-t-4 border-amber-500 shadow-md h-full flex flex-col justify-between min-h-[400px]">
              {!scanResult ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                  <Coins className="w-12 h-12 text-amber-400/60 mb-2" />
                  <p className="text-xs font-bold text-stone-200">Hasil Taksiran QualitySense</p>
                  <p className="text-[10px] text-stone-300 max-w-[200px] mt-1 leading-relaxed">Masukkan kadar PA dan jalankan analisis untuk memunculkan grade dan taksiran harga adil berdasarkan data Pemasta.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> KEPUTUSAN MUTU QUALITYSENSE</span>
                    <span className={`bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold ${gradeColor[scanResult.grade] || "text-amber-300"}`}>
                      {gradeLabel[scanResult.grade] || scanResult.grade}
                    </span>
                  </div>
                  <div className="bg-stone-900/60 px-4 py-3 rounded-xl border border-stone-700 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Kadar PA Dianalisis</span>
                    <span className="text-xl font-mono font-black text-emerald-400">{scanResult.paLevel}%</span>
                  </div>
                  <div className="bg-stone-900 p-4 rounded-xl border border-stone-700 shadow-inner">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Rekomendasi Harga Jual (Per Kg)</p>
                    <p className="text-2xl font-mono font-black text-amber-400 mt-1">Rp {scanResult.recommendedPriceMin.toLocaleString("id-ID")}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">s/d Rp {scanResult.recommendedPriceMax.toLocaleString("id-ID")} / kg</p>
                    {dataSource && <p className="text-[9px] text-stone-500 mt-1.5 leading-tight">Sumber harga: {dataSource}</p>}
                  </div>
                  {scanResult.improvementTips?.length > 0 && (
                    <div className="space-y-1.5 text-[11px] bg-stone-900 p-3 rounded-lg border border-stone-700">
                      <p className="text-stone-400 font-bold mb-1">Tips Peningkatan Mutu:</p>
                      {scanResult.improvementTips.map((tip: string, i: number) => <p key={i} className="text-stone-300 leading-relaxed">- {tip}</p>)}
                    </div>
                  )}
                  <div className="flex gap-2 p-2.5 bg-amber-500/10 rounded border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Gunakan patokan harga ini sebagai dasar negosiasi yang kuat. Harga dihitung dari data harga terbaru Pemasta.</span>
                  </div>
                  <Button 
                    onClick={saveToMyProducts} 
                    disabled={isSaving}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    {isSaving ? "Menyimpan..." : "Simpan ke My Products (atSira Verified)"}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
`;

fs.writeFileSync('app/dashboard/seller/qualitysense/page.tsx', content, 'utf8');
