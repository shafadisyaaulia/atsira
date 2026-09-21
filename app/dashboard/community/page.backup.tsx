"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Users, Lock, Globe, Hash, Send, MessageSquare,
  Search, CheckCircle, Crown, Key
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

export default function DashboardCommunityPage() {
  const { user } = useAuthStore();
  const roleKey = user?.role === "umkm" ? "Seller" : user?.role === "petani" ? "Petani" : user?.role === "peneliti" ? "ARC" : user?.role === "pemasta" ? "PEMASTA" : "Member";

  const supabase = createSupabaseBrowserClient();

  const [activeTab, setActiveTab] = useState<"joined" | "explore" | "private">("joined");
  const [joinedIds, setJoinedIds] = useState<string[]>(DEFAULT_JOINED);
  const [activeChatId, setActiveChatId] = useState<string | null>("harga-pasar");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const joinedCommunities = ALL_COMMUNITIES.filter(c => c.type === "public" && joinedIds.includes(c.id));
  const exploreCommunities = ALL_COMMUNITIES.filter(c => c.type === "public" && !joinedIds.includes(c.id) && c.name.toLowerCase().includes(search.toLowerCase()));
  const privateCommunities = ALL_COMMUNITIES.filter(c => c.type === "private" && joinedIds.includes(c.id));
  const activeChat = ALL_COMMUNITIES.find(c => c.id === activeChatId);

  const handleJoin = (id: string) => {
    setJoinedIds(prev => [...prev, id]);
    setActiveChatId(id);
    setActiveTab("joined");
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const match = ALL_COMMUNITIES.find(c => c.type === "private" && c.inviteCode === inviteInput.trim().toUpperCase());
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

    const { error } = await supabase.from("community_messages").insert([{
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

  return (
    <DashboardShell role={(user?.role as any) ?? "umkm"}>
      <div className="max-w-6xl mx-auto w-full h-[calc(100vh-100px)] flex flex-col gap-0 pb-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 font-display flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-700" /> atSira Connect
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">Ruang kolaborasi komunitas minyak nilam Indonesia (Internal Dashboard)</p>
          </div>
        </div>

        {/* LAYOUT UTAMA: sidebar komunitas + area chat */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          
          {/* ── SIDEBAR KIRI ── */}
          <aside className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
            
            {/* Tab Navigasi */}
            <div className="flex rounded-xl bg-stone-100 p-1 gap-1 shrink-0">
              {([
                { key: "joined", label: "Diikuti", icon: CheckCircle },
                { key: "explore", label: "Jelajahi", icon: Globe },
                { key: "private", label: "Private", icon: Lock },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all",
                    activeTab === key ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"
                  )}
                >
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>

            {/* TAB: DIIKUTI */}
            {activeTab === "joined" && (
              <div className="space-y-1.5 overflow-y-auto">
                {joinedCommunities.length === 0 && privateCommunities.length === 0 && (
                  <p className="text-xs text-stone-400 text-center py-6">Belum ada komunitas yang diikuti.</p>
                )}
                {joinedCommunities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all",
                      activeChatId === c.id
                        ? "bg-emerald-50 border-emerald-200 shadow-sm"
                        : "bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{c.name}</p>
                        <p className="text-[10px] text-stone-400">{c.memberCount} anggota</p>
                      </div>
                      {c.badge && <span className="ml-auto text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">{c.badge}</span>}
                    </div>
                  </button>
                ))}
                {privateCommunities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all",
                      activeChatId === c.id
                        ? "bg-purple-50 border-purple-200 shadow-sm"
                        : "bg-white border-stone-200 hover:border-purple-200 hover:bg-stone-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5 text-purple-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{c.name}</p>
                        <p className="text-[10px] text-stone-400">{c.memberCount} anggota · Private</p>
                      </div>
                      <Crown className="w-3.5 h-3.5 text-purple-500 ml-auto shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: JELAJAHI */}
            {activeTab === "explore" && (
              <div className="space-y-2 overflow-y-auto">
                <div className="relative shrink-0">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari komunitas..."
                    className="w-full text-xs border border-stone-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-emerald-400 bg-stone-50"
                  />
                </div>
                {exploreCommunities.length === 0 && (
                  <p className="text-xs text-stone-400 text-center py-6">Semua komunitas publik sudah diikuti!</p>
                )}
                {exploreCommunities.map(c => (
                  <Card key={c.id} className="p-3 border border-stone-200">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Hash className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 leading-tight">{c.name}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{c.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-stone-400">{c.memberCount} anggota</span>
                      <button
                        onClick={() => handleJoin(c.id)}
                        className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Bergabung
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* TAB: PRIVATE */}
            {activeTab === "private" && (
              <div className="space-y-3 overflow-y-auto">
                <Card className="p-3 border border-purple-200 bg-purple-50/50">
                  <p className="text-xs font-bold text-purple-900 mb-2 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Masukkan Kode Undangan
                  </p>
                  <form onSubmit={handleInvite} className="space-y-2">
                    <input
                      value={inviteInput}
                      onChange={e => { setInviteInput(e.target.value); setInviteError(""); }}
                      placeholder="Contoh: PMST-2026"
                      className="w-full text-xs border border-purple-200 rounded-lg p-2 outline-none focus:border-purple-400 bg-white font-mono uppercase"
                    />
                    {inviteError && <p className="text-[10px] text-red-500 font-medium">{inviteError}</p>}
                    <button type="submit" className="w-full text-[11px] font-bold bg-purple-700 hover:bg-purple-800 text-white py-1.5 rounded-lg transition-colors">
                      Verifikasi & Bergabung
                    </button>
                  </form>
                </Card>

                {privateCommunities.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-4">Belum ada komunitas private yang diikuti.</p>
                ) : (
                  privateCommunities.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setActiveChatId(c.id); setActiveTab("joined"); }}
                      className="w-full text-left p-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900">{c.name}</p>
                          <p className="text-[10px] text-stone-400">{c.memberCount} anggota · Private</p>
                        </div>
                        <Crown className="w-3.5 h-3.5 text-purple-400 ml-auto shrink-0" />
                      </div>
                    </button>
                  ))
                )}

                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1 mt-1">Komunitas Private Tersedia</p>
                {ALL_COMMUNITIES.filter(c => c.type === "private" && !joinedIds.includes(c.id)).map(c => (
                  <div key={c.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50 opacity-70">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-500">{c.name}</p>
                        <p className="text-[10px] text-stone-400 truncate">Hanya anggota undangan · {c.memberCount} anggota</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* ── AREA CHAT ── */}
          <div className="flex-1 flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm h-full">
            {activeChatId && activeChat ? (
              <>
                {/* Header chat */}
                <div className={cn(
                  "px-5 py-3.5 border-b border-stone-100 flex items-center gap-3 shrink-0",
                  activeChat.type === "private" ? "bg-purple-50" : "bg-emerald-50/50"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                    activeChat.type === "private" ? "bg-purple-100" : "bg-emerald-100"
                  )}>
                    {activeChat.type === "private"
                      ? <Lock className="w-4 h-4 text-purple-700" />
                      : <Globe className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-stone-900 truncate">{activeChat.name}</h2>
                    <p className="text-[10px] text-stone-500 truncate">{activeChat.memberCount} anggota · {activeChat.category} · {activeChat.type === "private" ? "Private" : "Publik"}</p>
                  </div>
                  {activeChat.type === "private" && (
                    <span className="ml-auto text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Crown className="w-3 h-3" /> Anggota
                    </span>
                  )}
                </div>

                {/* Pesan */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-stone-300 font-medium">Jadilah yang pertama mengirim pesan di sini!</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-2.5 items-end", msg.isMe && "flex-row-reverse")}>
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                        msg.isMe ? "bg-emerald-800 text-emerald-100" : "bg-stone-200 text-stone-600"
                      )}>
                        {(msg.sender || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className={cn("max-w-[75%]", msg.isMe && "items-end flex flex-col")}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {!msg.isMe && <span className="text-[10px] font-bold text-stone-600">{msg.sender}</span>}
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-bold", ROLE_COLOR[msg.role] ?? "bg-stone-100 text-stone-500")}>
                            {msg.role}
                          </span>
                          <span className="text-[9px] text-stone-300">{msg.time}</span>
                        </div>
                        <div className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                          msg.isMe
                            ? "bg-emerald-700 text-white rounded-br-sm"
                            : "bg-stone-100 text-stone-800 rounded-bl-sm"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-stone-100 flex gap-2 items-center shrink-0">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder={`Kirim pesan ke #${activeChat.name}...`}
                    className="flex-1 text-xs border border-stone-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400 bg-stone-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors disabled:opacity-40 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-stone-700">Pilih Komunitas</p>
                  <p className="text-xs text-stone-400 mt-1">Pilih komunitas di sebelah kiri untuk mulai berdiskusi</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardShell>
  );
}
