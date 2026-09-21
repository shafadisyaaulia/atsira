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
    bio: "Produk perawatan rumah berbasis minyak atsiri nilam â€” sabun, lilin, dan diffuser.",
    joinedAt: "2025-01-15",
    halalCertified: true,
    bpomCertified: false,
    totalProducts: 8,
    totalSales: 6200000,
  },
];

// 12 bulan data harga historis â€” dipakai di Price Intelligence Dashboard
// dan Price Intelligence Panel di Dashboard Petani.
function generatePriceHistory(): PriceTick[] {
  const months = [
    "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
    "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  ];
  // Reflects the dramatic price crash described in the blueprint (Rp 2.3jt -> Rp 700rb)
  // with a recovery trend as atSira's transparency takes hold.
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
    slug: "pendataan-petani-jantho-aceh-besar",
    title: "Pendataan Pohon Nilam Bersama Komunitas Pemasta di Jantho, Aceh Besar",
    category: "Kegiatan Komunitas" as any,
    excerpt: "Tim atSira bersama komunitas Pemasta mendata langsung pohon nilam di kebun petani di bawah bimbingan komunitas yang ada di Jantho, Aceh Besar.",
    content: [
      "Tim atSira bersama komunitas Pemasta mendata langsung pohon nilam di kebun petani di bawah bimbingan komunitas yang ada di Jantho, Aceh Besar. Kegiatan ini bertujuan memperkuat akurasi database pohon, memetakan potensi rendemen panen, serta memastikan penerapan standar budidaya ramah lingkungan dari hulu.",
      "Pendataan lapangan ini menjadi fondasi penting bagi integrasi sistem lacak balak NilamTrace, memastikan setiap tetes minyak nilam yang dihasilkan dapat ditelusuri riwayat kebun dan proses distilasinya secara transparan.",
    ],
    author: "Tim Lapangan atSira & Pemasta",
    authorRole: "Fasilitator Komunitas",
    publishedAt: "2026-09-18",
    readMinutes: 3,
    imageUrl: "/stories/pendataan-jantho.png",
    featured: true,
  },
  {
    slug: "harga-nilam-aceh-tembus-850-ribu",
    title: "Harga Nilam Aceh Tembus Rp850 Ribu",
    category: "Analisis Harga" as any,
    excerpt: "Harga minyak nilam di Aceh terus merangkak naik, kini menyentuh Rp850.000 per kilogram — jauh di atas Rp350.000–400.000 yang sempat jadi patokan sebelumnya.",
    content: [
      "Harga minyak nilam di Aceh terus merangkak naik, kini menyentuh Rp850.000 per kilogram — jauh di atas Rp350.000–400.000 yang sempat jadi patokan sebelumnya. Kepala Atsiri Research Center (ARC) USK, Syaifullah Muhammad, memproyeksikan harga bisa tembus Rp1–1,5 juta per kilogram pada akhir tahun seiring membaiknya permintaan pasar.",
      "Kenaikan harga ini juga mendorong petani menambah luas tanam. Area budidaya nilam di Aceh kini meluas dari 4 menjadi 18 kabupaten, dan pangsa produksi Aceh terhadap total nasional pulih dari titik terendah 5% menjadi sekitar 19%.",
    ],
    author: "Liputan6 / Tim Riset atSira",
    authorRole: "Analis Pasar",
    publishedAt: "2026-02-27",
    readMinutes: 3,
    imageUrl: "/images/nilamtrace-card.jpg",
    featured: false,
  },
  {
    slug: "arc-usk-dorong-sistem-resi-gudang",
    title: "ARC USK Dorong Sistem Resi Gudang untuk Nilam",
    category: "Riset & Edukasi" as any,
    excerpt: "ARC USK baru merampungkan studi kelayakan penerapan Sistem Resi Gudang (SRG) khusus untuk minyak nilam demi menjaga stabilitas harga petani.",
    content: [
      "ARC USK baru merampungkan studi kelayakan penerapan Sistem Resi Gudang (SRG) khusus untuk minyak nilam, mencakup kesiapan standar mutu, regulasi, fasilitas gudang, hingga lembaga penilai kualitas. Langkah ini penting karena Permendag No. 14/2026 yang mengatur 30 komoditas SRG belum memasukkan nilam di dalamnya.",
      "\"SRG juga menjadi instrumen standardisasi mutu, traceability, pembiayaan, tunda jual, konsolidasi pasokan dan penguatan akses pasar minyak nilam Indonesia,\" kata Syaifullah Muhammad, Ketua ARC USK. Dengan sistem ini, petani diharapkan bisa menunda jual saat harga rendah dan mendapat pembayaran lebih cepat.",
    ],
    author: "Koran Jakarta / ARC-USK",
    authorRole: "Riset Kebijakan",
    publishedAt: "2026-09-17",
    readMinutes: 4,
    imageUrl: "/stories/high_tech_laboratory_photography_at_arc_usk._a_researcher_in_a_white_lab_coat.png",
    featured: false,
  },
  {
    slug: "produksi-nilam-aceh-barat-22-ton",
    title: "Produksi Nilam Aceh Barat Capai 22,82 Ton per Tahun",
    category: "Laporan Panen" as any,
    excerpt: "Dinas Pertanian dan Peternakan Aceh Barat mencatat produksi minyak nilam di wilayahnya mencapai 22,82 ton per tahun dari 117 hektare lahan produktif.",
    content: [
      "Dinas Pertanian dan Peternakan Aceh Barat mencatat produksi minyak nilam di wilayahnya mencapai 22,82 ton per tahun. Dari total 279 hektare lahan yang ada, baru 117 hektare yang produktif, dengan rendemen rata-rata 195 kilogram per hektare.",
      "Plt. Kepala Dinas, Darmawan, menyebut komoditas ini terus jadi andalan ekspor untuk industri parfum dan kosmetik, sekaligus sumber pendapatan penting bagi petani di daerah tersebut.",
    ],
    author: "ANTARA Aceh / Distanbun",
    authorRole: "Laporan Lapangan",
    publishedAt: "2025-03-07",
    readMinutes: 3,
    imageUrl: "/stories/action_photography_of_a_workshop_optimalisasi_rendemen_suling_in_aceh_jaya._an.png",
    featured: false,
  },
  {
    slug: "gubernur-aceh-kunjungi-petani-nilam-gayo",
    title: "Gubernur Aceh Kunjungi Petani Nilam Gayo",
    category: "Kegiatan Komunitas" as any,
    excerpt: "Gubernur Aceh Muzakir Manaf turun langsung ke dataran tinggi Gayo meninjau lahan nilam di Aceh Tengah dan Bener Meriah.",
    content: [
      "Gubernur Aceh Muzakir Manaf turun langsung ke dataran tinggi Gayo, meninjau lahan cabai dan nilam di Aceh Tengah dan Bener Meriah. Ia menegaskan dukungan penuh pemerintah provinsi untuk petani di kedua komoditas ini, yang dinilai berperan menekan inflasi daerah sekaligus mendongkrak kesejahteraan warga.",
      "Bupati Bener Meriah, Tagore Abubakar, menambahkan komentar yang cukup khas: \"Nilam nggak diganggu gajah. Jadi gajah nggak terganggu, orang nggak terganggu. Orang sejahtera.\" — sebuah cara sederhana menjelaskan kenapa nilam cocok ditanam di kawasan rawan konflik satwa.",
    ],
    author: "InfoPublik / Warta Daerah",
    authorRole: "Koresponden Gayo",
    publishedAt: "2025-09-11",
    readMinutes: 3,
    imageUrl: "/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png",
    featured: false,
  },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  { label: "Total Minyak Diperdagangkan", value: "41,8 ton", change: "+12,4%", trend: "up" },
  { label: "Petani & Penyuling Bergabung", value: "5.412", change: "+312 bulan ini", trend: "up" },
  { label: "Total Nilai Transaksi", value: "Rp 18,2 M", change: "+8,1%", trend: "up" },
  { label: "Estimasi COâ‚‚ Dicegah", value: "284 ton", change: "+5,6%", trend: "up" },
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
    aiGrade: "Grade B",
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
    aiGrade: "Grade B",
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
    aiGrade: "Grade A",
    status: "Lulus",
    sampleImageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
  },
];
