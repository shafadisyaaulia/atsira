"use client";

import { useState } from "react";
import { Search, HelpCircle, ChevronDown, MessageCircle, Mail, Phone, ShieldCheck, ShoppingBag, LifeBuoy, FileText, Download } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

// ====== KAMUS BAHASA LOKAL ======
const T = {
  title: { ID: "Help Center & Dukungan", EN: "Help Center & Support" },
  subtitle: { ID: "Punya pertanyaan seputar ATSIRA? Temukan jawaban instan dan unduh buku panduan aplikasi di bawah ini.", EN: "Have questions about ATSIRA? Find instant answers and download application user guides below." },
  searchPlaceholder: { ID: "Cari bantuan (misal: cara jual, lacak QR, daftar akun)...", EN: "Search help (e.g., how to sell, track QR, register account)..." },
  
  pdfTitle: { ID: "Buku Panduan Penggunaan Aplikasi (PDF)", EN: "Application User Manuals (PDF)" },
  pdfSubtitle: { ID: "Pelajari panduan lengkap langkah demi langkah penggunaan sistem mulai dari proses Login hingga Logout.", EN: "Learn step-by-step complete system guides from Login to Logout processes." },
  pdfBuyerDesc: { ID: "Panduan alur mencari produk, check out, keranjang belanja, hingga pelacakan NilamTrace.", EN: "Guide for product searching, check-out, shopping cart, and NilamTrace tracking." },
  pdfSellerDesc: { ID: "Panduan kelola produk toko, proses pesanan, hingga penggunaan fitur QualitySense AI.", EN: "Guide for product management, processing orders, and using QualitySense AI feature." },
  pdfBtn: { ID: "Unduh Panduan (PDF)", EN: "Download Manual (PDF)" },

  contactTitle: { ID: "Masih Butuh Bantuan?", EN: "Still Need Help?" },
  contactSubtitle: { ID: "Tim support kami siap melayani Anda kapan saja.", EN: "Our support team is ready to serve you anytime." },
};

// ====== MOCK DATA FAQ BERDASARKAN KATEGORI + WARNA KHUSUS ======
const FAQ_DATA = [
  {
    category: "Umum & Akun",
    icon: HelpCircle,
    colorClasses: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "border-l-emerald-500",
      iconBg: "bg-emerald-500 text-white"
    },
    items: [
      {
        q: "Apa itu platform ATSIRA?",
        a: "ATSIRA adalah platform ekosistem digital terintegrasi untuk rantai pasok minyak nilam. Platform ini menghubungkan Petani/Seller, Komunitas PEMASTA untuk transparansi harga, dan konsumen umum dalam satu jaringan tepercaya."
      },
      {
        q: "Bagaimana cara beralih bahasa di platform?",
        a: "Anda cukup mengklik tombol bahasa (ID / EN) di pojok kanan atas Navbar untuk mengubah seluruh teks panduan secara instan."
      }
    ]
  },
  {
    category: "Marketplace & Transaksi",
    icon: ShoppingBag,
    colorClasses: {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "border-l-amber-500",
      iconBg: "bg-amber-500 text-white"
    },
    items: [
      {
        q: "Bagaimana cara membeli produk di Marketplace?",
        a: "Masuk ke menu Marketplace di Navbar, pilih produk minyak nilam mentah atau produk turunan jadi yang Anda inginkan, masukkan ke keranjang belanja, lalu klik check out untuk menyelesaikan pembayaran."
      },
      {
        q: "Di mana fitur QualitySense AI milik Seller?",
        a: "Fitur QualitySense AI sengaja disembunyikan dari halaman publik demi keamanan. Fitur ini hanya bisa diakses oleh akun dengan role Seller setelah melakukan login masuk ke area Dashboard Seller mereka."
      }
    ]
  },
  {
    category: "NilamTrace & Traceability",
    icon: ShieldCheck,
    colorClasses: {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      accent: "border-l-blue-500",
      iconBg: "bg-blue-500 text-white"
    },
    items: [
      {
        q: "Bagaimana cara kerja fitur NilamTrace?",
        a: "NilamTrace melacak keaslian dokumen dan asal-usul minyak nilam dari hulu ke hilir. Pembeli tinggal memasukkan kode batch atau memindai QR Code produk di halaman Pelacakan untuk melihat riwayat panen dan penyulingan secara transparan."
      }
    ]
  }
];

export default function HelpCenterPage() {
  const lang = typeof window !== "undefined" && localStorage.getItem("lang") === "EN" ? "EN" : "ID";

  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-gradient-to-b from-surface via-surface-container-lowest/20 to-surface py-12">
        <div className="container-app max-w-4xl px-4 mx-auto space-y-14">
          
          {/* 1. HEADER & BAR PENCARIAN */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex p-3 bg-gradient-to-tr from-primary to-amber-500 rounded-2xl text-white shadow-md mb-2">
              <LifeBuoy className="w-8 h-8 animate-spin-slow" />
            </div>
            <h1 className="font-display text-3xl font-black text-on-surface tracking-tight bg-gradient-to-r from-primary via-emerald-700 to-amber-600 bg-clip-text text-transparent">
              {T.title[lang]}
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {T.subtitle[lang]}
            </p>
            
            <div className="relative mt-6 bg-surface border-2 border-primary/20 rounded-2xl px-5 py-3.5 flex items-center shadow-md focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <Search className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={T.searchPlaceholder[lang]}
                className="w-full bg-transparent text-sm outline-none text-on-surface placeholder:text-outline/60"
              />
            </div>
          </div>

          {/* 2. SEKSI PREMIUM: UNDUH BUKU PANDUAN PDF (STEP BY STEP) */}
          <div className="bg-surface-container-low/40 rounded-3xl p-6 border border-surface-container-high space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-black text-base">
                <FileText className="w-5 h-5 text-amber-600" />
                <h2>{T.pdfTitle[lang]}</h2>
              </div>
              <p className="text-xs text-on-surface-variant">{T.pdfSubtitle[lang]}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kartu Panduan Sisi Buyer (Warna Oranye Kekuningan) */}
              <div className="bg-surface border-2 border-amber-500/10 hover:border-amber-500/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                      ROLE: BUYER / PEMBELI
                    </span>
                    <FileText className="w-5 h-5 text-amber-500 group-hover:animate-bounce" />
                  </div>
                  <h3 className="text-sm font-bold text-on-surface pt-1">Panduan Aktor Buyer</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{T.pdfBuyerDesc[lang]}</p>
                </div>
                {/* Atur rute file PDF Anda di properti href */}
                <a 
                  href="/docs/panduan-atsira-buyer.pdf" 
                  download 
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {T.pdfBtn[lang]}
                </a>
              </div>

              {/* Kartu Panduan Sisi Seller (Warna Hijau Daun Nilam) */}
              <div className="bg-surface border-2 border-emerald-500/10 hover:border-emerald-500/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                      ROLE: SELLER / PETANI
                    </span>
                    <FileText className="w-5 h-5 text-emerald-500 group-hover:animate-bounce" />
                  </div>
                  <h3 className="text-sm font-bold text-on-surface pt-1">Panduan Aktor Seller</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{T.pdfSellerDesc[lang]}</p>
                </div>
                {/* Atur rute file PDF Anda di properti href */}
                <a 
                  href="/docs/panduan-atsira-seller.pdf" 
                  download 
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {T.pdfBtn[lang]}
                </a>
              </div>
            </div>
          </div>

          {/* 3. AKORDEON FAQ BERWARNA WARNI */}
          <div className="space-y-10">
            {FAQ_DATA.map((cat, catIdx) => {
              const CatIcon = cat.icon;
              
              const filteredItems = cat.items.filter(item => 
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={catIdx} className="space-y-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${cat.colorClasses.badge}`}>
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{cat.category}</span>
                  </div>

                  <div className="space-y-3">
                    {filteredItems.map((item, itemIdx) => {
                      const isCurrentOpen = openIndex === `${catIdx}-${itemIdx}`;
                      return (
                        <div 
                          key={itemIdx} 
                          className={`bg-surface border border-surface-container-high border-l-4 ${cat.colorClasses.accent} rounded-xl overflow-hidden transition-all shadow-sm hover:shadow-md`}
                        >
                          <button
                            onClick={() => toggleAccordion(catIdx, itemIdx)}
                            className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                          >
                            <span className={isCurrentOpen ? "text-on-surface font-bold" : ""}>{item.q}</span>
                            <div className={`p-1 rounded-full transition-all ${isCurrentOpen ? cat.colorClasses.iconBg : "bg-surface-container-high"}`}>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCurrentOpen ? "rotate-180 text-white" : "text-outline"}`} />
                            </div>
                          </button>

                          {isCurrentOpen && (
                            <div className="px-5 pb-5 pt-2 text-sm text-on-surface-variant bg-gradient-to-b from-surface to-surface-container-lowest/40 border-t border-surface-container-low leading-relaxed animate-in slide-in-from-top-2 duration-200">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. PORTAL KONTAK BANTUAN */}
          <div className="bg-gradient-to-tr from-surface via-surface-container-lowest to-primary-container/10 border-2 border-primary/10 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />

            <div className="space-y-2 relative z-10">
              <h2 className="text-xl font-black text-on-surface tracking-tight">{T.contactTitle[lang]}</h2>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">{T.contactSubtitle[lang]}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto relative z-10">
              <a href="https://wa.me/62811xxxxxx" target="_blank" rel="noreferrer" className="flex flex-col items-center p-5 rounded-2xl border border-emerald-100 bg-white/70 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-sm hover:shadow transition-all group">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface">WhatsApp Chat</span>
                <span className="text-[10px] text-emerald-700 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Respon Cepat</span>
              </a>

              <a href="mailto:support@atsira.id" className="flex flex-col items-center p-5 rounded-2xl border border-blue-100 bg-white/70 hover:border-blue-500 hover:bg-blue-50/40 shadow-sm hover:shadow transition-all group">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 mb-3 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface">Email Support</span>
                <span className="text-[10px] text-blue-700 font-medium mt-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">24 Jam</span>
              </a>

              <a href="tel:021xxxxxx" className="flex flex-col items-center p-5 rounded-2xl border border-amber-100 bg-white/70 hover:border-amber-600 hover:bg-amber-50/40 shadow-sm hover:shadow transition-all group">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 mb-3 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface">Hotline Call</span>
                <span className="text-[10px] text-amber-800 font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Jam Kerja</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
}