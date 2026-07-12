import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AtBotWidget } from "@/components/shared/AtBotWidget";
import Script from "next/script";

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
      <head>
        {/* Anti-Google Banner Topbar Overrides dengan Proteksi Mismatch Hydration */}
        <style
          suppressHydrationWarning // 👈 MENYEMBUNYIKAN WARNING HYDRATION MISMATCH AKIBAT FORMAT FORMATTING CSS STRING
          dangerouslySetInnerHTML={{
            __html: `
              /* 1. Sembunyikan semua jenis frame, banner, dan iframe bawaan Google Translate */
              .goog-te-banner-frame,
              .goog-te-banner,
              .goog-te-gadget,
              #goog-gt-tt,
              .goog-te-balloon-frame,
              .skiptranslate {
                display: none !important;
                visibility: hidden !important;
              }

              /* 2. Kunci body agar tidak tergeser ke bawah akibat inline-style paksaan Google */
              body {
                top: 0px !important;
                position: static !important;
              }

              /* 3. Sembunyikan highlight kuning saat teks selesai diterjemahkan */
              .goog-text-highlight {
                background-color: transparent !important;
                box-shadow: none !important;
              }
            `,
          }}
        />
      </head>
      <body className="font-body bg-surface text-on-surface relative">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="relative z-[2]">{children}</div>
        <AtBotWidget />

        {/* Elemen jangkar yang wajib ada tapi disembunyikan */}
        <div id="google_translate_element" style={{ display: 'none' }} />

        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'en,id',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}