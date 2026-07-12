"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, Send, Users, ShieldAlert, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell"; // Memanggil PageShell pembungkus Navbar & Footer

// ====== KAMUS BAHASA LOKAL ======
const T = {
  title: { ID: "ATSIRA Connect", EN: "ATSIRA Connect" },
  subtitle: { ID: "Ruang kolaborasi, diskusi harga real-time, dan info tani minyak nilam.", EN: "Space for collaboration, real-time price discussions, and patchouli farming info." },
  placeholder: { ID: "Bagikan update harga lapangan atau diskusi hari ini...", EN: "Share field price updates or discuss today..." },
  postBtn: { ID: "Kirim Diskusi", EN: "Post Discussion" },
  filterAll: { ID: "Semua", EN: "All" },
  filterPrice: { ID: "Info Harga", EN: "Price Info" },
  filterRiset: { ID: "Riset ARC", EN: "ARC Research" },
};

// ====== MOCK DATA DISKUSI AWAL ======
const INITIAL_POSTS = [
  {
    id: 1,
    author: "Teuku Malik (PEMASTA)",
    role: "PEMASTA",
    avatarColor: "bg-amber-100 text-amber-800",
    badge: "Crowdsourced Price Feeder",
    content: "Melaporkan harga minyak nilam mentah di tingkat penyulingan Aceh Jaya hari ini terpantau stabil di kisaran Rp 1.200.000 - Rp 1.250.000 per kg tergantung kadar air. Anomali harga nihil.",
    tag: "Price Info",
    time: "2 jam yang lalu",
    likes: 14,
    comments: 5,
  },
  {
    id: 2,
    author: "Atsiri Research Center (ARC-USK)",
    role: "ARC-USK",
    avatarColor: "bg-blue-100 text-blue-800",
    badge: "Lembaga Riset Terverifikasi",
    content: "Kami baru saja mempublikasikan dataset pengujian GC-MS kuartal ini. Bagi para petani/seller yang ingin mengajukan uji laboratorium fisik gratis gelombang kedua, silakan cek portal riset atau hubungi admin.",
    tag: "ARC Research",
    time: "5 jam yang lalu",
    likes: 29,
    comments: 12,
  },
  {
    id: 3,
    author: "Suryadi (Petani Nilam)",
    role: "Seller",
    avatarColor: "bg-emerald-100 text-emerald-800",
    badge: "UMKM / Penyuling",
    content: "Izin bertanya rekan-rekan PEMASTA dan tim ahli ARC, untuk musim penghujan seperti sekarang, bagaimana tips menjaga kualitas daun nilam pasca-panen sebelum disuling agar rendemen minyaknya tidak turun drastis?",
    tag: "Diskusi",
    time: "1 hari yang lalu",
    likes: 8,
    comments: 19,
  }
];

export default function CommunityPage() {
  // Simulasi deteksi bahasa dari localStorage (Default ID)
  const lang = typeof window !== "undefined" && localStorage.getItem("lang") === "EN" ? "EN" : "ID";

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Fungsi membuat postingan baru
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const postData = {
      id: Date.now(),
      author: "Anda (User ATSIRA)",
      role: "Umum",
      avatarColor: "bg-surface-container-highest text-on-surface",
      badge: "Anggota Komunitas",
      content: newPost,
      tag: "Diskusi",
      time: "Baru saja",
      likes: 0,
      comments: 0,
    };

    setPosts([postData, ...posts]);
    setNewPost("");
  };

  // Fungsi menyukai postingan
  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // Filter postingan berdasarkan kategori
  const filteredPosts = posts.filter(p => {
    if (activeFilter === "All") return true;
    return p.tag === activeFilter;
  });

  return (
    <PageShell>
      <div className="min-h-screen bg-surface-container-lowest/30 py-10">
        <div className="container-app max-w-4xl px-4 mx-auto">
          
          {/* HEADER HALAMAN */}
          <div className="text-center mb-10 space-y-2">
            <div className="inline-flex p-3 bg-primary-container/20 rounded-2xl text-primary mb-2">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl font-black text-on-surface tracking-tight">
              {T.title[lang]}
            </h1>
            <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
              {T.subtitle[lang]}
            </p>
          </div>

          {/* FORM INPUT POSTINGAN BARU */}
          <div className="bg-surface border border-surface-container-high rounded-2xl p-4 shadow-sm mb-6 transition-all focus-within:border-primary/50">
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={T.placeholder[lang]}
                rows={3}
                className="w-full text-sm bg-transparent resize-none outline-none text-on-surface placeholder:text-outline/70"
              />
              <div className="flex justify-end pt-2 border-t border-surface-container-low">
                <Button type="submit" size="sm" className="rounded-full flex items-center gap-1.5 px-5">
                  <Send className="w-3.5 h-3.5" />
                  {T.postBtn[lang]}
                </Button>
              </div>
            </form>
          </div>

          {/* FILTER BAR TABS */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveFilter("All")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === "All" 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-surface border border-surface-container-high text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {T.filterAll[lang]}
            </button>
            <button
              onClick={() => setActiveFilter("Price Info")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeFilter === "Price Info" 
                  ? "bg-amber-600 text-white shadow-sm" 
                  : "bg-surface border border-surface-container-high text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {T.filterPrice[lang]}
            </button>
            <button
              onClick={() => setActiveFilter("ARC Research")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeFilter === "ARC Research" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-surface border border-surface-container-high text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              {T.filterRiset[lang]}
            </button>
          </div>

          {/* DAFTAR POSTINGAN TIMELINE */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-surface border border-surface-container-high rounded-2xl p-5 shadow-sm space-y-4">
                
                {/* Identitas Kreator */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center ${post.avatarColor}`}>
                      {post.author[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-on-surface">{post.author}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          post.role === "PEMASTA" ? "bg-amber-100 text-amber-800" :
                          post.role === "ARC-USK" ? "bg-blue-100 text-blue-800" :
                          "bg-emerald-100 text-emerald-800"
                        }`}>
                          {post.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-outline flex items-center gap-1 mt-0.5">
                        <Award className="w-3 h-3 text-primary" /> {post.badge}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-outline">{post.time}</span>
                </div>

                {/* Isi Konten */}
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Tag Kategori */}
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    post.tag === "Price Info" ? "bg-amber-50 text-amber-700" :
                    post.tag === "ARC Research" ? "bg-blue-50 text-blue-700" :
                    "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    #{post.tag}
                  </span>
                </div>

                {/* Aksi Suka & Komentar */}
                <div className="flex items-center gap-4 pt-2 border-t border-surface-container-low/60 text-on-surface-variant">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors group"
                  >
                    <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform text-outline group-hover:text-primary" />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <MessageSquare className="w-4 h-4 text-outline" />
                    <span>{post.comments}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </PageShell>
  );
}