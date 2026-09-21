"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { useLang } from "@/components/layout/Navbar";

export function FeatureCardsSection() {
  const lang = useLang();
  const isId = lang === "ID";

  return (
    <section className="py-20 bg-[#fbf9f4]">
      <div className="container-app">
        {/* Main Section Heading - Matching Typography in Reference */}
        <div className="max-w-4xl mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] text-stone-900 leading-[1.2] font-normal tracking-tight">
            {isId ? (
              <>
                Menghubungkan <span className="font-bold text-emerald-950">petani dan pelaku industri</span> untuk ekosistem nilam bernilai tinggi.
              </>
            ) : (
              <>
                Connecting <span className="font-bold text-emerald-950">farmers and global industries</span> for a high-value patchouli ecosystem.
              </>
            )}
          </h2>
        </div>

        {/* 2 Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: NilamTrace */}
          <div className="relative rounded-[32px] overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-8 shadow-xl group">
            {/* Background Image with Dark Vignette Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/nilamtrace-card.jpg"
                alt="NilamTrace Supply Chain"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/20" />
            </div>

            {/* Top Header & Logo */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white tracking-wide">atSira<span className="text-emerald-400">.</span></span>
              </div>

              <h3 className="text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                <span className="font-black">NilamTrace</span>{" "}
                <span className="font-light text-white/90">
                  {isId ? "Rantai Pasok Nilam" : "Supply Chain Trace"}
                </span>
              </h3>
            </div>

            {/* Bottom Glassmorphic Card */}
            <div className="relative z-10 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 mt-auto">
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                {isId
                  ? "Jelajahi transparansi rantai pasok minyak nilam dari kebun petani binaan hingga tangan industri. Dilengkapi sertifikasi digital QR dan verifikasi kualitas laboratorium ARC-USK secara akurat."
                  : "Explore patchouli supply chain transparency from registered farmer plantations to global industries. Powered by digital QR certification and accurate ARC-USK laboratory quality verification."}
              </p>

              <div>
                <Link
                  href="/traceability"
                  className="inline-flex items-center justify-center gap-2 bg-[#4c845b] hover:bg-[#3d6d4a] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  <span>{isId ? "Lacak Produk Sekarang" : "Trace Product Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: NilamStory */}
          <div className="relative rounded-[32px] overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-8 shadow-xl group">
            {/* Background Image with Dark Vignette Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/nilamstory-card.jpg"
                alt="NilamStory Community & Insights"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/20" />
            </div>

            {/* Top Header & Logo */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white tracking-wide">atSira<span className="text-amber-400">.</span></span>
              </div>

              <h3 className="text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                <span className="font-black">NilamStory</span>{" "}
                <span className="font-light text-white/90">
                  {isId ? "Kisah & Wawasan Lapangan" : "Stories & Field Insights"}
                </span>
              </h3>
            </div>

            {/* Bottom Glassmorphic Card */}
            <div className="relative z-10 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 mt-auto">
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                {isId
                  ? "Temukan kisah inspiratif para petani dan Pemasta di pelosok Aceh, inovasi riset ARC-USK, panduan budidaya bernilai tinggi, serta wawasan tren harga minyak nilam dunia terkini."
                  : "Discover inspiring stories of patchouli farmers and Pemasta across Aceh, ARC-USK research breakthroughs, high-yield cultivation guides, and live global patchouli pricing trends."}
              </p>

              <div>
                <Link
                  href="/magazine"
                  className="inline-flex items-center justify-center gap-2 bg-[#b88e28] hover:bg-[#9e791f] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  <span>{isId ? "Jelajahi Cerita" : "Explore Stories"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureCardsSection;
