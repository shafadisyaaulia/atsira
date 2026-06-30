"use client";

import { useState, useRef, useEffect } from "react";
import { Leaf, X, Send } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const QUICK_REPLIES = [
  "Bagaimana cara meningkatkan kadar PA?",
  "Berapa harga nilam hari ini?",
  "Cara listing produk pertama saya?",
];

const CANNED_RESPONSES: Record<string, string> = {
  pa: "Kadar Patchouli Alcohol (PA) bisa ditingkatkan dengan memanen daun di usia 6-8 bulan, memanen pagi hari, dan memastikan proses layu yang tepat sebelum disuling. Selengkapnya ada di ATSIRA Magazine bagian Tips Budidaya 🌿",
  harga: "Harga nilam grade Premium hari ini sekitar Rp 1.450.000/kg, naik 1,4% dari kemarin. Cek detail lengkapnya di Dasbor Harga ya!",
  listing: "Mudah! Masuk ke Dasbor Petani Anda, buka Nilam Analyzer AI, unggah foto minyak Anda, lalu klik 'Jual Langsung ke UMKM' setelah hasil analisis keluar.",
  default: "Terima kasih sudah bertanya! Saya Nila, asisten ATSIRA. Saat ini saya masih dalam mode demo — versi penuh saya akan terhubung dengan AI untuk menjawab pertanyaan seputar budidaya, harga, dan panduan platform secara real-time.",
};

function getCannedResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("pa") || lower.includes("kadar") || lower.includes("kualitas")) return CANNED_RESPONSES.pa;
  if (lower.includes("harga")) return CANNED_RESPONSES.harga;
  if (lower.includes("listing") || lower.includes("jual")) return CANNED_RESPONSES.listing;
  return CANNED_RESPONSES.default;
}

export function AtBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Halo! Saya Nila 🌿 — asisten virtual ATSIRA. Ada yang bisa saya bantu seputar nilam, harga, atau cara pakai platform ini?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getCannedResponse(text),
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, reply]);
    }, 600);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] max-w-[88vw] h-[460px] bg-surface-container-lowest rounded-lg shadow-elevation-2 border border-surface-container-high flex flex-col overflow-hidden animate-in">
          <div className="bg-primary text-on-primary px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center">
              <Leaf className="w-5 h-5 text-on-secondary-fixed-variant" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">Nila</p>
              <p className="text-xs text-inverse-on-surface/70 leading-tight">Asisten ATSIRA</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-surface-container-low">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-clay-earth text-white rounded-br-sm"
                      : "bg-surface-container-lowest text-on-surface border border-surface-container-high rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {messages.length <= 1 && (
              <div className="flex flex-col gap-2 pt-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left text-xs px-3 py-2 rounded-md border border-outline-variant bg-surface-container-lowest hover:border-primary text-on-surface-variant"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-surface-container-high bg-surface-container-lowest"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan..."
              className="flex-1 text-sm bg-surface-container-low rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0"
              aria-label="Kirim"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-secondary-container shadow-elevation-2 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Buka asisten Nila"
      >
        <Leaf className="w-7 h-7 text-on-secondary-container" />
      </button>
    </div>
  );
}
