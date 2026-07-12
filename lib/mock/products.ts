import type { RawOilListing, FinishedProduct, TraceabilityStage, CoaData } from "@/lib/types";

// CoA milik minyak Pak Syukur — hasil Nilam Analyzer AI. Angka ini (34.2% PA)
// dipakai ulang persis di marketplace, di dashboard UMKM, dan di traceability,
// supaya kontinuitas cerita ke juri terlihat solid.
export const SYUKUR_COA: CoaData = {
  paLevel: 34.2,
  acidNumber: 3.48,
  density: 0.956,
  color: "Coklat Muda",
  viscosity: "Sedang",
  analyzedAt: "2026-04-08T09:15:00+07:00",
  method: "NIRS-PLS AI",
  confidenceScore: 96.3,
};

export const RAW_OIL_LISTINGS: RawOilListing[] = [
  {
    id: "raw-gayo-001",
    type: "raw-oil",
    title: "Minyak Nilam Mentah — Gayo Premium",
    farmerId: "farmer-syukur-gayo",
    distilleryId: "distillery-gayo-lestari",
    region: "Gayo, Aceh Tengah",
    pricePerKg: 1250000,
    minOrderKg: 5,
    stockKg: 42,
    coa: SYUKUR_COA,
    grade: "Premium",
    badges: ["AI Verified", "Eco Badge"],
    listedAt: "2026-04-08T10:00:00+07:00",
    sellMode: "fixed",
    imageUrl: "/images/products/minyak nilam 1.png", // Menggunakan aset foto Anda
    description:
      "Minyak nilam mentah hasil sulingan uap dari kebun Gayo, dataran tinggi Aceh Tengah. Dianalisis melalui Nilam Analyzer AI dengan kadar Patchouli Alcohol 34.2%, masuk kategori Premium sesuai SNI 06-2385-2006.",
  },
  {
    id: "raw-baratdaya-002",
    type: "raw-oil",
    title: "Minyak Nilam Super — Aceh Barat",
    farmerId: "farmer-abdullah-baratdaya",
    distilleryId: "distillery-koperasi-baratdaya",
    region: "Aceh Barat",
    pricePerKg: 1180000,
    minOrderKg: 10,
    stockKg: 65,
    coa: {
      paLevel: 31.6,
      acidNumber: 4.1,
      density: 0.949,
      color: "Coklat Tua",
      viscosity: "Tinggi",
      analyzedAt: "2026-04-02T14:30:00+07:00",
      method: "GC-MS Lab (ARC-USK)",
    },
    grade: "Standard",
    badges: ["USK Verified", "Eco Badge"],
    listedAt: "2026-04-02T15:00:00+07:00",
    sellMode: "fixed",
    imageUrl: "/images/products/minyak nilam.png", // Menggunakan aset foto Anda
    description:
      "Minyak nilam dari Koperasi Aceh Barat, telah diverifikasi langsung oleh laboratorium ARC-USK. Cocok untuk kebutuhan parfum kelas menengah-atas dengan rendemen tinggi.",
  },
  {
    id: "raw-vetiver-003",
    type: "raw-oil",
    title: "Vetiver (Akar Wangi) — Banda Aceh",
    farmerId: "farmer-siti-baratdaya",
    distilleryId: "distillery-heritage-lab",
    region: "Banda Aceh",
    pricePerKg: 2450000,
    minOrderKg: 2,
    stockKg: 18,
    coa: {
      paLevel: 28.9,
      acidNumber: 5.2,
      density: 0.982,
      color: "Coklat Tua",
      viscosity: "Tinggi",
      analyzedAt: "2026-03-20T11:00:00+07:00",
      method: "NIRS-PLS AI",
      confidenceScore: 89.4,
    },
    grade: "Standard",
    badges: ["AI Verified"],
    listedAt: "2026-03-20T11:30:00+07:00",
    sellMode: "auction",
    auctionEndsAt: "2026-07-05T23:59:00+07:00",
    highestBid: 2380000,
    imageUrl: "/images/products/minyak nilam 2.png", // Menggunakan aset foto Anda
    description:
      "Akar wangi premium dengan profil aroma woody-earthy yang khas, diburu oleh rumah parfum internasional untuk base note mewah.",
  },
];

const SEULAWAH_TRACE: TraceabilityStage[] = [
  {
    stage: "Kebun",
    title: "Panen di Kebun Bener Meriah",
    description: "Daun nilam dipanen dari lahan 1,4 hektar milik Pak Syukur, varietas Pogostemon cablin, ditanam Januari 2024.",
    date: "2026-08-01",
    location: "Desa Bangerango, Gayo — Elevasi 1.200m",
    gpsCoords: { lat: 4.7283, lng: 96.8917 },
    meta: { "Luas Lahan": "1,4 Ha", Varietas: "Pogostemon Cablin" },
    verified: true,
  },
  {
    stage: "Penyulingan",
    title: "Distilasi Uap 8 Jam",
    description: "Daun disuling menggunakan metode uap tekanan rendah selama 8 jam oleh Penyulingan Gayo Lestari, menghasilkan rendemen 2,8%.",
    date: "2026-08-12",
    location: "Penyulingan Gayo Lestari",
    meta: { Metode: "Steam Distillation", Durasi: "8 jam", Rendemen: "2,8%" },
    verified: true,
  },
  {
    stage: "Pengujian",
    title: "Analisis Kadar PA — AI Verified",
    description: "Nilam Analyzer AI menganalisis sampel dan menghasilkan estimasi kadar Patchouli Alcohol 34,2%, masuk grade Premium.",
    date: "2026-08-13",
    meta: { "Kadar PA": "34,2%", Grade: "Premium", Metode: "NIRS-PLS AI" },
    verified: true,
  },
  {
    stage: "Distribusi",
    title: "Pengiriman ke UMKM Mitra",
    description: "Minyak mentah dikirim ke Toko Parfum UMKM Seulawah di Banda Aceh untuk diproses menjadi parfum jadi.",
    date: "2026-08-20",
    location: "Pusat Logistik Aceh",
    verified: true,
  },
  {
    stage: "Botol",
    title: "Diformulasi & Dikemas",
    description: "Minyak diformulasikan dengan konsentrasi 18% menjadi Eau de Parfum 'Seulawah Elixir' dan dikemas dengan QR traceability.",
    date: "2026-09-02",
    location: "Toko Parfum UMKM Seulawah",
    verified: true,
  },
];

export const FINISHED_PRODUCTS: FinishedProduct[] = [
  {
    id: "fp-seulawah-elixir",
    type: "finished-product",
    title: "Parfum Eksklusif ATSIRA - Eau De Parfum", // Judul disesuaikan dengan MOCK_FINISHED_PRODUCTS Anda
    category: "Parfum",
    umkmId: "umkm-seulawah",
    price: 350000, // Harga disesuaikan agar sama dengan di toko
    unit: "pcs",
    stock: 24,
    rating: 4.9,
    reviewCount: 142,
    badges: ["AI Verified", "Halal Ready"],
    imageUrl: "/images/products/parfume1.png", // SEKARANG FOTO PARFUM ANDA SUDAH MASUK KE SINI!
    gallery: [
      "/images/products/parfume1.png",
    ],
    description:
      "Eau de Parfum unisex dengan jantung wangi nilam Gayo otentik berkadar PA 34,2%. Dipadukan dengan bergamot dan kayu cendana untuk profil hangat-earthy yang tahan lama. Setiap botol membawa kisah dari kebun Pak Syukur di Gayo hingga ke tangan Anda.",
    notes: {
      top: ["Bergamot", "Lada Pink"],
      middle: ["Nilam Gayo", "Mawar Kering"],
      base: ["Kayu Cendana", "Amber", "Musk"],
    },
    sourcedFromRawOilId: "raw-gayo-001",
    traceability: SEULAWAH_TRACE,
    coaSnapshot: SYUKUR_COA,
    qrBatchId: "ATR-2024-NLM",
  },
  {
    id: "fp-gayowood-musk",
    type: "finished-product",
    title: "Parfum Pria Maskulin Nilam Wood", // Judul disesuaikan
    category: "Parfum",
    umkmId: "umkm-seulawah",
    price: 290000,
    unit: "pcs",
    stock: 31,
    rating: 4.8,
    reviewCount: 58,
    badges: ["AI Verified"],
    imageUrl: "/images/products/parfume2.png", // Menggunakan aset foto Anda
    gallery: [
      "/images/products/parfume2.png",
    ],
    description: "Profil woody-musky pekat untuk pemakaian malam, dengan basis nilam Aceh Barat grade Standard.",
    notes: { top: ["Cengkeh"], middle: ["Nilam"], base: ["Musk", "Kayu Gaharu"] },
    sourcedFromRawOilId: "raw-baratdaya-002",
    traceability: SEULAWAH_TRACE.map((s) => ({ ...s, title: s.title.replace("Bener Meriah", "Aceh Barat") })),
    coaSnapshot: RAW_OIL_LISTINGS[1].coa,
    qrBatchId: "ATR-2024-GWM",
  },
  {
    id: "fp-nilam-diffuser",
    type: "finished-product",
    title: "Paket Set Diffuser Ruangan Mewah", // Judul disesuaikan
    category: "Diffuser",
    umkmId: "umkm-seulawah",
    price: 420000,
    unit: "set",
    stock: 15,
    rating: 4.9,
    reviewCount: 88,
    badges: ["Eco Badge", "AI Verified"],
    imageUrl: "/images/products/diffuser set.png", // Menggunakan aset foto Anda
    gallery: ["/images/products/diffuser set.png"],
    description: "Reed diffuser keramik buatan tangan dengan minyak esensial nilam Gayo, cocok untuk ruang kerja maupun kamar tidur.",
    notes: { top: ["Nilam"], middle: ["Cedar"], base: ["Vanila"] },
    sourcedFromRawOilId: "raw-gayo-001",
    traceability: SEULAWAH_TRACE,
    coaSnapshot: SYUKUR_COA,
    qrBatchId: "ATR-2024-DIF",
  },
  {
    id: "fp-sabun-nilam",
    type: "finished-product",
    title: "Sabun Herbal Organik Ekstrak Nilam",
    category: "Sabun Nilam",
    umkmId: "umkm-acehscent",
    price: 35000,
    unit: "bar",
    stock: 120,
    rating: 4.7,
    reviewCount: 210,
    badges: ["Halal Ready", "Eco Badge"],
    imageUrl: "/images/products/soap.png", // Menggunakan aset foto Anda
    gallery: ["/images/products/soap.png"],
    description: "Sabun batang dengan campuran minyak nilam Aceh Jaya dan minyak kelapa organik, lembut untuk kulit sensitif.",
    notes: { top: ["Citrus"], middle: ["Nilam"], base: ["Kelapa"] },
    sourcedFromRawOilId: "raw-vetiver-003",
    traceability: SEULAWAH_TRACE,
    coaSnapshot: RAW_OIL_LISTINGS[2].coa,
    qrBatchId: "ATR-2024-SBN",
  },
  {
    id: "fp-lilin-aromaterapi",
    type: "finished-product",
    title: "Minyak Aromaterapi Relaksasi Nilam",
    category: "Lilin Aromaterapi",
    umkmId: "umkm-acehscent",
    price: 650000,
    unit: "botol",
    stock: 48,
    rating: 4.8,
    reviewCount: 96,
    badges: ["AI Verified"],
    imageUrl: "/images/products/aromatherapy.png", // Menggunakan aset foto Anda
    gallery: ["/images/products/aromatherapy.png"],
    description: "Lilin soy wax dengan campuran nilam Gayo dan lavender, waktu bakar hingga 40 jam.",
    notes: { top: ["Lavender"], middle: ["Nilam"], base: ["Vanila"] },
    sourcedFromRawOilId: "raw-gayo-001",
    traceability: SEULAWAH_TRACE,
    coaSnapshot: SYUKUR_COA,
    qrBatchId: "ATR-2024-LLN",
  },
  {
    id: "fp-minyak-eceran",
    type: "finished-product",
    title: "Serum Wajah Anti-Aging Nilam Glow",
    category: "Essential Oil Eceran",
    umkmId: "farmer-direct",
    price: 185000,
    unit: "botol",
    stock: 90,
    rating: 5.0,
    reviewCount: 34,
    badges: ["AI Verified", "Eco Badge"],
    imageUrl: "/images/products/serum.png", // Menggunakan aset foto Anda
    gallery: ["/images/products/serum.png"],
    description: "Minyak nilam murni dalam kemasan kecil, dijual langsung oleh Pak Syukur tanpa perantara (C2C) — dengan kadar PA 34,2%.",
    notes: { top: [], middle: ["Nilam Murni"], base: [] },
    sourcedFromRawOilId: "raw-gayo-001",
    traceability: SEULAWAH_TRACE,
    coaSnapshot: SYUKUR_COA,
    qrBatchId: "ATR-2024-ECR",
  },
];

export const ALL_PRODUCTS = [...RAW_OIL_LISTINGS, ...FINISHED_PRODUCTS];

export function getProductById(id: string) {
  return ALL_PRODUCTS.find((p) => p.id === id);
}