"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare, ThumbsUp, Send, Users, Plus, Hash,
  Leaf, Award, ChevronRight, Loader2, X, ShieldAlert,
  FileText, Globe, Lock
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { ROLE_COLOR } from "@/lib/chat-consts";
import { useAuthStore } from "@/lib/store";

// ─── Tipe data ────────────────────────────────────────────────────────────────
interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  is_public: boolean;
  member_count: number;
  created_by: string;
  created_at: string;
}

interface Message {
  id: string;
  community_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  likes: number;
  created_at: string;
}

// ─── Konstanta ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Semua", "Petani & Penyuling", "UMKM & Buyer", "PEMASTA", "ARC-USK", "Umum"];

const SEED_COMMUNITIES: Community[] = [
  { id: "petani-aceh", name: "Petani Nilam Aceh", description: "Grup diskusi khusus petani dan penyuling minyak nilam seluruh Aceh.", category: "Petani & Penyuling", is_public: true, member_count: 84, created_by: "ATSIRA", created_at: "" },
  { id: "umkm-nilam", name: "UMKM Produk Nilam", description: "Forum bagi UMKM yang mengolah minyak nilam menjadi produk jadi seperti parfum, sabun, dan aromaterapi.", category: "UMKM & Buyer", is_public: true, member_count: 47, created_by: "ATSIRA", created_at: "" },
  { id: "pemasta-hub", name: "PEMASTA Hub", description: "Ruang koordinasi antar anggota PEMASTA — update harga lapangan, temuan anomali, dan rembug komunitas.", category: "PEMASTA", is_public: true, member_count: 31, created_by: "ATSIRA", created_at: "" },
  { id: "harga-pasar", name: "Info Harga Pasar", description: "Update harga minyak nilam harian dari berbagai wilayah. Semua role boleh berbagi informasi.", category: "Umum", is_public: true, member_count: 120, created_by: "ATSIRA", created_at: "" },
  { id: "tips-suling", name: "Tips & Teknik Penyulingan", description: "Berbagi pengalaman penyulingan, troubleshooting, dan inovasi teknologi produksi.", category: "Petani & Penyuling", is_public: true, member_count: 62, created_by: "ATSIRA", created_at: "" },
  { id: "arc-riset", name: "ARC-USK Publikasi Riset", description: "Kanal resmi ARC-USK untuk berbagi hasil penelitian, dataset, dan informasi uji laboratorium.", category: "ARC-USK", is_public: true, member_count: 28, created_by: "ATSIRA", created_at: "" },
];

const SEED_MESSAGES: Record<string, Message[]> = {
  "petani-aceh": [
    { id: "1", community_id: "petani-aceh", sender_name: "Pak Suryadi", sender_role: "Petani", content: "Rekan-rekan, untuk musim penghujan ini tips menjaga kualitas daun nilam sebelum disuling gimana ya? Takut rendemen turun.", likes: 8, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "2", community_id: "petani-aceh", sender_name: "Ibu Nurul (Gayo)", sender_role: "Petani", content: "Biasanya saya layu dulu 2-3 hari di tempat teduh, jangan kena hujan langsung. Kadar PA tetap bagus.", likes: 12, created_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  "harga-pasar": [
    { id: "3", community_id: "harga-pasar", sender_name: "Teuku Malik", sender_role: "PEMASTA", content: "Update Aceh Jaya: harga penyulingan stabil Rp 1.200.000–1.250.000/kg kadar 30%. Anomali nihil.", likes: 14, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: "4", community_id: "harga-pasar", sender_name: "PEMASTA Bener Meriah", sender_role: "PEMASTA", content: "Di Bener Meriah sedikit lebih tinggi, sekitar 1.280.000 untuk grade A (PA 32%+). Stok mulai terbatas.", likes: 9, created_at: new Date(Date.now() - 1800000).toISOString() },
  ],
};

// ─── Komponen utama ───────────────────────────────────────────────────────────
export default function CommunityPage() {
  const supabase = createSupabaseBrowserClient();

  const [communities, setCommunities] = useState<Community[]>(SEED_COMMUNITIES);
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "", category: "Umum", is_public: true });
  const [creating, setCreating] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [authNotification, setAuthNotification] = useState<string | null>(null); // State untuk notifikasi
  const authUser = useAuthStore(s => s.user);
  const userName = authUser?.name;
  const userRole = authUser?.role;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Load messages ketika pilih komunitas ──
  const loadMessages = useCallback(async (communityId: string) => {
    // 1. Ambil dari Supabase
    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal load pesan:", error);
      // Fallback ke seed jika tabel belum ada atau error
      setMessages(SEED_MESSAGES[communityId] || []);
    } else {
      setMessages(data || []);
    }
  }, [supabase]);

  useEffect(() => {
    if (!activeCommunity) return;
    loadMessages(activeCommunity.id);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Supabase Realtime subscription
    const channel = supabase
      .channel(`community:${activeCommunity.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "community_messages",
        filter: `community_id=eq.${activeCommunity.id}`,
      }, (payload) => {
        const msg = payload.new as Message;
        
        // Cek apakah pesan sudah ada di state (untuk menghindari duplikasi pesan sendiri)
        setMessages((prev) => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeCommunity, loadMessages, supabase]);

  // ── Kirim pesan ──
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    console.log("DEBUG: userName in sendMessage:", userName);
    if (!userName) {
      alert("Silakan login terlebih dahulu untuk bergabung dalam percakapan!");
      return;
    }
    if (!newMessage.trim() || !activeCommunity || sending) return;
    setSending(true);

    const tempId = Date.now().toString();
    const msg: Message = {
      id: tempId,
      community_id: activeCommunity.id,
      sender_name: userName || "Pengguna ATSIRA",
      sender_role: userRole || "Umum",
      content: newMessage.trim(),
      likes: 0,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI dikurangi, kita akan handle sinkronisasi lebih ketat
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    // Simpan ke Supabase
    const { data, error } = await supabase.from("community_messages").insert([{
      id: tempId,
      community_id: msg.community_id,
      sender_name: msg.sender_name,
      sender_role: msg.sender_role,
      content: msg.content,
    }]).select().single();

    if (error) {
      console.error("Gagal simpan pesan:", error);
      // Rollback UI jika gagal
      setMessages((prev) => prev.filter(m => m.id !== tempId));
    }
    // Jika berhasil, kita tidak perlu menambahkan lagi di callback realtime 
    // karena kita sudah tambahkan secara lokal (optimistic).

    setSending(false);
  }

  // ── Like pesan ──
  function likeMessage(msgId: string) {
    if (likedIds.has(msgId)) return;
    setLikedIds((prev) => new Set(prev).add(msgId));
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, likes: m.likes + 1 } : m));
  }

  // ── Show Auth Notification Helper ──
  const triggerAuthNotification = (message: string) => {
    setAuthNotification(message);
    setTimeout(() => setAuthNotification(null), 5000);
  };
  async function createCommunity(e: React.FormEvent) {
    e.preventDefault();
    if (!userName) {
      triggerAuthNotification("Silakan login untuk membuat komunitas baru.");
      setShowCreateModal(false);
      return;
    }
    if (!createForm.name.trim()) return;
    setCreating(true);

    const newCom: Community = {
      id: `custom-${Date.now()}`,
      name: createForm.name.trim(),
      description: createForm.description.trim(),
      category: createForm.category,
      is_public: createForm.is_public,
      member_count: 1,
      created_by: userName,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI
    setCommunities((prev) => [newCom, ...prev]);
    setShowCreateModal(false);
    setActiveCommunity(newCom);
    setMessages([]);
    setCreateForm({ name: "", description: "", category: "Umum", is_public: true });

    // Simpan ke Supabase
    await supabase.from("communities").insert([{
      id: newCom.id,
      name: newCom.name,
      description: newCom.description,
      category: newCom.category,
      is_public: newCom.is_public,
      created_by: userName,
    }]).then(({ error }) => {
      if (error && error.code !== "42P01") console.error("Gagal simpan komunitas:", error);
    });

    setCreating(false);
  }

  // ── Filter komunitas ──
  const filteredCommunities = activeCategory === "Semua"
    ? communities
    : communities.filter((c) => c.category === activeCategory);

  function formatTime(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="min-h-screen bg-stone-50">
        <div className="container-app max-w-6xl px-4 mx-auto py-8">

          {/* NOTIFIKASI */}
          {authNotification && (
            <div className="fixed top-20 right-4 z-[200] bg-white border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <div>
                <p className="font-bold text-sm">Perlu Login</p>
                <p className="text-xs text-rose-600/80">{authNotification}</p>
              </div>
              <a href="/login" className="px-3 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-lg hover:bg-rose-700">Login</a>
              <button onClick={() => setAuthNotification(null)} className="text-stone-400 hover:text-stone-600"><X className="w-4 h-4"/></button>
            </div>
          )}

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-emerald-50 rounded-2xl text-emerald-700 mb-3">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl font-black text-stone-900 tracking-tight">ATSIRA Connect</h1>
            <p className="text-sm text-stone-500 max-w-lg mx-auto mt-1">
              Ruang kolaborasi, diskusi harga real-time, dan komunitas nilam Indonesia.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-280px)] min-h-[500px]">

            {/* ── SIDEBAR KIRI: Daftar Komunitas ── */}
            <div className={`lg:w-72 flex flex-col gap-3 ${activeCommunity ? "hidden lg:flex" : "flex"}`}>
              {/* Tombol buat komunitas baru */}
              <button
                onClick={() => {
                  if (!userName) {
                    triggerAuthNotification("Silakan login untuk membuat komunitas baru.");
                    return;
                  }
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Buat Komunitas Baru
              </button>

              {/* Filter kategori */}
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-emerald-700 text-white"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-300"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* List komunitas */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredCommunities.map((com) => (
                  <button
                    key={com.id}
                    onClick={() => { setActiveCommunity(com); loadMessages(com.id); }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      activeCommunity?.id === com.id
                        ? "bg-emerald-50 border-emerald-300 shadow-sm"
                        : "bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold text-stone-800 truncate">{com.name}</span>
                      {com.is_public
                        ? <Globe className="w-3 h-3 text-stone-400 shrink-0 ml-auto" />
                        : <Lock className="w-3 h-3 text-stone-400 shrink-0 ml-auto" />}
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{com.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {com.member_count} anggota
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">{com.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── AREA CHAT KANAN ── */}
            {!activeCommunity ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-200 text-center p-10">
                <MessageSquare className="w-12 h-12 text-stone-300 mb-3" />
                <p className="font-bold text-stone-500">Pilih komunitas untuk mulai berdiskusi</p>
                <p className="text-xs text-stone-400 mt-1">Atau buat komunitas baru sesuai kebutuhanmu</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 bg-stone-50">
                  <button
                    onClick={() => setActiveCommunity(null)}
                    className="lg:hidden p-1.5 rounded hover:bg-stone-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 text-stone-500" />
                  </button>
                  <Hash className="w-4 h-4 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 text-sm truncate">{activeCommunity.name}</p>
                    <p className="text-[11px] text-stone-400">{activeCommunity.member_count} anggota · {activeCommunity.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeCommunity.is_public
                      ? <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Globe className="w-3 h-3" />Publik</span>
                      : <span className="text-[10px] bg-stone-50 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" />Privat</span>}
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                      <Leaf className="w-10 h-10 text-emerald-300 mb-2" />
                      <p className="text-sm text-stone-400">Belum ada pesan. Jadilah yang pertama berdiskusi!</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <ChatBubble 
                      key={msg.id} 
                      message={{ ...msg, isOwn: msg.sender_name === userName }} 
                      onLike={() => likeMessage(msg.id)}
                      isLiked={likedIds.has(msg.id)}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input kirim pesan */}
                {!userName ? (
                  <div className="px-4 py-4 border-t border-stone-100 bg-stone-50 text-center">
                    <p className="text-sm text-stone-600 mb-2">
                       Ingin ikut berdiskusi? Silakan login terlebih dahulu.
                    </p>
                    <a href="/login" 
                       className="inline-block px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors">
                       Login ke ATSIRA
                    </a>
                  </div>
                ) : (
                  <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-3 border-t border-stone-100 bg-stone-50">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Tulis pesan di #${activeCommunity.name}...`}
                      disabled={sending}
                      className="flex-1 text-sm bg-white border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL BUAT KOMUNITAS ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100">
              <X className="w-4 h-4 text-stone-500" />
            </button>
            <h2 className="font-black text-stone-800 text-lg mb-1">Buat Komunitas Baru</h2>
            <p className="text-xs text-stone-500 mb-5">Komunitas bisa diikuti oleh semua pengguna ATSIRA sesuai kategori.</p>
            <form onSubmit={createCommunity} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Nama Komunitas *</label>
                <input required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})}
                  placeholder="Contoh: Petani Nilam Aceh Selatan"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Deskripsi</label>
                <textarea rows={2} value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})}
                  placeholder="Ceritakan tujuan komunitas ini..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Kategori</label>
                  <select value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400">
                    {CATEGORIES.filter(c => c !== "Semua").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Visibilitas</label>
                  <select value={createForm.is_public ? "public" : "private"} onChange={e => setCreateForm({...createForm, is_public: e.target.value === "public"})}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400">
                    <option value="public">🌐 Publik</option>
                    <option value="private">🔒 Privat</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={creating}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" />Membuat...</> : <><Plus className="w-4 h-4" />Buat Komunitas</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}