"use client";

import { useState } from "react";
import { 
  Droplet, MapPin, Calendar, Activity, TrendingUp, 
  BookOpen, FileText, Plus, 
  Upload, LayoutDashboard, PenSquare, LogOut, Sparkles,
  Scale, Layers, Sprout, Coins
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// ── 🔗 IMPOR REPOSITORI DATA NILAM STORY ASLI ──
import { MAGAZINE_ARTICLES } from "@/lib/mock/ecosystem";

const MOCK_BATCHES = [
  { 
    id: "BCH-092", 
    date: "Rabu, 08 Jul 2026", 
    qty: 45, 
    pa: 32.4, 
    status: "Terverifikasi ARC", 
    region: "Aceh Selatan", 
    method: "Uap (Steam Distressed)",
    leafAge: "6 Bulan",
    pricePerKg: 1450000,
    estimatedValue: "Rp 65.250.000"
  },
  { 
    id: "BCH-071", 
    date: "Senin, 13 Mei 2026", 
    qty: 50, 
    pa: 30.5, 
    status: "Terverifikasi AI", 
    region: "Aceh Jaya", 
    method: "Air & Uap (Hydro)",
    leafAge: "5 Bulan",
    pricePerKg: 1380000,
    estimatedValue: "Rp 69.000.000"
  },
];

export default function PemastaDashboard() {
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "story-hub">("dashboard");

  // State Batch Log & Harga
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batches, setBatches] = useState(MOCK_BATCHES);
  const [batchForm, setBatchForm] = useState({ 
    qty: "", pa: "", region: "Aceh Selatan", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan"
  });

  // State Stories menggunakan data mock ekosistem
  const [stories, setStories] = useState(MAGAZINE_ARTICLES);
  
  // State form cerita diperbarui untuk menampung objek File asli
  const [storyForm, setStoryForm] = useState<{
    title: string;
    category: string;
    description: string;
    imageFile: File | null;
  }>({ 
    title: "", 
    category: "Kegiatan Komunitas", 
    description: "", 
    imageFile: null 
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.qty || !batchForm.pa || !batchForm.pricePerKg || !batchForm.date) return;

    const volume = Number(batchForm.qty);
    const hargaKustom = Number(batchForm.pricePerKg);
    const totalNilai = volume * hargaKustom;

    const formattedDate = new Date(batchForm.date).toLocaleDateString("id-ID", {
      weekday: "long", year: "numeric", month: "short", day: "numeric"
    });

    const newBatch = {
      id: `BCH-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      qty: volume,
      pa: Number(batchForm.pa),
      status: "Verifikasi AI QualitySense",
      region: batchForm.region,
      method: batchForm.method,
      leafAge: batchForm.leafAge,
      pricePerKg: hargaKustom,
      estimatedValue: formatCurrency(totalNilai)
    };

    setBatches([newBatch, ...batches]);
    setBatchForm({ qty: "", pa: "", region: "Aceh Selatan", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan" });
    setShowBatchModal(false);
  };

  // Handler Kirim Cerita Baru dengan File Foto Unggahan
  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title || !storyForm.description) return;

    // Generate blob URL lokal jika pengguna mengunggah file foto
    let finalImageUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80";
    if (storyForm.imageFile) {
      finalImageUrl = URL.createObjectURL(storyForm.imageFile);
    }

    const newStory = {
      slug: `custom-${Date.now()}`,
      title: storyForm.title,
      category: storyForm.category as any,
      excerpt: storyForm.description,
      content: [storyForm.description],
      author: "Kelompok Suling Jaya",
      authorRole: "Pemasta Node",
      publishedAt: new Date().toISOString().split('T')[0],
      readMinutes: 3,
      imageUrl: finalImageUrl,
      featured: false
    };

    setStories([newStory, ...stories]);
    
    // Reset form cerita ke kondisi kosong semula
    setStoryForm({ title: "", category: "Kegiatan Komunitas", description: "", imageFile: null });
  };

  return (
    <div className="flex min-h-screen bg-stone-50/50 text-stone-900 font-body">
      
      {/* ── SIDEBAR NAVIGASI ── */}
      <aside className="w-64 bg-white border-r border-stone-200 p-5 flex flex-col justify-between hidden md:flex fixed h-full z-30">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold font-display text-sm">A</div>
            <div>
              <span className="font-display font-bold text-stone-900 text-sm block tracking-wide">ATSIRA</span>
              <span className="text-[10px] text-emerald-800 font-semibold block uppercase tracking-wider">Pemasta Node</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                activeMenu === "dashboard" ? "bg-emerald-50 text-emerald-900 border border-emerald-100/50 shadow-sm" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dasbor Ringkasan
            </button>
            <button
              onClick={() => setActiveMenu("story-hub")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                activeMenu === "story-hub" ? "bg-emerald-50 text-emerald-900 border border-emerald-100/50 shadow-sm" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              <PenSquare className="w-4 h-4" /> Nilam Story Hub
            </button>
          </nav>
        </div>

        <div className="border-t border-stone-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-700 text-sm">KP</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Kelompok Suling Jaya</p>
              <p className="text-[10px] text-stone-400">Petani Mitra ARC</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── AREA KONTEN UTAMA ── */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 min-h-screen">
        
        {/* DASHBOARD TAB */}
        {activeMenu === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
              <div>
                <h1 className="text-xl font-bold text-stone-900 font-display">Log Histori Harga & Kualitas Suling</h1>
                <p className="text-xs text-stone-500">Rekam seluruh data harga kesepakatan riil lapangan untuk AI QualitySense.</p>
              </div>
              <Button onClick={() => setShowBatchModal(true)} variant="primary" className="rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm">
                <Plus className="w-4 h-4" /> Catat Batch & Harga Baru
              </Button>
            </div>

            {/* List Riwayat Batch */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2 uppercase tracking-wider"><FileText className="w-4 h-4 text-emerald-800" /> Lembar Verifikasi Batch & Analisis AI</h2>
              <div className="grid gap-4">
                {batches.map((b) => (
                  <Card key={b.id} className="p-5 bg-white border border-stone-200/60 hover:shadow-md transition-all rounded-2xl">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-bold text-stone-800">{b.id}</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{b.status}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
                          <span className="flex items-center gap-1 font-semibold text-stone-600"><MapPin className="w-3.5 h-3.5 text-stone-500" /> {b.region}</span>
                          <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {b.method}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 justify-between lg:justify-end border-t lg:border-t-0 border-stone-100 pt-3 lg:pt-0">
                        <div className="text-left lg:text-right">
                          <p className="text-[10px] text-stone-400 font-bold uppercase">Harga & Volume</p>
                          <p className="text-xs text-stone-500">{formatCurrency(b.pricePerKg)}/Kg</p>
                          <p className="text-sm font-bold text-stone-800">{b.qty} Kg ({b.estimatedValue})</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-stone-400 font-bold uppercase">Kadar PA</p>
                          <p className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded font-mono">{b.pa}%</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NILAM STORY HUB TAB */}
        {activeMenu === "story-hub" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-stone-200/60 pb-5">
              <h1 className="text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                Nilam Story Hub <Sparkles className="w-4 h-4 text-amber-500" />
              </h1>
              <p className="text-xs text-stone-500">Ekosistem jurnalisme petani. Unggah dokumentasi foto panen Anda langsung dari galeri lokal.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* FORM SEBELAH KIRI DENGAN UPLOAD FILE AKTIF */}
              <Card className="p-5 bg-white border border-stone-200/60 rounded-2xl shadow-sm space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Tulis Dokumentasi Baru</h2>
                  <p className="text-[11px] text-stone-400">Pilih berkas foto riil dari hp/pc untuk disematkan.</p>
                </div>

                <form onSubmit={handleCreateStory} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">Judul Kegiatan / Rembug</label>
                    <Input 
                      type="text" 
                      placeholder="Jumpa Petani Nilam Aceh Selatan..." 
                      className="text-xs rounded-xl"
                      value={storyForm.title}
                      onChange={(e) => setStoryForm({...storyForm, title: e.target.value})}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">Kategori</label>
                    <select 
                      className="w-full text-xs border border-stone-200 rounded-xl p-2.5 bg-white focus:outline-emerald-800"
                      value={storyForm.category}
                      onChange={(e) => setStoryForm({...storyForm, category: e.target.value})}
                    >
                      <option value="Kegiatan Komunitas">Kegiatan Komunitas</option>
                      <option value="Teknologi Suling">Teknologi Suling</option>
                    </select>
                  </div>

                  {/* ── 📸 PENGGANTI PATH: KOTAK UPLOAD FILE FOTO UTAMA ── */}
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">Upload Foto Kegiatan</label>
                    <div className="mt-1 border-2 border-dashed border-stone-200 hover:border-emerald-700 transition-colors rounded-xl p-4 text-center cursor-pointer relative bg-stone-50/50">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setStoryForm({ ...storyForm, imageFile: files[0] });
                          }
                        }}
                      />
                      <Upload className="w-5 h-5 mx-auto text-stone-400 mb-1.5" />
                      <p className="text-[11px] font-semibold text-stone-600">
                        {storyForm.imageFile ? storyForm.imageFile.name : "Klik atau seret file gambar ke sini"}
                      </p>
                      <p className="text-[9px] text-stone-400 mt-0.5">Mendukung PNG, JPG atau JPEG</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">Narasi Cerita</label>
                    <textarea 
                      rows={4} 
                      placeholder="Tuliskan catatan rembug, kesepakatan harga, atau hasil penyulingan..."
                      className="w-full text-xs border border-stone-200 rounded-xl p-3 focus:outline-emerald-800 bg-white"
                      value={storyForm.description}
                      onChange={(e) => setStoryForm({...storyForm, description: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" variant="primary" className="w-full rounded-xl text-xs py-2.5 font-bold shadow-sm">
                    Terbitkan Cerita Baru
                  </Button>
                </form>
              </Card>

              {/* FEED SEBELAH KANAN */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-800" /> Cerita Dari Mock Ecosystem ({stories.length})
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {stories.map((story) => (
                    <Card key={story.slug} className="bg-white border border-stone-200/60 overflow-hidden rounded-2xl flex flex-col justify-between shadow-sm group hover:shadow-md transition-all duration-200">
                      <div>
                        <div className="aspect-video relative overflow-hidden bg-stone-100 border-b border-stone-100">
                          <img 
                            src={story.imageUrl || "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80"} 
                            alt={story.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                          <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-[9px] text-white px-2 py-0.5 rounded font-bold uppercase">
                            {String(story.category)}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <span className="text-[10px] text-stone-400 font-medium block flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {story.publishedAt}
                          </span>
                          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
                            {story.title}
                          </h3>
                          <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                            {story.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <div className="border-t border-stone-50 pt-2.5 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-800 font-bold truncate max-w-[70%]">
                            {story.author} ({story.authorRole || "Fasil"})
                          </span>
                          <span className="text-stone-400 font-medium underline">Baca ({story.readMinutes}m)</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* MODAL INPUT BATCH (DASHBOARD) */}
      {showBatchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3 border-b border-stone-100 pb-3">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl"><Sparkles className="w-5 h-5" /></div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Form Transaksi Hasil Suling</h3>
                <p className="text-xs text-stone-400">Input parameter fisik untuk memetakan performa tren harga komoditas wilayah.</p>
              </div>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Tanggal Kesepakatan / Suling</label>
                  <Input type="date" value={batchForm.date} onChange={(e) => setBatchForm({...batchForm, date: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Wilayah Sentra Lahan</label>
                  <select className="w-full text-xs border border-stone-200 rounded-xl p-2.5 bg-white" value={batchForm.region} onChange={(e) => setBatchForm({...batchForm, region: e.target.value})}>
                    <option value="Aceh Selatan">Aceh Selatan</option>
                    <option value="Aceh Jaya">Aceh Jaya</option>
                    <option value="Aceh Barat Daya">Aceh Barat Daya</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 border-t border-stone-100 pt-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1"><Scale className="w-3 h-3 inline mr-0.5" /> Volume (Kg)</label>
                  <Input type="number" placeholder="45" value={batchForm.qty} onChange={(e) => setBatchForm({...batchForm, qty: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1"><Activity className="w-3 h-3 inline mr-0.5" /> Kadar PA (%)</label>
                  <Input type="number" step="0.01" placeholder="32.4" value={batchForm.pa} onChange={(e) => setBatchForm({...batchForm, pa: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1"><Coins className="w-3 h-3 inline mr-0.5" /> Harga / Kg (Rp)</label>
                  <Input type="number" placeholder="1450000" value={batchForm.pricePerKg} onChange={(e) => setBatchForm({...batchForm, pricePerKg: e.target.value})} required />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-stone-100">
                <Button type="button" variant="secondary" onClick={() => setShowBatchModal(false)} className="rounded-xl text-xs">Batal</Button>
                <Button type="submit" variant="primary" className="rounded-xl text-xs font-bold shadow-md">Simpan Data & Kirim</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}