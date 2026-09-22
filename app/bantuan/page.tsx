"use client";

import { useState } from "react";
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  ShoppingBag, 
  FileText, 
  Download, 
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useLang } from "@/components/layout/Navbar";

// ====== KAMUS BAHASA LOKAL ======
const T = {
  badge: { ID: "Pusat Bantuan & Edukasi", EN: "Help Center & Knowledge" },
  title: { ID: "Bagaimana kami bisa membantu Anda?", EN: "How can we assist you today?" },
  subtitle: { 
    ID: "Temukan jawaban seputar ekosistem atSira, transaksi nilam, verifikasi kualitas AI, dan panduan lengkap aplikasi.", 
    EN: "Find answers about the atSira ecosystem, patchouli trading, AI verification, and comprehensive platform guides." 
  },
  searchPlaceholder: { 
    ID: "Cari topik bantuan (misal: QualitySense, NilamTrace QR, cara beli, SNI)...", 
    EN: "Search help topics (e.g. QualitySense, NilamTrace QR, checkout, SNI)..." 
  },
  quickTags: [
    { ID: "QualitySense AI", EN: "QualitySense AI" },
    { ID: "NilamTrace QR", EN: "NilamTrace QR" },
    { ID: "Buku Panduan", EN: "User Manual" },
    { ID: "Standar SNI", EN: "SNI Standard" }
  ],
  
  // 3 Quick Cards
  cardManualTitle: { ID: "Buku Panduan Aktor", EN: "User Action Guide" },
  cardManualDesc: { ID: "Panduan lengkap alur login, jual-beli marketplace, dan operasional akun.", EN: "Complete step-by-step guides for trading, verification, and dashboard operations." },
  cardManualBtn: { ID: "Unduh PDF", EN: "Download PDF" },

  cardAiTitle: { ID: "Tanya Asisten atBot", EN: "Ask atBot Assistant" },
  cardAiDesc: { ID: "Tanya langsung seputar kadar PA, harga referensi dunia, dan rekomendasi suling.", EN: "Instant AI answers regarding PA levels, global price trends, and distillation tips." },
  cardAiBtn: { ID: "Buka Chat atBot", EN: "Open atBot Chat" },

  cardContactTitle: { ID: "Kontak Tim Dukungan", EN: "Contact Support Team" },
  cardContactDesc: { ID: "Hubungi tim teknis ARC-USK atau administrator jika menemui kendala.", EN: "Reach out to ARC-USK technical team or system administrators for direct assistance." },
  cardContactBtn: { ID: "Kirim Email", EN: "Send Email" },

  faqHeading: { ID: "Pertanyaan yang Sering Diajukan", EN: "Frequently Asked Questions" },
  allCategory: { ID: "Semua Kategori", EN: "All Categories" },
  noResults: { ID: "Tidak ada topik bantuan yang cocok dengan pencarian Anda.", EN: "No help topics match your search query." },
};

// ====== DAFTAR FAQ KATEGORISAL ======
const FAQ_CATEGORIES = [
  {
    id: "general",
    title: { ID: "Umum & Ekosistem", EN: "General & Ecosystem" },
    items: [
      {
        q: { ID: "Apa itu platform atSira?", EN: "What is the atSira platform?" },
        a: { 
          ID: "atSira adalah ekosistem digital terintegrasi untuk rantai pasok minyak nilam Aceh. Platform ini menghubungkan petani, penyuling, pemasta, industri pembeli, dan peneliti ARC-USK dalam jaringan perdagangan yang transparan dan terverifikasi.", 
          EN: "atSira is an integrated digital ecosystem for the Aceh patchouli supply chain, connecting farmers, distillers, pemasta, global buyers, and ARC-USK researchers in a transparent and verified trading network." 
        }
      },
      {
        q: { ID: "Bagaimana cara beralih bahasa di platform?", EN: "How do I switch the platform language?" },
        a: { 
          ID: "Anda dapat mengganti bahasa kapan saja dengan mengklik tombol pemilih bahasa (ID / EN) pada bilah navigasi (Navbar) di bagian atas layar.", 
          EN: "You can switch languages anytime by clicking the language selector button (ID / EN) in the top navigation bar." 
        }
      }
    ]
  },
  {
    id: "marketplace",
    title: { ID: "Marketplace & Transaksi", EN: "Marketplace & Orders" },
    items: [
      {
        q: { ID: "Bagaimana alur pembelian produk di Marketplace?", EN: "How does purchasing products on Marketplace work?" },
        a: { 
          ID: "Buka halaman Marketplace, pilih minyak nilam mentah atau produk jadi bersertifikasi, masukkan ke keranjang, dan lakukan proses checkout aman yang terhubung dengan payment gateway terpercaya.", 
          EN: "Visit the Marketplace page, choose raw patchouli oil or certified finished goods, add to cart, and proceed with secure checkout backed by verified payment gateways." 
        }
      },
      {
        q: { ID: "Bagaimana cara kerja verifikasi QualitySense AI?", EN: "How does QualitySense AI verification work?" },
        a: { 
          ID: "QualitySense AI menggunakan model NIRS-PLS yang dilatih bersama ARC-USK untuk memprediksi kadar Patchouli Alcohol (PA) dan kemurnian minyak secara cepat sebelum produk dipasarkan.", 
          EN: "QualitySense AI uses NIRS-PLS models trained alongside ARC-USK to rapidly predict Patchouli Alcohol (PA) content and purity before products enter the marketplace." 
        }
      }
    ]
  },
  {
    id: "traceability",
    title: { ID: "NilamTrace & Sertifikasi", EN: "NilamTrace & Certification" },
    items: [
      {
        q: { ID: "Bagaimana cara melacak keaslian batch melalui NilamTrace?", EN: "How do I trace batch authenticity with NilamTrace?" },
        a: { 
          ID: "Kunjungi menu NilamTrace lalu masukkan kode batch (misal: atSira-F001 atau atSira-R001) atau pindai kode QR yang tertera pada kemasan untuk melihat riwayat kebun, tanggal distilasi, dan uji laboratorium ARC-USK.", 
          EN: "Go to the NilamTrace menu and enter the batch ID (e.g. atSira-F001 or atSira-R001) or scan the QR code on the packaging to view farm origin, distillation dates, and ARC-USK lab tests." 
        }
      },
      {
        q: { ID: "Apakah sertifikat Certificate of Analysis (CoA) bisa diunduh?", EN: "Can the Certificate of Analysis (CoA) be downloaded?" },
        a: { 
          ID: "Ya, setiap produk yang telah lulus verifikasi laboratorium memiliki tombol 'Unduh Sertifikat CoA PDF' yang dapat diunduh langsung oleh pembeli dan seller.", 
          EN: "Yes, every product that has passed laboratory verification includes a 'Download CoA PDF Certificate' button for instant export by buyers and sellers." 
        }
      }
    ]
  }
];

export default function HelpCenterPage() {
  const lang = useLang();
  const isId = lang === "ID";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<string | null>("general-0");

  const toggleAccordion = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  // Filter FAQ berdasarkan pencarian dan kategori
  const filteredCategories = FAQ_CATEGORIES.map((cat) => {
    if (selectedCategory !== "all" && cat.id !== selectedCategory) {
      return null;
    }
    const filteredItems = cat.items.filter((item) => {
      const q = isId ? item.q.ID : item.q.EN;
      const a = isId ? item.a.ID : item.a.EN;
      const query = searchQuery.toLowerCase();
      return q.toLowerCase().includes(query) || a.toLowerCase().includes(query);
    });
    if (filteredItems.length === 0) return null;
    return {
      ...cat,
      items: filteredItems,
    };
  }).filter(Boolean);

  return (
    <PageShell>
      <div className="min-h-screen bg-[#fbf9f4] py-16 sm:py-20 text-stone-900">
        <div className="container-app max-w-5xl mx-auto space-y-16">
          
          {/* 1. HERO SECTION - CLEAN & ELEGANT */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-stone-800 text-xs font-semibold">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>{T.badge[lang]}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              {T.title[lang]}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {T.subtitle[lang]}
            </p>
            
            {/* Search Bar */}
            <div className="relative mt-6 max-w-2xl mx-auto">
              <div className="relative bg-white border border-stone-300 rounded-2xl p-2 shadow-sm focus-within:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-800/20 transition-all flex items-center">
                <Search className="w-5 h-5 text-stone-400 ml-3 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={T.searchPlaceholder[lang]}
                  className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-400 py-2 pr-4"
                />
              </div>

              {/* Quick Suggestion Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-stone-500">
                <span className="font-medium text-stone-400">{isId ? "Pencarian populer:" : "Popular topics:"}</span>
                {T.quickTags.map((tag) => (
                  <button
                    key={tag[lang]}
                    onClick={() => setSearchQuery(tag[lang])}
                    className="bg-white/80 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200/80 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {tag[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. 3 ESSENTIAL ACTION CARDS - UNIFIED & MODERN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Buku Panduan PDF */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:shadow-md hover:border-emerald-700/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  {T.cardManualTitle[lang]}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {T.cardManualDesc[lang]}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 cursor-not-allowed">
                  <Download className="w-3.5 h-3.5 text-stone-400" />
                  <span>{T.cardManualBtn[lang]}</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {isId ? "Segera Hadir" : "Coming Soon"}
                </span>
              </div>
            </div>

            {/* Card 2: Asisten atBot AI */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:shadow-md hover:border-emerald-700/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  {T.cardAiTitle[lang]}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {T.cardAiDesc[lang]}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-atbot"));
                    }
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span>{T.cardAiBtn[lang]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Kontak Support */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:shadow-md hover:border-emerald-700/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-stone-800 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  {T.cardContactTitle[lang]}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {T.cardContactDesc[lang]}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 cursor-not-allowed">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{T.cardContactBtn[lang]}</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {isId ? "Segera Hadir" : "Coming Soon"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. FAQ ACCORDION - SOPHISTICATED & CLEAN */}
          <div className="space-y-8 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <h2 className="font-display text-2xl font-bold text-stone-900">
                {T.faqHeading[lang]}
              </h2>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === "all"
                      ? "bg-emerald-900 text-white shadow-sm"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {T.allCategory[lang]}
                </button>
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-emerald-900 text-white shadow-sm"
                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    {isId ? cat.title.ID : cat.title.EN}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion List */}
            {filteredCategories.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
                {T.noResults[lang]}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCategories.map((cat) => {
                  if (!cat) return null;
                  return (
                    <div key={cat.id} className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900/80 px-1">
                        {isId ? cat.title.ID : cat.title.EN}
                      </h3>

                      <div className="space-y-2.5">
                        {cat.items.map((item, itemIdx) => {
                          const itemKey = `${cat.id}-${itemIdx}`;
                          const isOpen = openIndex === itemKey;
                          const questionText = isId ? item.q.ID : item.q.EN;
                          const answerText = isId ? item.a.ID : item.a.EN;

                          return (
                            <div
                              key={itemIdx}
                              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                                isOpen 
                                  ? "border-emerald-800/40 shadow-sm" 
                                  : "border-stone-200/80 hover:border-stone-300"
                              }`}
                            >
                              <button
                                onClick={() => toggleAccordion(itemKey)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors"
                              >
                                <span className={`text-sm sm:text-base font-semibold pr-4 ${isOpen ? "text-emerald-900 font-bold" : "text-stone-800"}`}>
                                  {questionText}
                                </span>
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? "bg-emerald-50 text-emerald-900 rotate-180" : "bg-stone-100 text-stone-500"}`}>
                                  <ChevronDown className="w-4 h-4" />
                                </span>
                              </button>

                              {isOpen && (
                                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                                  {answerText}
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
            )}
          </div>

        </div>
      </div>
    </PageShell>
  );
}
