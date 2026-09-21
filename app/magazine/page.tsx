"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, FileText, Download, BookOpen, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";

import { MAGAZINE_ARTICLES } from "@/lib/mock/ecosystem";

// Filter kategori mencakup seluruh kategori dari 5 artikel baru
const CATEGORIES = ["Semua", "Kegiatan Komunitas", "Riset & Edukasi", "Analisis Harga", "Laporan Panen"] as const;

const formatDateID = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
};

// Normalisasi field dari API / mock
const normalizeArticle = (a: any) => ({
  ...a,
  imageUrl: a.image_url ?? a.imageUrl ?? "/images/nilamstory-card.jpg",
  publishedAt: a.published_at ?? a.publishedAt ?? "",
  readMinutes: a.read_minutes ?? a.readMinutes ?? 3,
});

export default function NilamStoryPage() {
  const [category, setCategory] = useState<string>("Semua");
  const [articles, setArticles] = useState<any[]>(MAGAZINE_ARTICLES.map(normalizeArticle));
  const [loading, setLoading] = useState(false);
  const lang = typeof window !== "undefined" && localStorage.getItem("lang") === "EN" ? "EN" : "ID";

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/pemasta/field-stories");
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setArticles(json.data.map(normalizeArticle));
        }
      } catch (err) {
        console.error("Failed to fetch field stories:", err);
      }
    };

    fetchStories();
  }, []);

  const filtered = category === "Semua" ? articles : articles.filter((a) => a.category === category);
  const featured = articles.find((a) => a.featured);

  return (
    <PageShell>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-amber-50/70 via-emerald-50/10 to-surface py-14 border-b border-surface-container-high">
        <div className="container-app px-4 max-w-5xl mx-auto">
          <SectionEyebrow className="text-emerald-800 font-bold tracking-wider">Aksi Nyata di Lapangan</SectionEyebrow>
          <h1 className="font-display text-3xl md:text-5xl font-black text-primary tracking-tight mt-1 mb-3">
            Nilam Story
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-xs md:text-sm leading-relaxed">
            Dokumentasi kegiatan atSira bersama petani hebat Aceh, berkolaborasi dengan akademisi, dan memberdayakan komoditas lokal hulu ke hilir.
          </p>
        </div>
      </section>

      {/* FEATURED / BANNER UTAMA (Tempat Jumpa Petani Aceh Selatan) */}
      {featured && (
        <section className="py-8">
          <div className="container-app px-4 max-w-5xl mx-auto">
            <Link href={`/magazine/${featured.slug}`}>
              <Card className="overflow-hidden grid md:grid-cols-2 hover:shadow-md transition-all rounded-2xl border border-surface-container-high bg-white group">
                <div className="h-56 md:h-full overflow-hidden relative bg-neutral-900">
                  <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-amber-500 text-neutral-950 border-none font-bold px-3 py-1 shadow text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3" /> Kegiatan Terbaru
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1.5 block">
                    {featured.category}
                  </span>
                  <h2 className="font-display text-lg md:text-xl font-black text-primary mb-3 leading-tight group-hover:text-amber-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-xs text-on-surface-variant mb-5 line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                  
                  <div className="flex items-center justify-between border-t border-surface-container-low pt-3.5 text-[11px] text-outline font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">{featured.author || "Tim Lapangan atSira & Pemasta"}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> {featured.readMinutes || 4} m baca
                      </span>
                    </div>
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* LIST GRID & FILTER */}
      <section className="py-4 pb-16">
        <div className="container-app px-4 max-w-5xl mx-auto">
          {/* Tombol Kategori Ringkas */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  category === c 
                    ? "bg-primary text-white border-primary shadow-xs" 
                    : "bg-white text-on-surface-variant border-surface-container-high hover:bg-surface-container-low"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid Cards */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="rounded-xl border border-surface-container-high bg-white overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-surface-container-high" />
                  <div className="p-4 space-y-2">
                    <div className="h-2 w-16 bg-surface-container-high rounded" />
                    <div className="h-3 w-full bg-surface-container-high rounded" />
                    <div className="h-3 w-3/4 bg-surface-container-high rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <p className="text-sm">Belum ada cerita di kategori ini.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((article) => (
                <Link key={article.slug} href={`/magazine/${article.slug}`}>
                  <Card className="overflow-hidden h-full group hover:shadow-sm transition-all rounded-xl border border-surface-container-high bg-white flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-surface-container-low">
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 block mb-1">
                          {article.category}
                        </span>
                        <p className="font-bold text-xs md:text-sm text-on-surface leading-snug mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          {article.title}
                        </p>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed mb-3">{article.excerpt}</p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-surface-container-low pt-2.5 text-[10px] text-outline font-medium mt-auto">
                        <span>{formatDateID(article.publishedAt)}</span>
                        <span className="bg-surface-container-low px-2 py-0.5 rounded text-on-surface">
                          {article.readMinutes} m
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}