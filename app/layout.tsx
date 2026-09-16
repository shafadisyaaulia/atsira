import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AtBotWidget } from "@/components/shared/AtBotWidget";
import Script from "next/script";
import ClientLayout from "@/components/layout/ClientLayout";

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
    <html 
      lang="id" 
      className={`${playfair.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Mengizinkan fitur penerjemah Google berjalan, namun membersihkan tampilan bar atas yang mengganggu */}
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              /* Sembunyikan pop-up bar abu-abu Google Translate yang muncul di atas browser */
              .goog-te-banner-frame,
              .goog-te-banner,
              .goog-te-balloon-frame,
              #goog-gt-tt {
                display: none !important;
                visibility: hidden !important;
              }

              body {
                top: 0px !important;
                position: static !important;
              }

              /* Sembunyikan efek highlight kuning pada teks terpilih */
              .goog-text-highlight {
                background-color: transparent !important;
                box-shadow: none !important;
              }

              /* Styling opsional untuk tombol pilih bahasa Google agar terlihat rapi di pojok kanan bawah jika diperlukan */
              .google-translate-container {
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 4px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
            `,
          }}
        />
      </head>
      <body className="font-body bg-surface text-on-surface relative">
        <ClientLayout>
            <div className="grain-overlay" aria-hidden="true" />
            <div className="relative z-[2]">{children}</div>
            <AtBotWidget />
        </ClientLayout>

        {/* Wadah selektor bahasa diletakkan secara presisi agar Google skrip bisa mendeteksi perubahan state halaman */}
       {/* Elemen jangkar Google Translate */}
        <div id="google_translate_element" style={{ display: 'none' }} />

        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'en,id',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: true
              }, 'google_translate_element');
            }

            // TRIK AMPUH: Mengamati perubahan halaman Next.js secara real-time
            // Setiap kali teks di layar berubah karena pindah page, Google Translate dipaksa memindai ulang.
            if (typeof window !== 'undefined') {
              const observer = new MutationObserver(() => {
                const translateElem = document.getElementById('google_translate_element');
                if (translateElem && window.google && google.translate) {
                  // Memicu ulang proses penerjemahan otomatis pada teks baru
                  const select = document.querySelector('.goog-te-combo');
                  if (select) {
                    select.dispatchEvent(new Event('change'));
                  }
                }
              });

              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
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