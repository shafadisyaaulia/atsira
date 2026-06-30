"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, FileText, Download } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { MAGAZINE_ARTICLES, formatDateID } from "@/lib/mock";

const CATEGORIES = ["Semua", "Tips Budidaya", "Riset ARC-USK", "Profil Petani Sukses", "Panduan Bisnis Parfum"] as const;

export default function MagazinePage() {
  const [category, setCategory] = useState<string>("Semua");
  const filtered = category === "Semua" ? MAGAZINE_ARTICLES : MAGAZINE_ARTICLES.filter((a) => a.category === category);
  const featured = MAGAZINE_ARTICLES.find((a) => a.featured);

  return (
    <PageShell>
      <section className="bg-primary-fixed/30 py-12 border-b border-surface-container-high">
        <div className="container-app">
          <SectionEyebrow>Dari Kebun ke Cerita</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-3">
            ATSIRA Magazine & Community Hub
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Kanal edukasi seputar budidaya nilam, riset ARC-USK, dan kisah-kisah dari ekosistem.
          </p>
        </div>
      </section>

      {featured && (
        <section className="py-12">
          <div className="container-app">
            <Link href={`/magazine/${featured.slug}`}>
              <Card className="overflow-hidden grid md:grid-cols-2 hover:shadow-elevation-2 transition-shadow">
                <div className="h-64 md:h-full">
                  <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-7 flex flex-col justify-center">
                  <Badge variant="neutral" className="w-fit mb-3">
                    {featured.category}
                  </Badge>
                  <h2 className="font-display text-headline-md text-primary mb-3 text-balance">{featured.title}</h2>
                  <p className="text-sm text-on-surface-variant mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-outline">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {featured.readMinutes} menit baca
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      <section className="py-6 pb-16">
        <div className="container-app">
          <div className="flex gap-2 mb-8 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((article) => (
              <Link key={article.slug} href={`/magazine/${article.slug}`}>
                <Card className="overflow-hidden h-full group hover:shadow-elevation-2 transition-shadow">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <Badge variant="neutral" className="mb-3">
                      {article.category}
                    </Badge>
                    <p className="font-semibold text-on-surface leading-snug mb-2 line-clamp-2">{article.title}</p>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-outline">
                      <span>{formatDateID(article.publishedAt)}</span>
                      <span>·</span>
                      <span>{article.readMinutes} menit</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Documentation Center */}
          <Card className="p-7 bg-surface-container-low">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="w-5 h-5 text-primary" />
              <p className="font-semibold text-on-surface">Documentation Center</p>
            </div>
            <p className="text-sm text-on-surface-variant mb-5">
              Unduh dokumen pendukung untuk pengajuan sertifikasi BPOM dan Halal MUI.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {["Panduan Pengajuan Sertifikasi Halal MUI", "Checklist Notifikasi Kosmetik BPOM", "Template Dokumentasi Proses Produksi", "Formulir Traceability Bahan Baku"].map((doc) => (
                <div key={doc} className="flex items-center justify-between bg-surface-container-lowest rounded-md px-4 py-3 border border-surface-container-high">
                  <span className="text-sm text-on-surface">{doc}</span>
                  <Download className="w-4 h-4 text-outline flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
