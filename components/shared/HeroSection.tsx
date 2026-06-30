import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatIDR } from "@/lib/mock";
import { PRICE_HISTORY } from "@/lib/mock";

export default function HeroSection() {
  const latest = PRICE_HISTORY[PRICE_HISTORY.length - 1];
  const prev = PRICE_HISTORY[PRICE_HISTORY.length - 2];
  const priceChange = (((latest.premium - prev.premium) / prev.premium) * 100).toFixed(1);

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-4 md:px-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXQbTQcjmQUuxxSOW5EwDAsyVHPzLls6Dc4CB9VYsrS0LPJoJrvUqMXZgZ1jVuR6MMOAUdjupA0-Y5OdHJa2k3WJkGoqWX8QFJxXg5p23vUB-YBMyB5tLctQYymwvDu1lIiRDvQIwyerKGb2LWsquuS1T6xh6nG4PPjd2sPN84ud9oBCyF_HMh_feJecPJxHhFDfbKxMIBfa_hIOcrjTgYQpBKeHjYpmj6IcP5qlAEVo9E-KaIigbH9cmKsA4zc8sTCSR9ffBIWBHd')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bone-wash via-bone-wash/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl">
        <span
          className="text-clay-earth mb-4 block uppercase tracking-widest"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "0.05em",
          }}
        >
          Warisan Modern
        </span>
        <h1
          className="text-ink-green mb-6 leading-tight"
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "56px",
            lineHeight: "64px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          }}
        >
          Emas Cair dari Aceh: Ekosistem Wewangian Digital
        </h1>
        <p
          className="text-on-surface-variant mb-10 max-w-xl"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "18px",
            lineHeight: "28px",
          }}
        >
          Melestarikan budidaya kuno melalui Blockchain dan AI. Rasakan sinergi
          tradisi dan presisi dalam minyak atsiri paling berharga di dunia.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/marketplace"
            className="bg-patchouli-deep text-white px-8 py-4 rounded-full hover:bg-ink-green transition-all shadow-xl flex items-center gap-2 group"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}
          >
            Jelajahi Ekosistem
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/tracker"
            className="border-2 border-patchouli-deep text-patchouli-deep px-8 py-4 rounded-full hover:bg-patchouli-deep hover:text-white transition-all"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}
          >
            Lihat Dampaknya
          </Link>
        </div>
      </div>

      {/* Floating Stats Plate */}
      <div className="absolute bottom-12 right-4 md:right-16 hidden md:block">
        <div className="bg-surface-container-lowest/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 max-w-xs">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span
              className="text-xs uppercase text-on-surface-variant"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Status Jaringan Langsung
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <p
                className="text-on-surface-variant"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}
              >
                Harga Nilam Saat Ini
              </p>
              <p
                className="text-oil-gold"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", lineHeight: "36px", fontWeight: "600" }}
              >
                {formatIDR(latest.premium)}{" "}
                <span
                  className="text-xs text-green-600"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  +{priceChange}%
                </span>
              </p>
            </div>
            <div className="pt-4 border-t border-sand-gray">
              <p
                className="text-on-surface-variant"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}
              >
                Unit Minyak Terverifikasi
              </p>
              <p
                className="text-ink-green"
                style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", lineHeight: "36px", fontWeight: "600" }}
              >
                41.829 kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}