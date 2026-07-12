"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, MapPin, Sparkles, ShoppingCart, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/components/layout/Navbar"; // 👈 Dikembalikan ke file Navbar
import { useCartStore } from "@/lib/store"; // 👈 useCartStore tetap mengambil dari store global
import { CartNotificationModal } from "@/components/ui/CartNotificationModal"; 

// ── IMPORT DATA PRODUK ASLI
import { RAW_OIL_LISTINGS, FINISHED_PRODUCTS } from "@/lib/mock/products";

// ── Kamus Bahasa (Tanda petik sudah dibersihkan total dari karakter ilegal)
const T_MARKET = {
  eyebrow: { id: "Pusat Dagang", en: "Trading Center" },
  title: { id: "Pasar Nilam Aceh", en: "Aceh Patchouli Marketplace" },
  searchPlaceholder: { 
    id: "Coba: minyak kadar pa tinggi atau parfum", 
    en: "Try: high PA grade oil or organic perfume" 
  },
  allGrades: { id: "Semua Kualitas", en: "All Quality Grades" },
  advFilter: { id: "Filter Lanjutan", en: "Advanced Filter" },
  tabRaw: { id: "Minyak Nilam Murni", en: "Pure Patchouli Oil" },
  tabFinished: { id: "Produk Jadi Turunan", en: "Finished Products" },
  aiBadge: { id: "Terverifikasi AI", en: "AI Verified" },
  uskBadge: { id: "Uji Lab ARC", en: "ARC Lab Tested" },
  auctionBadge: { id: "Lelang", en: "Auction" },
  minOrder: { id: "min.", en: "min." },
  btnBuy: { id: "Beli Sekarang", en: "Buy Now" }
};

export default function MarketplacePage() {
  const lang = useLang();
  const currentLang = (lang ? lang.toLowerCase() : "id") as "id" | "en";

  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("Semua Grade");
  const [tab, setTab] = useState<"raw" | "finished">("finished");

  const [modalOpen, setModalOpen] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  const addItem = useCartStore((state) => state.addItem);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const filteredRaw = useMemo(() => {
    return RAW_OIL_LISTINGS.filter((p) => {
      const title = p.title || "";
      const matchQuery = title.toLowerCase().includes(query.toLowerCase()) || p.region.toLowerCase().includes(query.toLowerCase());
      const matchGrade = gradeFilter === "Semua Grade" || p.grade === gradeFilter;
      return matchQuery && matchGrade;
    });
  }, [query, gradeFilter]);

  const filteredFinished = useMemo(() => {
    return FINISHED_PRODUCTS.filter((p) => {
      const title = p.title || "";
      const description = p.description || "";
      return title.toLowerCase().includes(query.toLowerCase()) || description.toLowerCase().includes(query.toLowerCase());
    });
  }, [query]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    e.stopPropagation();

    const price = tab === "finished" ? product.price : product.pricePerKg;

    addItem({
      id: String(product.id),
      name: product.title,
      price: price,
      image: product.imageUrl || "/images/products/default.jpg",
      qty: 1,
    });

    setAddedProductName(product.title);
    setModalOpen(true);
  };

  return (
    <PageShell>
      {/* Top Search Hero Section */}
      <section className="bg-primary-fixed/20 py-12 border-b border-surface-container-high relative overflow-hidden">
        <div className="container-app relative z-10">
          <SectionEyebrow>{T_MARKET.eyebrow[currentLang]}</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-6">
            {T_MARKET.title[currentLang]}
          </h1>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <Input
                placeholder={T_MARKET.searchPlaceholder[currentLang]}
                className="pl-12 rounded-xl bg-white border-sand-gray text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            {tab === "raw" && (
              <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="md:w-56 rounded-xl bg-white text-sm">
                <option value="Semua Grade">{T_MARKET.allGrades[currentLang]}</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
                <option value="Economy">Economy</option>
              </Select>
            )}

            <Button variant="secondary" className="rounded-xl text-sm font-medium">
              <SlidersHorizontal className="w-4 h-4 mr-1.5" /> {T_MARKET.advFilter[currentLang]}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Catalog Tabs */}
      <section className="py-10 bg-surface">
        <div className="container-app">
          <div className="flex gap-4 mb-8 border-b border-surface-container-high">
            <button
              onClick={() => setTab("finished")}
              className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all ${
                tab === "finished" ? "border-clay-earth text-primary" : "border-transparent text-outline hover:text-primary"
              }`}
            >
              {T_MARKET.tabFinished[currentLang]}
            </button>
            <button
              onClick={() => setTab("raw")}
              className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all ${
                tab === "raw" ? "border-clay-earth text-primary" : "border-transparent text-outline hover:text-primary"
              }`}
            >
              {T_MARKET.tabRaw[currentLang]}
            </button>
          </div>

          {/* Grid Produk Jadi Turunan */}
          {tab === "finished" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFinished.map((p) => (
                <Card key={p.id} className="relative overflow-hidden h-full flex flex-col justify-between hover:shadow-xl rounded-2xl border border-surface-container-high transition-all duration-300 bg-white group">
                  <div>
                    <Link href={`/marketplace/${p.id}`} className="block relative aspect-square overflow-hidden bg-bone-wash">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        {p.badges?.map((b) => (
                          <Badge key={b} variant="ai" className="flex items-center gap-0.5 shadow-sm text-[10px]">
                            <Sparkles className="w-3 h-3 text-amber-500 inline" /> {T_MARKET.aiBadge[currentLang]}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                    
                    <div className="p-4 pb-0">
                      <p className="text-xs font-semibold text-outline mb-1">
                        {p.id === "fp-sabun-nilam" || p.id === "fp-lilin-aromaterapi" ? "UMKM Aceh Scent" : "UMKM Seulawah Parfum"}
                      </p>
                      <Link href={`/marketplace/${p.id}`}>
                        <p className="font-semibold text-on-surface text-sm leading-snug mb-2 line-clamp-2 h-10 hover:text-emerald-700 transition-colors">
                          {p.title}
                        </p>
                      </Link>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-on-surface-variant">{p.rating} <span className="text-outline">({p.reviewCount})</span></span>
                      </div>
                      <p className="font-display font-bold text-primary text-base">
                        {formatCurrency(p.price)} <span className="text-xs font-body font-normal text-outline">/{p.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-3 flex items-center gap-2 border-t border-stone-50 mt-4 relative z-20">
                    <button 
                      onClick={(e) => handleAddToCart(e, p)}
                      className="p-2 border border-stone-200 hover:border-stone-900 rounded-xl transition-colors bg-stone-50 text-stone-700"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <Link 
                      href={`/checkout?productId=${p.id}&name=${encodeURIComponent(p.title)}&price=${p.price}`}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
                    >
                      {T_MARKET.btnBuy[currentLang]} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Grid Minyak Nilam Murni */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaw.map((p) => (
                <Card key={p.id} className="relative overflow-hidden h-full flex flex-col justify-between hover:shadow-xl rounded-2xl border border-surface-container-high transition-all duration-300 bg-white group">
                  <div>
                    <Link href={`/marketplace/${p.id}`} className="block relative aspect-[4/3] overflow-hidden bg-bone-wash">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        {p.badges?.includes("AI Verified") && (
                          <Badge variant="ai" className="text-[10px]"><Sparkles className="w-2.5 h-2.5 text-amber-500 inline mr-0.5" /> {T_MARKET.aiBadge[currentLang]}</Badge>
                        )}
                        {p.badges?.includes("USK Verified") && (
                          <Badge variant="usk" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">{T_MARKET.uskBadge[currentLang]}</Badge>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-4 pb-0">
                      <div className="flex items-center gap-1 text-xs font-semibold text-outline mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-clay-earth" /> {p.region}
                      </div>
                      <Link href={`/marketplace/${p.id}`}>
                        <p className="font-semibold text-on-surface text-sm leading-snug mb-2 line-clamp-2 h-10 hover:text-emerald-700 transition-colors">
                          {p.title}
                        </p>
                      </Link>
                      
                      {/* BARIS BARU YANG SUDAH DIBERSIHKAN DARI STRING TANDA PETIK TERPUTUS */}
                      <div className="flex items-center justify-between mb-3 bg-stone-50 p-2 rounded-xl border border-stone-100">
                        <span className="text-xs text-outline font-medium">Grade: <span className="text-primary font-bold">{p.grade}</span></span>
                        <span className="text-xs font-mono font-bold text-clay-earth">PA {p.coa?.paLevel}%</span>
                      </div>
                      
                      <div className="flex items-baseline justify-between">
                        <p className="font-display font-bold text-primary text-base">
                          {formatCurrency(p.pricePerKg)}
                          <span className="text-xs font-body font-normal text-outline">/kg</span>
                        </p>
                        <span className="text-xs text-outline">{T_MARKET.minOrder[currentLang]} {p.minOrderKg}kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-3 flex items-center gap-2 border-t border-stone-50 mt-4 relative z-20">
                    <button 
                      onClick={(e) => handleAddToCart(e, p)}
                      className="p-2 border border-stone-200 hover:border-stone-900 rounded-xl transition-colors bg-stone-50 text-stone-700"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <Link 
                      href={`/checkout?productId=${p.id}&name=${encodeURIComponent(p.title)}&price=${p.pricePerKg}`}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
                    >
                      {T_MARKET.btnBuy[currentLang]} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <CartNotificationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        productName={addedProductName} 
      />
    </PageShell>
  );
}