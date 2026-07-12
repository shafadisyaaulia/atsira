import type {
  UmkmStore,
  PriceTick,
  Order,
  MagazineArticle,
  ImpactMetric,
  VerificationQueueItem,
} from "@/lib/types";

export const UMKM_STORES: UmkmStore[] = [
  {
    id: "umkm-seulawah",
    name: "Toko Parfum UMKM Seulawah",
    ownerName: "Cut Maharani",
    location: "Banda Aceh",
    logoUrl: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=200&h=200&fit=crop",
    bio: "Rumah parfum lokal yang mengangkat nilam Aceh menjadi karya wewangian kelas dunia.",
    joinedAt: "2024-09-01",
    halalCertified: true,
    bpomCertified: true,
    totalProducts: 12,
    totalSales: 18420000,
  },
  {
    id: "umkm-acehscent",
    name: "AcehScent Living",
    ownerName: "Reza Pahlevi",
    location: "Lhokseumawe",
    logoUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop",
    bio: "Produk perawatan rumah berbasis minyak atsiri nilam — sabun, lilin, dan diffuser.",
    joinedAt: "2025-01-15",
    halalCertified: true,
    bpomCertified: false,
    totalProducts: 8,
    totalSales: 6200000,
  },
];

// 12 bulan data harga historis — dipakai di Price Intelligence Dashboard
// dan Price Intelligence Panel di Dashboard Petani.
function generatePriceHistory(): PriceTick[] {
  const months = [
    "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
    "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  ];
  // Reflects the dramatic price crash described in the blueprint (Rp 2.3jt -> Rp 700rb)
  // with a recovery trend as ATSIRA's transparency takes hold.
  const premiumBase = [2300000, 2150000, 1950000, 1700000, 1400000, 1100000, 900000, 750000, 820000, 980000, 1180000, 1450000];
  return months.map((m, i) => ({
    date: m,
    premium: premiumBase[i],
    standard: Math.round(premiumBase[i] * 0.78),
    economy: Math.round(premiumBase[i] * 0.55),
  }));
}

export const PRICE_HISTORY: PriceTick[] = generatePriceHistory();

export const GLOBAL_REFERENCE_PRICES = {
  singapore: { pricePerKg: 1680000, currency: "IDR-equiv", unit: "USD 108/kg" },
  grasse: { pricePerKg: 2950000, currency: "IDR-equiv", unit: "EUR 178/kg" },
  acehLocal: { pricePerKg: 1450000, currency: "IDR", unit: "Rp/kg" },
};

export const ORDERS: Order[] = [
  {
    id: "ATR-8891",
    buyerId: "buyer-budi",
    buyerName: "Budi Santoso",
    sellerId: "umkm-seulawah",
    type: "B2C",
    items: [{ productId: "fp-seulawah-elixir", title: "Seulawah Elixir", qty: 1, unit: "50ml", price: 450000 }],
    subtotal: 450000,
    shippingFee: 15000,
    tax: 49500,
    total: 514500,
    status: "Diproses",
    escrowStatus: "Ditahan",
    paymentMethod: "Transfer Bank (BCA Virtual Account)",
    courier: "JNE REG",
    trackingNumber: "JNE0098213771",
    createdAt: "2026-06-26T10:21:00+07:00",
  },
  {
    id: "ATR-8889",
    buyerId: "buyer-siti",
    buyerName: "Siti Aminah",
    sellerId: "umkm-seulawah",
    type: "B2C",
    items: [{ productId: "fp-gayowood-musk", title: "Gayo Wood Musk", qty: 1, unit: "30ml", price: 398000 }],
    subtotal: 398000,
    shippingFee: 22000,
    tax: 0,
    total: 420000,
    status: "Dikirim",
    escrowStatus: "Ditahan",
    paymentMethod: "GoPay",
    courier: "J&T Express",
    trackingNumber: "JT5512839004",
    createdAt: "2026-06-24T15:40:00+07:00",
  },
  {
    id: "ATR-8870",
    buyerId: "buyer-chanel-eu",
    buyerName: "Maison Aroma (Buyer Internasional)",
    sellerId: "farmer-syukur-gayo",
    type: "B2B",
    items: [{ productId: "raw-gayo-001", title: "Minyak Nilam Gayo Premium", qty: 25, unit: "kg", price: 1250000 }],
    subtotal: 31250000,
    shippingFee: 850000,
    tax: 0,
    total: 32100000,
    status: "Selesai",
    escrowStatus: "Dicairkan",
    paymentMethod: "USD via Midtrans",
    courier: "Biteship Export",
    trackingNumber: "BTX2026-EXP-0451",
    createdAt: "2026-06-10T08:00:00+07:00",
  },
];

// DATA REVISI NILAMSTORY: Path gambar disesuaikan dengan folder public/stories/ Anda
export const MAGAZINE_ARTICLES: MagazineArticle[] = [
  {
    slug: "rembug-petani-aceh-selatan",
    title: "Jumpa Petani Nilam Aceh Selatan: Digitalisasi Rantai Pasok & Transparansi Harga",
    category: "Kegiatan Komunitas" as any, 
    excerpt: "Dokumentasi nyata kegiatan rembug bersama puluhan ketua kelompok tani di Aceh Selatan. Fokus pada pengenalan teknologi Nilam Analyzer AI untuk menetapkan standardisasi harga yang adil di tingkat tapak.",
    content: [
      "Perjalanan kami ke Tapaktuan, Aceh Selatan menjadi bukti komitmen platform dalam membersamai langsung para petani hebat. Dalam agenda Rembug & Jumpa Petani Nilam ini, tim berdialog langsung mengenai kendala permainan harga spekulatif di tingkat tengkulak bawah.",
      "Kami memperkenalkan pemanfaatan modul pemindaian Nilam Analyzer AI kepada kelompok tani setempat. Melalui uji sampel visual mandiri, para petani kini memiliki posisi tawar yang jauh lebih kuat karena mengetahui perkiraan kadar Patchouli Alcohol (PA) minyak mereka sebelum dibawa ke pengepul.",
      "Pertemuan ini ditutup dengan kesepakatan distribusi rantai pasok langsung dari 4 kelompok tani lokal Aceh Selatan menuju jaringan UMKM kosmetik yang terdaftar di sistem kami, memotong rantai distribusi gelap hingga 40%.",
    ],
    author: "Tim Komunitas ATSIRA",
    authorRole: "Fasilitator Lapangan",
    publishedAt: "2026-07-02",
    readMinutes: 4,
    imageUrl: "/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png", 
    featured: true,
  },
  {
    slug: "workshop-penyulingan-aceh-jaya",
    title: "Workshop Optimalisasi Rendemen Suling bersama Petani Aceh Jaya",
    category: "Kegiatan Komunitas" as any, 
    excerpt: "Turun langsung ke lokasi penyulingan rakyat di Aceh Jaya untuk membagikan modul penerapan uap bersih demi mendongkrak kualitas minyak nilam.",
    content: [
      "Tidak sekadar mengandalkan perangkat lunak di hilir, platform kami secara berkala mengadakan pelatihan fisik ke hulu produksi. Bersama belasan penyuling rakyat di Aceh Jaya, workshop ini mengupas tuntas pengaruh kebersihan pipa kondensor terhadap rendemen hasil sulingan.",
      "Melalui demonstrasi metode penyulingan uap (steam distillation) yang stabil, minyak nilam mentah yang diproduksi terbukti memiliki warna jernih khas madu dengan kadar kotoran minimal. Data produksi dari workshop ini langsung diintegrasikan ke dalam antrean verifikasi kualitas digital.",
    ],
    author: "Eko Ramadhan",
    authorRole: "Technical Specialist",
    publishedAt: "2026-06-28",
    readMinutes: 3,
    imageUrl: "/stories/action_photography_of_a_workshop_optimalisasi_rendemen_suling_in_aceh_jaya._an.png", 
    featured: false,
  },
  {
    slug: "kolaborasi-riset-arc-usk",
    title: "Validasi Ilmiah NIRS-PLS AI: Sinergi Bersama Laboratorium ARC-USK",
    category: "Riset & Edukasi",
    excerpt: "Bagaimana integrasi kecerdasan buatan dan riset Universitas Syiah Kuala memvalidasi akurasi data uji mutu minyak atsiri langsung di lapangan.",
    content: [
      "Teknologi Near Infrared Reflectance Spectroscopy (NIRS) yang dikembangkan oleh Atsiri Research Center (ARC-USK) menjadi fondasi penentu akurasi sistem kecerdasan buatan kami.",
      "Kolaborasi berkala ini memastikan data pemicu algoritma Nilam Analyzer memiliki tingkat presisi tinggi (r=0,93) yang setara dengan pengujian laboratorium Gas Chromatography-Mass Spectrometry (GC-MS) konvensional. Ini adalah pembuktian ilmiah bahwa platform digital ini dibangun di atas landasan riset universitas terpercaya.",
    ],
    author: "Dr. Syarifullah, ARC-USK",
    authorRole: "Kepala Riset Atsiri Research Center",
    publishedAt: "2026-06-15",
    readMinutes: 5,
    imageUrl: "/stories/high_tech_laboratory_photography_at_arc_usk._a_researcher_in_a_white_lab_coat.png", 
    featured: false,
  },
  {
    slug: "kisah-sukses-pak-syukur",
    title: "Dari Petani Tradisional ke Pelopor Nilam Premium: Kisah Pak Syukur di Gayo",
    category: "Kisah Inspirasi",
    excerpt: "Perjalanan inspiratif menembus keterbatasan akses pasar, memanfaatkan ekosistem digital untuk memasok minyak nilam murni berkadar PA tinggi ke UMKM parfum lokal.",
    content: [
      "Selama bertahun-tahun, Pak Syukur terpaksa pasrah menerima potongan harga dari spekulan lokal karena keterbatasan info pasar. Sejak mendaftarkan batch sulingannya ke sistem pelacakan digital, ia berhasil memvalidasi minyak nilam Gayo miliknya mencapai kadar PA 34,2%.",
      "Kini, sertifikat digital hasil uji tersebut dipajang langsung di profilnya, memungkinkan hubungan dagang langsung B2B dengan UMKM parfum premium, memberikan peningkatan pendapatan hingga dua kali lipat bagi keluarganya.",
    ],
    author: "Redaksi NilamStory",
    authorRole: "Editorial Team",
    publishedAt: "2026-05-20",
    readMinutes: 4,
    imageUrl: "/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png", 
    featured: false,
  },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  { label: "Total Minyak Diperdagangkan", value: "41,8 ton", change: "+12,4%", trend: "up" },
  { label: "Petani & Penyuling Bergabung", value: "5.412", change: "+312 bulan ini", trend: "up" },
  { label: "Total Nilai Transaksi", value: "Rp 18,2 M", change: "+8,1%", trend: "up" },
  { label: "Estimasi CO₂ Dicegah", value: "284 ton", change: "+5,6%", trend: "up" },
  { label: "UMKM Naik Kelas", value: "118 toko", change: "+9 bulan ini", trend: "up" },
  { label: "Kota Terlayani", value: "23 kota", trend: "flat" },
];

export const VERIFICATION_QUEUE: VerificationQueueItem[] = [
  {
    id: "vq-001",
    farmerId: "farmer-siti-baratdaya",
    farmerName: "Bu Siti Aminah",
    region: "Aceh Jaya",
    submittedAt: "2026-06-27T09:00:00+07:00",
    aiPaLevel: 28.9,
    aiGrade: "Standard",
    status: "Menunggu",
    sampleImageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
  },
  {
    id: "vq-002",
    farmerId: "farmer-abdullah-baratdaya",
    farmerName: "Pak Abdullah",
    region: "Aceh Barat",
    submittedAt: "2026-06-25T13:20:00+07:00",
    aiPaLevel: 31.6,
    aiGrade: "Standard",
    status: "Dalam Proses",
    sampleImageUrl: "https://images.unsplash.com/photo-1556228852-80b6e16a3219?w=400&h=400&fit=crop",
  },
  {
    id: "vq-003",
    farmerId: "farmer-syukur-gayo",
    farmerName: "Pak Syukur",
    region: "Gayo",
    submittedAt: "2026-06-20T08:40:00+07:00",
    aiPaLevel: 34.2,
    aiGrade: "Premium",
    status: "Lulus",
    sampleImageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
  },
];