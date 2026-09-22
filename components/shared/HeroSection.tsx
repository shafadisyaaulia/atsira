"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatIDR } from "@/lib/mock";
import { PRICE_HISTORY } from "@/lib/mock";
import { useLang } from "@/components/layout/Navbar";
import { MarketplaceCatalogTicker } from "@/components/shared/MarketplaceCatalogTicker";

const T_HERO = {
  badge: {
    ID: "",
    EN: ""
  },
  title: {
    ID: "Marketplace Nilam Aceh",
    EN: "Aceh Patchouli Marketplace"
  },
  desc: {
    ID: "Kenali perjalanan minyak nilam Aceh dari awal sampai akhir.",
    EN: "Discover the journey of Aceh patchouli oil from start to finish."
  },
  btnExplore: {
    ID: "Jelajahi atSira",
    EN: "Explore atSira"
  },
  btnImpact: {
    ID: "Lihat Dampaknya",
    EN: "View Our Impact"
  },
  statusNetwork: {
    ID: "Status Jaringan Langsung",
    EN: "Live Network Status"
  },
  priceTitle: {
    ID: "Harga Nilam Saat Ini",
    EN: "Current Patchouli Price"
  },
  verifiedUnit: {
    ID: "Unit Minyak Terverifikasi",
    EN: "Verified Oil Units"
  }
};

export default function HeroSection() {
  const lang = useLang();

  const latest = PRICE_HISTORY[PRICE_HISTORY.length - 1];
  const prev = PRICE_HISTORY[PRICE_HISTORY.length - 2];
  const priceChange = (((latest.premium - prev.premium) / prev.premium) * 100).toFixed(1);

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-24 lg:pt-28 pb-6 overflow-hidden">
      {/* Unified Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Hero background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bone-wash via-bone-wash/75 to-transparent z-[1]" />
      </div>

      {/* Top / Main Hero Content */}
      <div className="relative z-10 container-app w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-4 pb-2 my-auto">
        <div className="max-w-2xl">
          {T_HERO.badge[lang] && (
            <span
              className="text-clay-earth mb-3 block uppercase tracking-widest text-xs font-bold"
            >
              {T_HERO.badge[lang]}
            </span>
          )}
          <h1
            className="text-ink-green mb-4 leading-tight"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "48px",
              lineHeight: "56px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            }}
          >
            {T_HERO.title[lang]}
          </h1>
          <p
            className="text-on-surface-variant mb-6 max-w-xl text-base sm:text-lg leading-relaxed"
          >
            {T_HERO.desc[lang]}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/marketplace"
              className="bg-patchouli-deep text-white px-7 py-3.5 rounded-full hover:bg-ink-green transition-all shadow-xl flex items-center gap-2 group text-sm font-semibold"
            >
              {T_HERO.btnExplore[lang]}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tracker"
              className="border-2 border-patchouli-deep text-patchouli-deep px-7 py-3.5 rounded-full hover:bg-patchouli-deep hover:text-white transition-all text-sm font-semibold"
            >
              {T_HERO.btnImpact[lang]}
            </Link>
          </div>
        </div>

        {/* Floating Stats Plate on Right */}
        <div className="hidden lg:block flex-shrink-0">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/60 w-[260px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span
                className="text-[10px] uppercase font-bold tracking-wider text-stone-600"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {T_HERO.statusNetwork[lang]}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-stone-500 text-xs font-semibold">
                  {T_HERO.priceTitle[lang]}
                </p>
                <p
                  className="text-oil-gold"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", lineHeight: "30px", fontWeight: "700" }}
                >
                  {formatIDR(latest.premium)}{" "}
                  <span
                    className="text-[11px] text-green-600 font-semibold"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    +{priceChange}%
                  </span>
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/60">
                <p className="text-stone-500 text-xs font-semibold">
                  {T_HERO.verifiedUnit[lang]}
                </p>
                <p
                  className="text-ink-green"
                  style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", lineHeight: "30px", fontWeight: "700" }}
                >
                  41.829 kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Continuous Moving Catalog directly in Hero Viewport */}
      <div className="relative z-10 w-full mt-2">
        <MarketplaceCatalogTicker />
      </div>
    </section>
  );
}