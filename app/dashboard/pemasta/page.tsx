"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getLang, subscribeLang, toggleLang } from "@/lib/language";
import { 
  Droplet, MapPin, Calendar, Activity, TrendingUp, 
  BookOpen, FileText, Plus, Globe, Users,
  Upload, LayoutDashboard, PenSquare, LogOut, Sparkles,
  Scale, Layers, Sprout, Coins
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RegionCascade } from "@/components/ui/RegionCascade";


export default function PemastaDashboard() {
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "story-hub">("dashboard");
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [lang, setLang] = useState<"ID"|"EN">("ID");
  useEffect(() => { setLang(getLang() as "ID"|"EN"); const unsub = subscribeLang(() => setLang(getLang() as "ID"|"EN")); return unsub; }, []);

  // State Batch Log & Harga
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showRiwayat, setShowRiwayat] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [batchLoading, setBatchLoading] = useState(true);
  const [batchForm, setBatchForm] = useState({ 
    qty: "", pa: "", region: "Aceh Selatan", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan"
  });

  // State Stories
  const [stories, setStories] = useState<any[]>([]);
  const [storyLoading, setStoryLoading] = useState(true);
  
  // State form cerita
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

  // Fetch market prices dari API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/pemasta/market-prices");
        const json = await res.json();
        setBatches(
          (json.data || []).map((p: any) => ({
            id: p.batch_id,
            date: new Date(p.report_date).toLocaleDateString("id-ID", {
              weekday: "long", year: "numeric", month: "short", day: "numeric"
            }),
            qty: p.quantity_kg,
            pa: p.pa_level,
            status: p.status,
            region: p.region,
            method: p.method,
            leafAge: p.leaf_age,
            pricePerKg: p.price_per_kg,
            estimatedValue: formatCurrency(p.quantity_kg * p.price_per_kg)
          }))
        );
      } catch (err) {
        console.error("Failed to fetch market prices:", err);
      } finally {
        setBatchLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Fetch field stories dari API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/pemasta/field-stories");
        const json = await res.json();
        setStories(
          (json.data || []).map((s: any) => ({
            slug: s.slug,
            title: s.title,
            category: s.category,
            excerpt: s.excerpt,
            content: s.content,
            author: s.author,
            authorRole: s.author_role,
            publishedAt: s.published_at,
            readMinutes: s.read_minutes,
            imageUrl: s.image_url,
            featured: s.featured
          }))
        );
      } catch (err) {
        console.error("Failed to fetch field stories:", err);
      } finally {
        setStoryLoading(false);
      }
    };

    fetchStories();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.qty || !batchForm.pa || !batchForm.pricePerKg || !batchForm.date || !batchForm.region) return;
    setBatchSubmitting(true);
    try {
      const volume = Number(batchForm.qty);
      const hargaKustom = Number(batchForm.pricePerKg);
      const batchId = `BCH-${Math.floor(100 + Math.random() * 900)}`;
      const res = await fetch("/api/pemasta/market-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId, region: batchForm.region, reportDate: batchForm.date, quantityKg: volume, paLevel: Number(batchForm.pa), pricePerKg: hargaKustom, method: batchForm.method, leafAge: batchForm.leafAge }),
      });
      if (!res.ok) throw new Error();
      const formattedDate = new Date(batchForm.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
      setBatches([{ id: batchId, date: formattedDate, qty: volume, pa: Number(batchForm.pa), region: batchForm.region, method: batchForm.method, leafAge: batchForm.leafAge, pricePerKg: hargaKustom, estimatedValue: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(volume * hargaKustom) }, ...batches]);
      setBatchForm({ qty: "", pa: "", region: "", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan" });
      setShowBatchModal(false);
    } catch {
      alert("Gagal menyimpan ke server");
    } finally {
      setBatchSubmitting(false);
    }
  };

  // Handler Kirim Cerita Baru
  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.title || !storyForm.description) return;

    let finalImageUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80";
    if (storyForm.imageFile) {
      finalImageUrl = URL.createObjectURL(storyForm.imageFile);
    }

    const newStory = {
      slug: `custom-${Date.now()}`,
      title: storyForm.title,
      category: storyForm.category,
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

        <div className="border-t border-surface-container-high pt-4 space-y-2 bg-stone-50/50 -mx-5 px-5 pb-5 rounded-b-3xl">
          <Link href="/dashboard/community">
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-2 rounded-xl bg-emerald-100/50 hover:bg-emerald-100 border border-emerald-200/50 text-emerald-800 text-xs font-bold transition-colors shadow-sm">
              <Users className="w-3.5 h-3.5" /> ATSIRA Connect
            </button>
          </Link>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-surface-container-high shadow-sm">
            <div className="w-9 h-9 bg-surface-container-highest rounded-full flex items-center justify-center font-bold text-stone-700 text-sm">KP</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Kelompok Suling Jaya</p>
              <p className="text-[10px] text-stone-400">Petani Mitra ARC</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm w-full">
              <Globe className="w-3.5 h-3.5 text-amber-700" /> <span>{lang === "ID" ? "ID" : "EN"}</span>
            </button>
            <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100/50 hover:border-red-200 shadow-sm">
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── AREA KONTEN UTAMA ── */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 min-h-screen">
        
        {/* DASHBOARD TAB */}
        {activeMenu === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
              <div>
                <h1 className="text-xl font-bold text-stone-900 font-display">Log Histori Harga & Kualitas Suling</h1>
                <p className="text-xs text-stone-500">Rekam seluruh data harga kesepakatan riil lapangan untuk AI QualitySense.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowRiwayat(true)}
                  variant="secondary"
                  className="rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm border border-stone-300"
                >
                  <BookOpen className="w-4 h-4" /> Riwayat
                </Button>
                <Button onClick={() => setShowBatchModal(true)} variant="primary" className="rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm">
                  <Plus className="w-4 h-4" /> Catat Batch & Harga Baru
                </Button>
              </div>
            </div>

            {/* KARTU DATA TERBARU (HIGHLIGHTED) */}
            {batches.length > 0 && (() => {
              const latest = batches[0];
              return (
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-700/60 p-2 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-emerald-200" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Data Terbaru</p>
                        <p className="text-xs font-bold text-white">{latest.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-700/60 border border-emerald-600/40 text-emerald-200 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {latest.date}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-emerald-700/50 pt-4">
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Harga/Kg</p>
                      <p className="text-lg font-black text-white">{formatCurrency(latest.pricePerKg)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Volume</p>
                      <p className="text-lg font-black text-white">{latest.qty} Kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Kadar PA</p>
                      <p className="text-lg font-black text-amber-300">{latest.pa}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-emerald-700/50 text-xs text-emerald-300">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {latest.region}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {latest.method}</span>
                    
                  </div>
                </div>
              );
            })()}

            {/* DATA SEBELUMNYA (3 TERBARU) */}
            {batches.length > 1 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" /> 3 Data Sebelumnya
                </h2>
                <div className="grid gap-3">
                  {batches.slice(1, 4).map((b) => (
                    <Card key={b.id} className="p-4 bg-white border border-stone-200/60 hover:shadow-md transition-all rounded-xl">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-stone-800">{b.id}</span>
                            
                            <span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {b.date}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                            <span className="flex items-center gap-1 font-semibold text-stone-600"><MapPin className="w-3 h-3" /> {b.region}</span>
                            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {b.method}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] text-stone-400 uppercase font-bold">Harga</p>
                            <p className="text-xs font-bold text-stone-800">{formatCurrency(b.pricePerKg)}/Kg</p>
                            <p className="text-[10px] text-stone-500">{b.qty} Kg</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-stone-400 uppercase font-bold">PA</p>
                            <p className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">{b.pa}%</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {batches.length > 4 && (
                  <button
                    onClick={() => setShowRiwayat(true)}
                    className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-900 py-2.5 border border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl transition-all bg-emerald-50/50 hover:bg-emerald-50"
                  >
                    Lihat semua {batches.length} data riwayat →
                  </button>
                )}
              </div>
            )}

            {batches.length === 0 && !batchLoading && (
              <div className="text-center py-16 text-stone-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-bold text-sm">Belum ada data batch</p>
                <p className="text-xs mt-1">Klik "Catat Batch & Harga Baru" untuk memulai</p>
              </div>
            )}
            {batchLoading && (
              <div className="text-center py-16 text-stone-300 text-xs animate-pulse">Memuat data dari database...</div>
            )}

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
                    <label className="text-[11px] font-bold text-stone-700 block mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Wilayah Sentra Lahan</label>
                    <RegionCascade value={batchForm.region} onChange={(region) => setBatchForm(prev => ({ ...prev, region }))} />
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
                <Button type="submit" variant="primary" className="rounded-xl text-xs font-bold shadow-md" disabled={batchSubmitting}>{batchSubmitting ? "Menyimpan..." : "Simpan Data & Kirim"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL RIWAYAT */}
      {showRiwayat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl space-y-4 border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-100 text-stone-600 rounded-xl"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Riwayat Kesepakatan & Suling</h3>
                  <p className="text-[11px] text-stone-500">Semua data yang pernah diinput.</p>
                </div>
              </div>
              <button onClick={() => setShowRiwayat(false)} className="rounded-xl w-8 h-8 flex items-center justify-center border border-stone-200 hover:bg-stone-50 text-stone-500 font-bold">
                X
              </button>
            </div>
            
            {/* Filter */}
            <div className="flex flex-wrap gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
               <select 
                 className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white"
                 value={filterMonth}
                 onChange={(e) => setFilterMonth(e.target.value)}
               >
                 <option value="">Semua Bulan</option>
                 <option value="Jan">Januari</option>
                 <option value="Feb">Februari</option>
                 <option value="Mar">Maret</option>
                 <option value="Apr">April</option>
                 <option value="Mei">Mei</option>
                 <option value="Jun">Juni</option>
                 <option value="Jul">Juli</option>
                 <option value="Agt">Agustus</option>
                 <option value="Sep">September</option>
                 <option value="Okt">Oktober</option>
                 <option value="Nov">November</option>
                 <option value="Des">Desember</option>
               </select>
               
               <select 
                 className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white"
                 value={filterYear}
                 onChange={(e) => setFilterYear(e.target.value)}
               >
                 <option value="">Semua Tahun</option>
                 <option value="2026">2026</option>
                 <option value="2025">2025</option>
                 <option value="2024">2024</option>
               </select>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {batches
                .filter(b => {
                  if (!filterMonth && !filterYear) return true;
                  const matchMonth = filterMonth ? b.date.includes(filterMonth) : true;
                  const matchYear = filterYear ? b.date.includes(filterYear) : true;
                  return matchMonth && matchYear;
                })
                .map((b) => (
                <div key={b.id} className="p-4 bg-white border border-stone-200/60 hover:shadow-md transition-all rounded-xl">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-stone-800">{b.id}</span>
                        
                        <span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {b.date}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                        <span className="flex items-center gap-1 font-semibold text-stone-600"><MapPin className="w-3 h-3" /> {b.region}</span>
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {b.method}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 uppercase font-bold">Harga</p>
                        <p className="text-xs font-bold text-stone-800">{b.pricePerKg}/Kg</p>
                        <p className="text-[10px] text-stone-500">{b.qty} Kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 uppercase font-bold">PA</p>
                        <p className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">{b.pa}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {batches.filter(b => {
                  if (!filterMonth && !filterYear) return true;
                  const matchMonth = filterMonth ? b.date.includes(filterMonth) : true;
                  const matchYear = filterYear ? b.date.includes(filterYear) : true;
                  return matchMonth && matchYear;
              }).length === 0 && (
                <div className="text-center py-10 text-stone-400 text-sm">
                  Tidak ada data yang cocok dengan filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
