import type { Metadata } from "next";
import { Playfair_Display, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "@/components/layout/ClientLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "atSira — Digital Fragrance Ecosystem",
  description:
    "Ekosistem wewangian digital yang menghubungkan petani, penyuling, peneliti ARC-USK, UMKM parfum, dan konsumen dalam satu rantai nilai nilam Aceh yang transparan dan terverifikasi.",
  keywords: ["nilam aceh", "patchouli oil", "minyak atsiri", "atSira", "fragrance ecosystem"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="id" 
      className={`${playfair.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
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
        </ClientLayout>

        {/* Wadah selektor bahasa diletakkan secara presisi agar Google skrip bisa mendeteksi perubahan state halaman */}
       {/* Elemen jangkar Google Translate */}
        <div id="google_translate_element" style={{ display: 'none' }} />

        <Script id="google-translate-init" strategy="lazyOnload">
          {`
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new google.translate.TranslateElement({
                  pageLanguage: 'id',
                  includedLanguages: 'en,id',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: true
                }, 'google_translate_element');
              }
            }

            if (typeof window !== 'undefined') {
              let timer;
              const observer = new MutationObserver(() => {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                  const translateElem = document.getElementById('google_translate_element');
                  if (translateElem && window.google && window.google.translate) {
                    const select = document.querySelector('.goog-te-combo');
                    if (select && select.value && select.value !== 'id') {
                      select.dispatchEvent(new Event('change'));
                    }
                  }
                }, 800);
              });

              observer.observe(document.body, {
                childList: true,
                subtree: false
              });
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}