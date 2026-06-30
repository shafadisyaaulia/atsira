import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AtBotWidget } from "@/components/shared/AtBotWidget";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATSIRA — Digital Fragrance Ecosystem",
  description:
    "Ekosistem wewangian digital yang menghubungkan petani, penyuling, peneliti ARC-USK, UMKM parfum, dan konsumen dalam satu rantai nilai nilam Aceh yang transparan dan terverifikasi.",
  keywords: ["nilam aceh", "patchouli oil", "minyak atsiri", "ATSIRA", "fragrance ecosystem"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body bg-surface text-on-surface relative">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="relative z-[2]">{children}</div>
        <AtBotWidget />
      </body>
    </html>
  );
}
