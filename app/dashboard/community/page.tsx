"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Users, Lock, Globe, Hash, Send, MessageSquare,
  Search, CheckCircle, Crown, Key, Plus
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getLang, subscribeLang } from "@/lib/language";

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  type: "public" | "private";
  memberCount: number;
  badge?: string;
  inviteCode?: string;
}

interface Message {
  id: string;
  sender: string;
  role: string;
  content: string;
  time: string;
  isMe?: boolean;
}

const ALL_COMMUNITIES: Community[] = [
  { id: "petani-aceh", name: "Petani Nilam Aceh", description: "Diskusi khusus petani & penyuling seluruh Aceh. Berbagi info panen, rendemen, dan kendala lapangan.", category: "Petani & Penyuling", type: "public", memberCount: 84 },
  { id: "harga-pasar", name: "Info Harga Pasar", description: "Update harga minyak nilam harian dari berbagai wilayah. Semua role bisa berbagi informasi.", category: "Umum", type: "public", memberCount: 120, badge: "Aktif" },
  { id: "umkm-nilam", name: "UMKM Produk Nilam", description: "Forum UMKM yang mengolah minyak nilam menjadi produk jadi: parfum, sabun, aromaterapi.", category: "UMKM & Buyer", type: "public", memberCount: 47 },
  { id: "tips-suling", name: "Tips & Teknik Penyulingan", description: "Berbagi pengalaman penyulingan, troubleshooting, dan inovasi teknologi produksi.", category: "Petani & Penyuling", type: "public", memberCount: 62 },
  { id: "arc-riset", name: "ARC-USK Publikasi Riset", description: "Kanal resmi ARC-USK untuk berbagi hasil penelitian, dataset, dan informasi uji laboratorium.", category: "ARC-USK", type: "public", memberCount: 28 },
  { id: "pemasta-internal", name: "PEMASTA Koordinasi Internal", description: "Ruang koordinasi antar-PEMASTA Node. Hanya untuk anggota yang diundang.", category: "PEMASTA", type: "private", memberCount: 31, inviteCode: "PMST-2026" },
  { id: "arc-internal", name: "ARC-USK Lab Internal", description: "Diskusi teknis analis & peneliti lab ARC-USK. Akses hanya dengan kode undangan.", category: "ARC-USK", type: "private", memberCount: 12, inviteCode: "ARC-LAB" },
  { id: "buyer-network", name: "Buyer Network Premium", description: "Jaringan eksklusif buyer ekspor dan industri besar. Undangan oleh tim atSira.", category: "UMKM & Buyer", type: "private", memberCount: 19, inviteCode: "BUYER-VIP" },
];

const DEFAULT_JOINED = ["harga-pasar", "petani-aceh"];

const ROLE_COLOR: Record<string, string> = {
  "PEMASTA": "bg-emerald-100 text-emerald-800",
  "Petani": "bg-lime-100 text-lime-800",
  "Seller": "bg-amber-100 text-amber-800",
  "ARC": "bg-purple-100 text-purple-800",
  "Buyer": "bg-blue-100 text-blue-800",
  "Peneliti": "bg-rose-100 text-rose-800",
};

const T_COMM = {
  subtitle: { ID: "Ruang kolaborasi komunitas minyak nilam Indonesia", EN: "Indonesian patchouli oil community collaboration space" },
  tabJoined: { ID: "Diikuti", EN: "Joined" },
  tabExplore: { ID: "Jelajahi", EN: "Explore" },
  tabPrivate: { ID: "Privat", EN: "Private" },
  searchHolder: { ID: "Cari komunitas...", EN: "Search communities..." },
  inviteHolder: { ID: "Masukkan Kode Undangan", EN: "Enter Invite Code" },
  btnJoin: { ID: "Gabung", EN: "Join" },
  btnInvite: { ID: "Gunakan Kode", EN: "Use Code" },
  msgPlaceholder: { ID: "Ketik pesan...", EN: "Type a message..." },
  memberCount: { ID: "anggota", EN: "members" },
  emptyChat: { ID: "Belum ada pesan. Jadilah yang pertama menyapa!", EN: "No messages yet. Be the first to say hello!" },
  btnAdd: { ID: "Tambah Komunitas", EN: "Add Community" },
  modalAddTitle: { ID: "Buat Komunitas Baru", EN: "Create New Community" },
  modalAddName: { ID: "Nama Komunitas", EN: "Community Name" },
  modalAddDesc: { ID: "Deskripsi", EN: "Description" },
  modalAddCat: { ID: "Kategori", EN: "Category" },
  modalAddType: { ID: "Tipe", EN: "Type" },
  modalAddBtn: { ID: "Buat", EN: "Create" },
  modalCancel: { ID: "Batal", EN: "Cancel" }
};

export default function DashboardCommunityPage() {
  const { user } = useAuthStore();
  const roleKey = user?.role === "umkm" ? "Seller" : user?.role === "petani" ? "Petani" : user?.role === "peneliti" ? "ARC" : user?.role === "pemasta" ? "PEMASTA" : "Member";

  const supabase = createSupabaseBrowserClient();

  const [lang, setLang] = useState<"ID"|"EN">("ID");
  useEffect(() => { setLang(getLang() as "ID"|"EN"); const unsub = subscribeLang(() => setLang(getLang() as "ID"|"EN")); return unsub; }, []);

  const [communities, setCommunities] = useState<Community[]>(ALL_COMMUNITIES);
  const [activeTab, setActiveTab] = useState<"joined" | "explore" | "private">("joined");
  const [joinedIds, setJoinedIds] = useState<string[]>(DEFAULT_JOINED);
  const [activeChatId, setActiveChatId] = useState<string | null>("harga-pasar");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComm, setNewComm] = useState({ name: "", desc: "", category: "Umum", type: "public" as "public"|"private" });

  const loadMessages = useCallback(async (communityId: string) => {
    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      console.error("Error loading messages", error);
      return;
    }

    const mapped = (data || []).map(msg => ({
      id: msg.id,
      sender: msg.sender_name,
      role: msg.sender_role,
      content: msg.content,
      time: new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      isMe: msg.sender_name === (user?.name || "Saya")
    }));
    setMessages(mapped);
  }, [supabase, user]);

  useEffect(() => {
    if (!activeChatId) return;
    loadMessages(activeChatId);

    const channel = supabase
      .channel(`community:${activeChatId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "community_messages",
        filter: `community_id=eq.${activeChatId}`
      }, (payload) => {
        const msg = payload.new;
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, {
            id: msg.id,
            sender: msg.sender_name,
            role: msg.sender_role,
            content: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            isMe: msg.sender_name === (user?.name || "Saya")
          }];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChatId, loadMessages, supabase, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinedCommunities = communities.filter(c => c.type === "public" && joinedIds.includes(c.id));
  const exploreCommunities = communities.filter(c => c.type === "public" && !joinedIds.includes(c.id) && c.name.toLowerCase().includes(search.toLowerCase()));
  const privateCommunities = communities.filter(c => c.type === "private" && joinedIds.includes(c.id));
  const activeChat = communities.find(c => c.id === activeChatId);

  const handleJoin = (id: string) => {
    setJoinedIds(prev => [...prev, id]);
    setActiveChatId(id);
    setActiveTab("joined");
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const match = communities.find(c => c.type === "private" && c.inviteCode === inviteInput.trim().toUpperCase());
    if (!match) {
      setInviteError("Kode undangan tidak valid atau sudah kedaluwarsa.");
      return;
    }
    if (joinedIds.includes(match.id)) {
      setInviteError("Anda sudah bergabung di komunitas ini.");
      return;
    }
    setJoinedIds(prev => [...prev, match.id]);
    setInviteInput("");
    setInviteError("");
    setActiveChatId(match.id);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChatId) return;
    const msgContent = input.trim();
    setInput("");

    // Optimistic Update
    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      sender: user?.name || "Saya",
      role: roleKey,
      content: msgContent,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      isMe: true
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const { error } = await supabase.from("community_messages").insert([{
      id: tempId,
      community_id: activeChatId,
      sender_name: user?.name || "Saya",
      sender_role: roleKey,
      content: msgContent,
      likes: 0
    }]);

    if (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = newComm.name.toLowerCase().replace(/\s+/g, '-');
    const newCommunity: Community = {
      id: newId,
      name: newComm.name,
      description: newComm.desc,
      category: newComm.category,
      type: newComm.type,
      memberCount: 1,
      inviteCode: newComm.type === "private" ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined
    };
    setCommunities(prev => [newCommunity, ...prev]);
    setJoinedIds(prev => [...prev, newId]);
    setShowAddModal(false);
    setActiveChatId(newId);
    setActiveTab("joined");
    setNewComm({ name: "", desc: "", category: "Umum", type: "public" });
  };

  return (
    <DashboardShell role={(user?.role as any) ?? "umkm"}>
      <div className="max-w-6xl mx-auto w-full h-[calc(100vh-100px)] flex flex-col gap-0 pb-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 font-display flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-700" /> atSira Connect
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">{T_COMM.subtitle[lang]}</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> {T_COMM.btnAdd[lang]}
          </button>
        </div>

        {/* LAYOUT UTAMA: sidebar komunitas + area chat */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          
          {/* ── SIDEBAR KIRI ── */}
          <aside className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
            
            {/* Tab Navigasi */}
            <div className="flex rounded-xl bg-stone-100 p-1 gap-1 shrink-0">
              {([
                { key: "joined", label: T_COMM.tabJoined[lang], icon: CheckCircle },
                { key: "explore", label: T_COMM.tabExplore[lang], icon: Globe },
                { key: "private", label: T_COMM.tabPrivate[lang], icon: Lock },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.key ? "bg-white text-emerald-900 shadow-sm" : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB: JOINED (DIIKUTI) */}
            {activeTab === "joined" && (
              <div className="space-y-2">
                {joinedCommunities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={cn(
                      "w-full flex flex-col text-left p-3 rounded-xl transition-all border",
                      activeChatId === c.id 
                        ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                        : "bg-white border-stone-100 hover:border-emerald-100 hover:bg-stone-50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-stone-900 line-clamp-1">{c.name}</span>
                      {c.badge && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{c.badge}</span>}
                    </div>
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {c.memberCount} {T_COMM.memberCount[lang]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: EXPLORE (JELAJAHI) */}
            {activeTab === "explore" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder={T_COMM.searchHolder[lang]}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {exploreCommunities.map(c => (
                    <div key={c.id} className="p-3 bg-white border border-stone-100 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-stone-900 leading-tight">{c.name}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{c.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-stone-400">{c.memberCount} {T_COMM.memberCount[lang]}</span>
                        <button onClick={() => handleJoin(c.id)} className="text-[10px] font-bold bg-stone-900 text-white px-3 py-1 rounded-full hover:bg-emerald-700 transition-colors">
                          {T_COMM.btnJoin[lang]}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PRIVATE */}
            {activeTab === "private" && (
              <div className="space-y-4">
                <form onSubmit={handleInvite} className="bg-stone-800 text-white p-3.5 rounded-xl space-y-2 shadow-lg">
                  <label className="text-xs font-bold flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400"/> Undangan Private</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={T_COMM.inviteHolder[lang]}
                      className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 uppercase placeholder:normal-case"
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                    />
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-amber-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      {T_COMM.btnInvite[lang]}
                    </button>
                  </div>
                  {inviteError && <p className="text-[10px] text-red-400 font-medium">{inviteError}</p>}
                </form>

                <div className="space-y-2">
                  {privateCommunities.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={cn(
                        "w-full flex flex-col text-left p-3 rounded-xl transition-all border",
                        activeChatId === c.id 
                          ? "bg-stone-800 border-stone-700 shadow-sm" 
                          : "bg-white border-stone-200 hover:border-stone-300"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn("font-bold text-sm line-clamp-1 flex items-center gap-1.5", activeChatId === c.id ? "text-white" : "text-stone-900")}>
                          <Lock className="w-3 h-3" /> {c.name}
                        </span>
                      </div>
                      <span className={cn("text-[10px] flex items-center gap-1", activeChatId === c.id ? "text-stone-400" : "text-stone-500")}>
                        <Users className="w-3 h-3" /> {c.memberCount} {T_COMM.memberCount[lang]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ── AREA CHAT KANAN ── */}
          <main className="flex-1 bg-white border border-stone-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
            {activeChat ? (
              <>
                {/* Header Chat */}
                <div className="border-b border-stone-100 p-4 flex items-center justify-between bg-stone-50/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                      activeChat.type === "private" ? "bg-stone-800 text-amber-400" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {activeChat.type === "private" ? <Lock className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="font-bold text-stone-900">{activeChat.name}</h2>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500">
                        <span>{activeChat.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {activeChat.memberCount} {T_COMM.memberCount[lang]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Chat */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8faf9]">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-2">
                      <MessageSquare className="w-10 h-10 opacity-20" />
                      <p className="text-sm font-medium">{T_COMM.emptyChat[lang]}</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const showAvatar = idx === 0 || messages[idx-1].sender !== msg.sender;
                      
                      if (msg.isMe) {
                        return (
                          <div key={msg.id} className="flex justify-end gap-2 group">
                            <div className="flex flex-col items-end max-w-[75%]">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] text-stone-400 font-medium">{msg.time}</span>
                                <span className="text-[10px] font-bold text-stone-700">Anda</span>
                              </div>
                              <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm text-[13px] leading-relaxed">
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className="flex gap-3 max-w-[75%] group">
                          {showAvatar ? (
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-xs shrink-0 mt-3">
                              {msg.sender.substring(0,2).toUpperCase()}
                            </div>
                          ) : <div className="w-8 shrink-0" />}
                          
                          <div className="flex flex-col items-start">
                            {showAvatar && (
                              <div className="flex items-center gap-2 mb-1 pl-1">
                                <span className="text-[11px] font-bold text-stone-800">{msg.sender}</span>
                                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black/5", ROLE_COLOR[msg.role] || "bg-stone-100 text-stone-600")}>
                                  {msg.role}
                                </span>
                                <span className="text-[9px] text-stone-400 font-medium">{msg.time}</span>
                              </div>
                            )}
                            <div className="bg-white border border-stone-200 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm text-[13px] text-stone-800 leading-relaxed">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Chat */}
                <div className="p-3 border-t border-stone-100 bg-white">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all"
                  >
                    <input
                      type="text"
                      placeholder={T_COMM.msgPlaceholder[lang]}
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm text-stone-800"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center text-white transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                <p>Pilih komunitas untuk mulai berdiskusi</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal Tambah Komunitas */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100">
              <span className="text-stone-500 font-bold text-sm px-1">X</span>
            </button>
            <h2 className="font-black text-stone-800 text-lg mb-1">{T_COMM.modalAddTitle[lang]}</h2>
            <p className="text-xs text-stone-500 mb-5">Komunitas bisa diikuti oleh semua pengguna atSira sesuai kategori.</p>
            <form onSubmit={handleAddCommunity} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddName[lang]} *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Petani Nilam Aceh Selatan"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                  value={newComm.name}
                  onChange={e => setNewComm({...newComm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddDesc[lang]}</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Ceritakan tujuan komunitas ini..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-emerald-400"
                  value={newComm.desc}
                  onChange={e => setNewComm({...newComm, desc: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddCat[lang]}</label>
                  <select 
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                    value={newComm.category}
                    onChange={e => setNewComm({...newComm, category: e.target.value})}
                  >
                    <option value="Umum">Umum</option>
                    <option value="Petani & Penyuling">Petani & Penyuling</option>
                    <option value="UMKM & Buyer">UMKM & Buyer</option>
                    <option value="ARC-USK">ARC-USK</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">{T_COMM.modalAddType[lang]}</label>
                  <select 
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                    value={newComm.type}
                    onChange={e => setNewComm({...newComm, type: e.target.value as "public"|"private"})}
                  >
                    <option value="public">🌐 Publik</option>
                    <option value="private">🔒 Privat</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-2 shadow-sm">
                {T_COMM.modalAddBtn[lang]}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
