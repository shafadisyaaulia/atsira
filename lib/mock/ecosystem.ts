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

export const MAGAZINE_ARTICLES: MagazineArticle[] = [
  {
    slug: "rahasia-meningkatkan-kadar-pa-nilam",
    title: "5 Cara Meningkatkan Kadar Patchouli Alcohol Sebelum Panen",
    category: "Tips Budidaya",
    excerpt: "Kadar PA tidak hanya ditentukan saat penyulingan — banyak keputusan di kebun yang menentukan hasil akhir.",
    content: [
      "Kadar Patchouli Alcohol (PA) sering dianggap hanya soal teknik penyulingan, padahal keputusan yang diambil jauh sebelum panen punya pengaruh besar terhadap hasil akhir.",
      "Pertama, usia panen. Penelitian ARC-USK menunjukkan daun nilam yang dipanen pada usia 6-8 bulan cenderung memberikan kadar PA lebih stabil dibanding panen dini di bawah 5 bulan.",
      "Kedua, waktu pemanenan dalam sehari. Memanen di pagi hari sebelum kadar minyak menguap akibat panas matahari terbukti menjaga rendemen sekaligus kualitas.",
      "Ketiga, proses pengeringan daun (layu) sebelum disuling. Layu yang terlalu singkat membuat kadar air tinggi dan mengganggu proses ekstraksi; terlalu lama justru menurunkan rendemen minyak.",
      "Keempat, metode penyulingan. Penyulingan uap (steam distillation) dengan tekanan rendah dan durasi 8 jam, seperti yang dipraktikkan di Penyulingan Gayo Lestari, menghasilkan kestabilan PA lebih baik dibanding penyulingan air biasa.",
      "Kelima, pemilihan varietas unggul. Pogostemon cablin varietas Sidikalang dikenal punya potensi kadar PA lebih tinggi dibanding varietas lokal yang belum terseleksi.",
    ],
    author: "Tim Riset ARC-USK",
    authorRole: "Atsiri Research Center, Universitas Syiah Kuala",
    publishedAt: "2026-05-14",
    readMinutes: 6,
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&h=600&fit=crop",
    featured: true,
  },
  {
    slug: "profil-pak-syukur-gayo",
    title: "Dari Tengkulak ke Transparansi: Kisah Pak Syukur di Gayo",
    category: "Profil Petani Sukses",
    excerpt: "Bagaimana satu petani di dataran tinggi Gayo mengubah cara dia berdagang setelah bergabung dengan ATSIRA.",
    content: [
      "Selama lebih dari satu dekade, Pak Syukur menjual hasil sulingan nilamnya hanya kepada satu tengkulak yang datang ke desanya setiap bulan. Harga ditentukan sepihak, dan ia tidak punya cara untuk membandingkan dengan harga pasar yang sesungguhnya.",
      "Semua berubah ketika ARC-USK memperkenalkan ATSIRA kepada komunitas penyuling di Bener Meriah. Pak Syukur mendaftar, mengunggah hasil sulingannya ke Nilam Analyzer AI, dan dalam waktu kurang dari satu menit mendapati kadar PA minyaknya mencapai 34,2% — masuk kategori Premium.",
      "Dengan badge AI Verified, ia langsung menjual minyaknya melalui marketplace ke UMKM Seulawah, mendapat harga yang jauh lebih tinggi dibanding tawaran tengkulak sebelumnya.",
      "\"Saya tidak hanya menjual minyak, saya tahu sekarang nilainya,\" katanya. Kini Pak Syukur menjadi salah satu mitra penyulingan paling konsisten di ekosistem ATSIRA.",
    ],
    author: "Redaksi ATSIRA Magazine",
    authorRole: "Editorial Team",
    publishedAt: "2026-04-22",
    readMinutes: 4,
    imageUrl: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=900&h=600&fit=crop",
    featured: true,
  },
  {
    slug: "panduan-sertifikasi-halal-bpom-umkm",
    title: "Panduan Praktis Sertifikasi Halal MUI dan BPOM untuk UMKM Parfum",
    category: "Panduan Bisnis Parfum",
    excerpt: "Langkah demi langkah mengurus dua sertifikasi penting yang membuka pasar lebih luas untuk produk parfum lokal.",
    content: [
      "Bagi UMKM parfum, sertifikasi Halal MUI dan izin BPOM bukan sekadar formalitas — keduanya adalah kunci untuk masuk ke retail modern dan pasar ekspor.",
      "Untuk sertifikasi Halal, dokumen yang dibutuhkan meliputi daftar bahan baku lengkap dengan sumbernya, proses produksi, dan fasilitas produksi yang terpisah dari bahan non-halal.",
      "ATSIRA membantu UMKM mitra dengan menyediakan dokumentasi traceability bahan baku nilam secara otomatis — termasuk asal kebun dan metode penyulingan — yang dapat langsung dilampirkan dalam pengajuan sertifikasi.",
      "Sementara untuk BPOM, kategori kosmetik notifikasi umumnya memerlukan waktu pemrosesan 14 hari kerja apabila dokumen lengkap di awal pengajuan.",
    ],
    author: "Tim Legal ATSIRA",
    authorRole: "Partnership & Compliance",
    publishedAt: "2026-03-30",
    readMinutes: 5,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&h=600&fit=crop",
  },
  {
    slug: "riset-nirs-pls-prediksi-pa",
    title: "Di Balik Algoritma: Bagaimana NIRS-PLS Memprediksi Kadar PA",
    category: "Riset ARC-USK",
    excerpt: "Penjelasan ilmiah singkat tentang teknologi yang menjadi fondasi Nilam Analyzer AI.",
    content: [
      "Near Infrared Reflectance Spectroscopy (NIRS) bekerja dengan menembakkan cahaya inframerah-dekat ke sampel dan menganalisis pola pantulannya. Setiap senyawa kimia, termasuk patchouli alcohol, memantulkan cahaya dengan pola unik.",
      "Partial Least Square (PLS) kemudian digunakan sebagai metode statistik untuk menghubungkan pola spektrum tersebut dengan kadar PA aktual yang sebelumnya diukur lewat GC-MS di laboratorium.",
      "Riset tim ARC-USK menunjukkan koefisien korelasi r=0,93 antara prediksi model dan hasil GC-MS — angka yang cukup tinggi untuk aplikasi non-destruktif di lapangan.",
      "Model inilah yang menjadi fondasi Nilam Analyzer AI, dilatih ulang dengan dataset foto dan deskripsi sensorik untuk estimasi awal sebelum verifikasi lab penuh.",
    ],
    author: "Dr. Syarifullah, ARC-USK",
    authorRole: "Kepala Riset Atsiri Research Center",
    publishedAt: "2026-02-18",
    readMinutes: 7,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=600&fit=crop",
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
