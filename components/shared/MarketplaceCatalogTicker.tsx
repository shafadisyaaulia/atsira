"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Star } from "lucide-react";
import { formatIDR } from "@/lib/mock";
import { RAW_OIL_LISTINGS, FINISHED_PRODUCTS } from "@/lib/mock/products";
import { useLang } from "@/components/layout/Navbar";

interface CatalogItem {
  id: string;
  title: string;
  category: string;
  price: number;
  unit: string;
  imageUrl: string;
  badge: string;
  highlight: string;
  href: string;
}

export function MarketplaceCatalogTicker() {
  const lang = useLang();
  const isId = lang === "ID";

  // Gabungkan listing minyak mentah dan produk jadi
  const items: CatalogItem[] = [
    ...RAW_OIL_LISTINGS.map((r) => ({
      id: r.id,
      title: r.title,
      category: isId ? "Minyak Nilam Mentah" : "Raw Patchouli Oil",
      price: r.pricePerKg,
      unit: isId ? "/ kg" : "/ kg",
      imageUrl: r.imageUrl,
      badge: r.grade,
      highlight: `PA ${r.coa?.paLevel?.toFixed(1) || "34.0"}%`,
      href: "/marketplace",
    })),
    ...FINISHED_PRODUCTS.map((f) => ({
      id: f.id,
      title: f.title,
      category: f.category,
      price: f.price,
      unit: f.unit ? `/ ${f.unit}` : "",
      imageUrl: f.imageUrl,
      badge: isId ? "Produk Jadi" : "Finished Product",
      highlight: `★ ${f.rating.toFixed(1)}`,
      href: "/marketplace",
    })),
  ];

  // Gandakan array 2x agar animasi loop CSS marquee berjalan mulus tanpa celah
  const displayItems = [...items, ...items];

  return (
    <div className="w-full pt-2 pb-2 overflow-hidden relative">
      <div className="container-app mb-3 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-emerald-300/80 text-emerald-950 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isId ? "Katalog Unggulan Terverifikasi" : "Featured Verified Catalog"}</span>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-950 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-sm hover:bg-emerald-900 hover:text-white group transition-all"
        >
          <span>{isId ? "Buka Marketplace Lengkap" : "Explore Full Marketplace"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Marquee Track Wrapper with fade edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Shadows */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-r from-bone-wash/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-l from-bone-wash/80 to-transparent z-10" />

        {/* Marquee Inner */}
        <div className="animate-marquee-smooth flex gap-4 py-2 px-4">
          {displayItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={item.href}
              className="w-[240px] sm:w-[270px] flex-shrink-0 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-md hover:shadow-xl hover:border-emerald-500/50 hover:bg-white transition-all duration-300 group flex flex-col overflow-hidden p-3 relative"
            >
              {/* Image Box */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-50/80 mb-2.5 relative flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-contain p-1.5 group-hover:scale-108 transition-transform duration-500"
                />
                
                {/* Badge Top Left */}
                <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {item.badge}
                </div>

                {/* Highlight Badge Top Right (PA / Rating) */}
                <div className="absolute top-2 right-2 bg-amber-400/95 text-stone-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  {item.highlight.startsWith("★") ? (
                    <Star className="w-2.5 h-2.5 fill-stone-950" />
                  ) : (
                    <ShieldCheck className="w-2.5 h-2.5 text-stone-950" />
                  )}
                  <span>{item.highlight.replace("★", "").trim()}</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/90 mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="font-display font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Price & Action */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-stone-400 font-medium block leading-none mb-0.5">
                      {isId ? "Mulai dari" : "From"}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-stone-900">
                      {formatIDR(item.price)}
                      <span className="text-[9px] text-stone-500 font-normal ml-0.5">{item.unit}</span>
                    </span>
                  </div>

                  <span className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceCatalogTicker;
