"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, MapPin, Gavel } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RAW_OIL_LISTINGS, FINISHED_PRODUCTS, formatIDR } from "@/lib/mock";
import { FARMERS } from "@/lib/mock/farmers";
import { UMKM_STORES } from "@/lib/mock/ecosystem";

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("Semua Grade");
  const [tab, setTab] = useState<"b2b" | "b2c">("b2c");

  const filteredRaw = useMemo(
    () =>
      RAW_OIL_LISTINGS.filter((p) => {
        const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.region.toLowerCase().includes(query.toLowerCase());
        const matchGrade = gradeFilter === "Semua Grade" || p.grade === gradeFilter;
        return matchQuery && matchGrade;
      }),
    [query, gradeFilter]
  );

  const filteredFinished = useMemo(
    () => FINISHED_PRODUCTS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <PageShell>
      <section className="bg-primary-fixed/30 py-12 border-b border-surface-container-high">
        <div className="container-app">
          <SectionEyebrow>Pusat Belanja</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-6">Pasar Nilam Aceh</h1>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <Input
                placeholder='Coba: "nilam kadar tinggi untuk parfum mewah"'
                className="pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="md:w-56">
              <option>Semua Grade</option>
              <option>Premium</option>
              <option>Standard</option>
              <option>Economy</option>
            </Select>
            <Button variant="secondary">
              <SlidersHorizontal className="w-4 h-4" /> Filter Lanjutan
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-app">
          <div className="flex gap-2 mb-8 border-b border-surface-container-high">
            <button
              onClick={() => setTab("b2c")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === "b2c" ? "border-clay-earth text-primary" : "border-transparent text-on-surface-variant"
              }`}
            >
              Produk Jadi (B2C)
            </button>
            <button
              onClick={() => setTab("b2b")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === "b2b" ? "border-clay-earth text-primary" : "border-transparent text-on-surface-variant"
              }`}
            >
              Bahan Baku Curah (B2B)
            </button>
          </div>

          {tab === "b2c" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFinished.map((p) => {
                const store = UMKM_STORES.find((s) => s.id === p.umkmId);
                return (
                  <Link key={p.id} href={`/marketplace/${p.id}`}>
                    <Card className="overflow-hidden h-full group hover:shadow-elevation-2 transition-shadow">
                      <div className="relative aspect-square overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          {p.badges.map((b) => (
                            <Badge key={b} variant={b === "AI Verified" ? "ai" : b === "Eco Badge" ? "eco" : "halal"}>
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-outline mb-1">{store?.name}</p>
                        <p className="font-semibold text-on-surface leading-snug mb-2 line-clamp-2">{p.title}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3.5 h-3.5 fill-secondary-fixed text-secondary-fixed" />
                          <span className="text-xs text-on-surface-variant">{p.rating} ({p.reviewCount})</span>
                        </div>
                        <p className="font-display font-bold text-primary">
                          {formatIDR(p.price)} <span className="text-xs font-body font-normal text-outline">/{p.unit}</span>
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaw.map((p) => {
                const farmer = FARMERS.find((f) => f.id === p.farmerId);
                return (
                  <Link key={p.id} href={`/marketplace/${p.id}`}>
                    <Card className="overflow-hidden h-full group hover:shadow-elevation-2 transition-shadow">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                          {p.badges.map((b) => (
                            <Badge key={b} variant={b === "AI Verified" ? "ai" : b === "USK Verified" ? "usk" : "eco"}>
                              {b}
                            </Badge>
                          ))}
                        </div>
                        {p.sellMode === "auction" && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="warning">
                              <Gavel className="w-3 h-3" /> Lelang
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 text-xs text-outline mb-1.5">
                          <MapPin className="w-3 h-3" /> {p.region}
                        </div>
                        <p className="font-semibold text-on-surface leading-snug mb-2 line-clamp-2">{p.title}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-on-surface-variant">oleh {farmer?.name}</span>
                          <span className="text-xs font-mono font-semibold text-clay-earth">PA {p.coa.paLevel}%</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <p className="font-display font-bold text-primary text-lg">
                            {formatIDR(p.pricePerKg)}
                            <span className="text-xs font-body font-normal text-outline">/kg</span>
                          </p>
                          <span className="text-xs text-outline">min. {p.minOrderKg}kg</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
