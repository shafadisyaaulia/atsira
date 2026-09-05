export type MarketPriceUpdate = {
  id: string;
  batchId: string;
  region: string;
  date: string;
  qty: number;
  pa: number;
  pricePerKg: number;
  status: string;
  method: string;
  leafAge: string;
};

export type FieldStory = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  author: string;
  authorRole: string;
  publishedAt: string;
  readMinutes: number;
  imageUrl: string;
  featured: boolean;
};

export type QualityInsight = {
  label: string;
  value: string;
  note: string;
};

export const PEMASTA_PRICE_FEED: MarketPriceUpdate[] = [
  {
    id: "feed-092",
    batchId: "BCH-092",
    region: "Aceh Selatan",
    date: "2026-07-08",
    qty: 45,
    pa: 32.4,
    pricePerKg: 1450000,
    status: "Terverifikasi ARC",
    method: "Uap (Steam Distressed)",
    leafAge: "6 Bulan",
  },
  {
    id: "feed-071",
    batchId: "BCH-071",
    region: "Aceh Jaya",
    date: "2026-05-13",
    qty: 50,
    pa: 30.5,
    pricePerKg: 1380000,
    status: "Terverifikasi AI",
    method: "Air & Uap (Hydro)",
    leafAge: "5 Bulan",
  },
  {
    id: "feed-118",
    batchId: "BCH-118",
    region: "Gayo",
    date: "2026-06-30",
    qty: 39,
    pa: 34.2,
    pricePerKg: 1580000,
    status: "Premium",
    method: "Uap Bersih",
    leafAge: "7 Bulan",
  },
];

export const PEMASTA_FIELD_STORIES: FieldStory[] = [
  {
    slug: "rembug-petani-aceh-selatan",
    title: "Jumpa Petani Nilam Aceh Selatan: Digitalisasi Rantai Pasok & Transparansi Harga",
    category: "Kegiatan Komunitas",
    excerpt: "Dokumentasi nyata kegiatan rembug bersama kelompok tani di Aceh Selatan terkait harga lapangan, panen, dan transparansi rantai pasok.",
    content: [
      "Tim PEMASTA turun langsung ke kebun dan membahas metode pencatatan harga pasar serta hambatan distribusi di tingkat petani.",
      "Data harga yang dikumpulkan dari lapangan kemudian diverifikasi bersama peneliti ARC untuk menentukan benchmark harga yang adil.",
    ],
    author: "Kelompok Suling Jaya",
    authorRole: "Pemasta Node",
    publishedAt: "2026-07-02",
    readMinutes: 4,
    imageUrl: "/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png",
    featured: true,
  },
  {
    slug: "workshop-penyulingan-aceh-jaya",
    title: "Workshop Optimalisasi Rendemen Suling bersama Petani Aceh Jaya",
    category: "Kegiatan Komunitas",
    excerpt: "Pembelajaran teknis untuk memperbaiki kualitas minyak dan menjaga rendemen di area penyulingan rakyat.",
    content: [
      "PEMASTA mengumpulkan data lapangan dari penyulingan rakyat untuk menilai kualitas proses dan konsistensi output.",
      "Hasilnya menjadi masukan penting untuk peneliti dalam menetapkan kadar PA dan rekomendasi harga pasar.",
    ],
    author: "Eko Ramadhan",
    authorRole: "Technical Specialist",
    publishedAt: "2026-06-28",
    readMinutes: 3,
    imageUrl: "/stories/action_photography_of_a_workshop_optimalisasi_rendemen_suling_in_aceh_jaya._an.png",
    featured: false,
  },
];

export const QUALITY_INTELLIGENCE: QualityInsight[] = [
  {
    label: "Total Sampel Teranalisis",
    value: "5.412",
    note: "Data gabungan dari PEMASTA dan validasi laboratorium ARC-USK",
  },
  {
    label: "Rata-rata Kadar PA Regional",
    value: "31,8%",
    note: "Range premium: 32–35%, standard: 28–31%, economy: <28%",
  },
  {
    label: "Akurasi Model NIRS-PLS",
    value: "r = 0,93",
    note: "Prediksi kualitas terverifikasi terhadap GC-MS lab",
  },
  {
    label: "Harga Wajar Rekomendasi",
    value: "Rp 1,3M–Rp 1,6M/kg",
    note: "Berdasarkan PA, rendemen, dan tren pasar lapangan",
  },
];
