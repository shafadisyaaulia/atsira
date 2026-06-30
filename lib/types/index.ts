// ============================================================================
// ATSIRA — Core Domain Types
// Schema ini dirancang agar 1:1 mudah dipetakan ke tabel Supabase (PostgreSQL)
// nantinya. Setiap interface = calon nama tabel (snake_case di DB).
// ============================================================================

export type UserRole = "petani" | "umkm" | "buyer" | "peneliti";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  location?: string;
  joinedAt: string;
  verified: boolean;
}

export type QualityGrade = "Premium" | "Standard" | "Economy" | "Reject";

export type CertBadge = "AI Verified" | "USK Verified" | "Eco Badge" | "Halal Ready";

export interface CoaData {
  paLevel: number; // Kadar Patchouli Alcohol (%)
  acidNumber: number; // Bilangan asam
  density: number; // g/mL
  color: "Jernih" | "Kuning Pucat" | "Coklat Muda" | "Coklat Tua";
  viscosity: "Rendah" | "Sedang" | "Tinggi";
  analyzedAt: string;
  method: "NIRS-PLS AI" | "GC-MS Lab (ARC-USK)";
  confidenceScore?: number; // 0-100, hanya untuk hasil AI
}

export interface TraceabilityStage {
  stage: "Kebun" | "Penyulingan" | "Pengujian" | "Distribusi" | "Botol";
  title: string;
  description: string;
  date: string;
  location?: string;
  gpsCoords?: { lat: number; lng: number };
  meta?: Record<string, string>;
  verified: boolean;
}

export interface Farmer {
  id: string;
  name: string;
  location: string; // e.g. "Gayo, Aceh Tengah"
  region: "Gayo" | "Bener Meriah" | "Aceh Barat" | "Aceh Jaya" | "Aceh Selatan";
  gpsCoords: { lat: number; lng: number };
  farmSizeHa: number;
  joinedAt: string;
  totalHarvests: number;
  ecoBadge: boolean;
  avatarUrl?: string;
  quote?: string;
}

export interface Distillery {
  id: string;
  name: string;
  location: string;
  method: "Penyulingan Uap" | "Penyulingan Air" | "Steam-Water Combined";
  durationHours: number;
  rendemenPercent: number;
  farmerId: string;
  uskVerified: boolean;
}

export interface RawOilListing {
  id: string;
  type: "raw-oil";
  title: string;
  farmerId: string;
  distilleryId: string;
  region: string;
  pricePerKg: number;
  minOrderKg: number;
  stockKg: number;
  coa: CoaData;
  grade: QualityGrade;
  badges: CertBadge[];
  listedAt: string;
  sellMode: "fixed" | "auction";
  auctionEndsAt?: string;
  highestBid?: number;
  imageUrl: string;
  description: string;
}

export interface FinishedProduct {
  id: string;
  type: "finished-product";
  title: string;
  category: "Parfum" | "Lilin Aromaterapi" | "Sabun Nilam" | "Essential Oil Eceran" | "Diffuser";
  umkmId: string;
  price: number;
  unit: string; // "10ml", "30ml", "1 pcs"
  stock: number;
  rating: number;
  reviewCount: number;
  badges: CertBadge[];
  imageUrl: string;
  gallery: string[];
  description: string;
  notes: { top: string[]; middle: string[]; base: string[] };
  sourcedFromRawOilId: string; // link ke RawOilListing -> traceability chain
  traceability: TraceabilityStage[];
  coaSnapshot: CoaData; // snapshot kadar PA dari minyak yang dipakai
  qrBatchId: string; // e.g. "ATR-2024-NLM"
}

export type Product = RawOilListing | FinishedProduct;

export interface UmkmStore {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  logoUrl: string;
  bio: string;
  joinedAt: string;
  halalCertified: boolean;
  bpomCertified: boolean;
  totalProducts: number;
  totalSales: number;
}

export interface PriceTick {
  date: string;
  premium: number;
  standard: number;
  economy: number;
}

export interface PriceAlert {
  id: string;
  grade: QualityGrade;
  region: string;
  thresholdPrice: number;
  direction: "above" | "below";
  active: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  type: "B2B" | "B2C" | "C2C";
  items: { productId: string; title: string; qty: number; unit: string; price: number }[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: "Menunggu Pembayaran" | "Diproses" | "Dikirim" | "Diterima" | "Selesai" | "Dibatalkan";
  escrowStatus: "Ditahan" | "Dicairkan" | "Dikembalikan";
  paymentMethod: string;
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface MagazineArticle {
  slug: string;
  title: string;
  category: "Tips Budidaya" | "Riset ARC-USK" | "Profil Petani Sukses" | "Panduan Bisnis Parfum";
  excerpt: string;
  content: string[];
  author: string;
  authorRole: string;
  publishedAt: string;
  readMinutes: number;
  imageUrl: string;
  featured?: boolean;
}

export interface ImpactMetric {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
}

export interface AnalyzerInput {
  imageDescription?: string;
  color: CoaData["color"];
  viscosity: CoaData["viscosity"];
  aromaDescription: string;
  region: string;
  distillationMethod: string;
}

export interface AnalyzerResult {
  paLevel: number;
  grade: QualityGrade;
  acidNumber: number;
  density: number;
  confidenceScore: number;
  recommendedPriceMin: number;
  recommendedPriceMax: number;
  improvementTips: string[];
  analyzedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface VerificationQueueItem {
  id: string;
  farmerId: string;
  farmerName: string;
  region: string;
  submittedAt: string;
  aiPaLevel: number;
  aiGrade: QualityGrade;
  status: "Menunggu" | "Dalam Proses" | "Lulus" | "Ditolak";
  sampleImageUrl: string;
}
