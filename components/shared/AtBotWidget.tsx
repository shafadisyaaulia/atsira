"use client";

import { useState, useRef, useEffect } from "react";
import { Leaf, X, Send, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const QUICK_REPLIES = [
  "Bagaimana cara meningkatkan kadar PA?",
  "Berapa harga nilam hari ini?",
  "Cara listing produk pertama saya?",
];

export function AtBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Halo! Saya AtBot 🌿 — asisten virtual ATSIRA. Ada yang bisa saya bantu seputar nilam, harga, atau cara pakai platform ini?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || isLoading) return;
    
    // Quick check to prevent accidental duplicates
    if (messages.length > 0 && messages[messages.length - 1].content === text && messages[messages.length - 1].role === "user") return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setIsLoading(true); // Set to true immediately!
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("/api/atbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply ?? "Maaf, saya tidak bisa menjawab saat ini.",
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, reply]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Maaf, koneksi terputus. Coba lagi ya! 🌿",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] max-w-[88vw] h-[460px] bg-surface-container-lowest rounded-lg shadow-elevation-2 border border-surface-container-high flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className="bg-primary text-on-primary px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center">
              <Leaf className="w-5 h-5 text-on-secondary-fixed-variant" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">AtBot</p>
              <p className="text-xs text-inverse-on-surface/70 leading-tight">
                {isLoading ? "Sedang mengetik..." : "Asisten ATSIRA · Online"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-surface-container-low"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-emerald-700 text-white rounded-br-none"
                      : "bg-white text-on-surface border border-surface-container-high rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-lg rounded-bl-sm px-3 py-2 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span className="text-xs text-on-surface-variant">AtBot sedang mengetik...</span>
                </div>
              </div>
            )}

            {/* Quick replies — hanya tampil saat pesan masih awal */}
            {messages.length <= 1 && !isLoading && (
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

          {/* Input */}
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
              disabled={isLoading}
              className="flex-1 text-sm bg-surface-container-low rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50"
              aria-label="Kirim"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-secondary-container shadow-elevation-2 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Buka asisten AtBot"
      >
        <Leaf className="w-7 h-7 text-on-secondary-container" />
      </button>
    </div>
  );
}
