"use client";

import { useState } from "react";
import { 
  Activity, Award, Beaker, CheckCircle2, 
  FileText, FlaskConical, Layers, LogOut, MapPin, 
  Plus, Sparkles, Sprout, XCircle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Data Antrean Verifikasi Lab Minyak Nilam (Sinkron dengan Log Lapangan Pemasta)
const MOCK_LAB_QUEUE = [
  {
    id: "BCH-092",
    nodeName: "Kelompok Suling Jaya",
    region: "Aceh Selatan",
    variety: "Nilam Tapaktuan (Patchouli)",
    volume: "45 Kg",
    submittedAt: "Rabu, 08 Jul 2026",
    aiPredictionPA: 32.4,
    status: "Menunggu Uji Kromatografi (GC-MS)"
  },
  {
    id: "BCH-071",
    nodeName: "Koperasi Nilam Babahrot",
    region: "Aceh Jaya",
    variety: "Nilam Lhokseumawe",
    volume: "50 Kg",
    submittedAt: "Senin, 13 Mei 2026",
    aiPredictionPA: 30.5,
    status: "Menunggu Uji Kromatografi (GC-MS)"
  }
];

// Data Arsip Hasil Riset & Varietas ARC
const MOCK_RESEARCH_LOGS = [
  {
    id: "RSH-09",
    title: "Optimasi Distilasi Uap Tekanan Rendah pada Varietas Tapaktuan",
    author: "Dr. Ir. Ahmad Syakir (ARC)",
    date: "Juni 2026",
    category: "Teknologi Suling",
    avgPA: "33.5%"
  },
  {
    id: "RSH-08",
    title: "Analisis Korelasi Unsur Hara Tanah Ultisol Terhadap Kadar Patchouli Alcohol",
    author: "Prof. Marlina (ARC)",
    date: "Mei 2026",
    category: "Agronomi Nilam",
    avgPA: "31.2%"
  }
];

export default function ArcDashboard() {
  const [activeMenu, setActiveMenu] = useState<"verifikasi" | "riset-hub">("verifikasi");
  
  // State Antrean Uji Lab
  const [queue, setQueue] = useState(MOCK_LAB_QUEUE);
  
  // State Riwayat Riset
  const [researches, setResearches] = useState(MOCK_RESEARCH_LOGS);
  
  // State Form Riset Baru
  const [showRisetModal, setShowRisetModal] = useState(false);
  const [risetForm, setRisetForm] = useState({ title: "", category: "Teknologi Suling", avgPA: "" });

  // Fungsi Aksi Peneliti (Menyetujui/Menolak Kualitas Minyak Petani)
  const handleVerify = (id: string, action: "APPROVE" | "REJECT") => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: action === "APPROVE" ? "Terverifikasi ARC (Sertifikat Rilis)" : "Ditolak (Kadar PA Tidak Sesuai)"
        };
      }
      return item;
    }));
  };

  // Fungsi Tambah Log Jurnal Riset
  const handleCreateRiset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!risetForm.title || !risetForm.avgPA) return;

    const newRiset = {
      id: `RSH-${Math.floor(10 + Math.random() * 90)}`,
      title: risetForm.title,
      author: "Tim Riset Atsira ARC",
      date: "Juli 2026",
      category: risetForm.category,
      avgPA: `${risetForm.avgPA}%`
    };

    setResearches([newRiset, ...researches]);
    setRisetForm({ title: "", category: "Teknologi Suling", avgPA: "" });
    setShowRisetModal(false);
  };

  return (
    <div className="flex min-h-screen bg-stone-50/50 text-stone-900 font-body">
      
      {/* ── SIDEBAR NAVIGASI BERSAMA ── */}
      <aside className="w-64 bg-white border-r border-stone-200 p-5 flex flex-col justify-between hidden md:flex fixed h-full z-30">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-xl bg-amber-900 flex items-center justify-center text-white font-bold font-display text-sm">ARC</div>
            <div>
              <span className="font-display font-bold text-stone-900 text-sm block tracking-wide">ATSIRA ARC</span>
              <span className="text-[10px] text-amber-800 font-semibold block uppercase tracking-wider">Laboratorium & Riset</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveMenu("verifikasi")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                activeMenu === "verifikasi" ? "bg-amber-50 text-amber-900 border border-amber-100/50 shadow-sm" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              <FlaskConical className="w-4 h-4" /> Uji Mutu & Verifikasi
            </button>
            <button
              onClick={() => setActiveMenu("riset-hub")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                activeMenu === "riset-hub" ? "bg-amber-50 text-amber-900 border border-amber-100/50 shadow-sm" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              <Beaker className="w-4 h-4" /> Log & Hasil Riset ARC
            </button>
          </nav>
        </div>

        <div className="border-t border-stone-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center font-bold text-amber-900 text-xs">LAB</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Dr. Syakir & Tim</p>
              <p className="text-[10px] text-stone-400">Analis GC-MS Utama</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── AREA KONTEN UTAMA ── */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 min-h-screen">
        
        {/* TAB 1: UJI MUTU & VERIFIKASI */}
        {activeMenu === "verifikasi" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-stone-200/60 pb-5">
              <h1 className="text-xl font-bold text-stone-900 font-display">Verifikasi Sampel Kromatografi (GC-MS)</h1>
              <p className="text-xs text-stone-500">Validasi silang kode batch suling petani dengan instrumen laboratorium untuk jaminan sertifikat kualitas ekspor.</p>
            </div>

            {/* Indikator Dashboard Riset */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="p-4 bg-white border border-stone-200/50 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl"><Activity className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Standar SNI Mutu</p>
                  <p className="text-sm font-bold text-stone-800">Kadar PA Min. 30%</p>
                </div>
              </Card>
              <Card className="p-4 bg-white border border-stone-200/50 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Belum Diperiksa</p>
                  <p className="text-sm font-bold text-stone-800">{queue.filter(q => q.status.includes("Menunggu")).length} Sampel Fisik</p>
                </div>
              </Card>
              <Card className="p-4 bg-white border border-stone-200/50 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 text-blue-800 rounded-xl"><Award className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Akurasi Sensor AI</p>
                  <p className="text-sm font-bold text-stone-800">98.4% Keabsahan</p>
                </div>
              </Card>
            </div>

            {/* Antrean Sampel Masuk */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-stone-500 flex items-center gap-2 uppercase tracking-wider">
                <FlaskConical className="w-4 h-4 text-amber-800" /> Manifes Sampel Masuk Dari Node Lapangan
              </h2>

              <div className="space-y-3">
                {queue.map((item) => (
                  <Card key={item.id} className="p-5 bg-white border border-stone-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">{item.id}</span>
                          <span className="text-sm font-bold text-stone-800">{item.nodeName}</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                            item.status.includes("Terverifikasi") ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            item.status.includes("Ditolak") ? "bg-red-50 text-red-700 border-red-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
                          <span className="flex items-center gap-1 font-semibold text-stone-600"><MapPin className="w-3.5 h-3.5" /> {item.region}</span>
                          <span className="flex items-center gap-1"><Sprout className="w-3.5 h-3.5" /> {item.variety}</span>
                          <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Jml: {item.volume}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-stone-100 pt-3 lg:pt-0">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] font-bold text-stone-400 block uppercase">Analisis Awal AI</span>
                          <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{item.aiPredictionPA}% PA</span>
                        </div>

                        {item.status.includes("Menunggu") ? (
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={() => handleVerify(item.id, "REJECT")}
                              variant="secondary" 
                              className="border-stone-200 hover:bg-red-50 text-red-600 rounded-xl text-xs py-2 px-3 flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Tolak
                            </Button>
                            <Button 
                              onClick={() => handleVerify(item.id, "APPROVE")}
                              className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs py-2 px-3 flex items-center gap-1 shadow-sm font-semibold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Rilis Sertifikat
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 italic font-medium bg-stone-50 px-3 py-1 rounded-xl">Selesai Ditinjau</span>
                        )}
                      </div>

                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOG & HASIL RISET ARC */}
        {activeMenu === "riset-hub" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
              <div>
                <h1 className="text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  Jurnal & Log Riset Atsira <Sparkles className="w-4 h-4 text-amber-500" />
                </h1>
                <p className="text-xs text-stone-500">Pusat pencatatan riset botani, efisiensi bahan bakar penyulingan, serta standarisasi fitokimia.</p>
              </div>
              <Button onClick={() => setShowRisetModal(true)} className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm">
                <Plus className="w-4 h-4" /> Publikasi Temuan Baru
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {researches.map((res) => (
                <Card key={res.id} className="p-5 bg-white border border-stone-200/60 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100">
                        {res.category}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 font-semibold">{res.id}</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Oleh: <span className="font-semibold text-stone-700">{res.author}</span> — {res.date}
                    </p>
                  </div>
                  <div className="border-t border-stone-100 mt-4 pt-3 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Rerata Nilai Rendemen PA:</span>
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">{res.avgPA}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL CATAT RISET BARU ── */}
      {showRisetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-stone-100">
            <div className="flex items-start gap-3 border-b border-stone-100 pb-3">
              <div className="p-2 bg-amber-50 text-amber-800 rounded-xl"><Beaker className="w-5 h-5" /></div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Form Log Temuan Riset</h3>
                <p className="text-xs text-stone-400">Publikasikan temuan lab terbaru ke repositori ekosistem Atsira.</p>
              </div>
            </div>

            <form onSubmit={handleCreateRiset} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Judul Riset / Makalah Singkat</label>
                <Input 
                  type="text" 
                  placeholder="Pengaruh metode pemanenan bertahap..." 
                  className="text-xs rounded-xl"
                  value={risetForm.title}
                  onChange={(e) => setRisetForm({...risetForm, title: e.target.value})}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Kategori Riset</label>
                  <select 
                    className="w-full text-xs border border-stone-200 rounded-xl p-2.5 bg-white focus:outline-amber-800"
                    value={risetForm.category}
                    onChange={(e) => setRisetForm({...risetForm, category: e.target.value})}
                  >
                    <option value="Teknologi Suling">Teknologi Suling</option>
                    <option value="Agronomi Nilam">Agronomi Nilam</option>
                    <option value="Fitokimia Lab">Fitokimia Lab</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">PA Terukur (%)</label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="32.5" 
                    className="text-xs rounded-xl font-mono"
                    value={risetForm.avgPA}
                    onChange={(e) => setRisetForm({...risetForm, avgPA: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-stone-100">
                <Button type="button" variant="secondary" onClick={() => setShowRisetModal(false)} className="rounded-xl text-xs">Batal</Button>
                <Button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md">Simpan ke Jurnal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}