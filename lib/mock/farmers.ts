import type { Farmer, Distillery } from "@/lib/types";

// ============================================================================
// RANTAI DATA TERKUNCI (Locked Data Chain)
// Pak Syukur (Gayo) -> Distilasi Cap Tekanan Rendah -> PA 34.2% (Premium)
// Rantai ini konsisten di: Dashboard Petani > Analyzer, Dashboard UMKM >
// B2B Sourcing, Marketplace > Seulawah Elixir, dan halaman Traceability.
// ============================================================================

export const FARMERS: Farmer[] = [
  {
    id: "farmer-syukur-gayo",
    name: "Pak Syukur",
    location: "Kebun Bener Meriah, Gayo",
    region: "Gayo",
    gpsCoords: { lat: 4.7283, lng: 96.8917 },
    farmSizeHa: 1.4,
    joinedAt: "2024-03-12",
    totalHarvests: 18,
    ecoBadge: true,
    avatarUrl: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=200&h=200&fit=crop",
    quote: "Sejak ada ATSIRA, saya jual langsung tanpa tengkulak. Harga jadi adil.",
  },
  {
    id: "farmer-abdullah-baratdaya",
    name: "Pak Abdullah",
    location: "Meulaboh, Aceh Barat",
    region: "Aceh Barat",
    gpsCoords: { lat: 4.1363, lng: 96.1285 },
    farmSizeHa: 2.1,
    joinedAt: "2024-05-02",
    totalHarvests: 11,
    ecoBadge: true,
    avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
    quote: "Menanam nilam bukan hanya soal hasil, tapi menjaga warisan tanah Aceh untuk keturunan kami.",
  },
  {
    id: "farmer-siti-baratdaya",
    name: "Bu Siti Aminah",
    location: "Calang, Aceh Jaya",
    region: "Aceh Jaya",
    gpsCoords: { lat: 4.6285, lng: 95.5868 },
    farmSizeHa: 0.9,
    joinedAt: "2024-07-19",
    totalHarvests: 6,
    ecoBadge: false,
    avatarUrl: "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?w=200&h=200&fit=crop",
  },
];

export const DISTILLERIES: Distillery[] = [
  {
    id: "distillery-gayo-lestari",
    name: "Penyulingan Gayo Lestari",
    location: "Bener Meriah, Aceh Tengah",
    method: "Penyulingan Uap",
    durationHours: 8,
    rendemenPercent: 2.8,
    farmerId: "farmer-syukur-gayo",
    uskVerified: true,
  },
  {
    id: "distillery-koperasi-baratdaya",
    name: "Koperasi Nilam Aceh Barat",
    location: "Meulaboh, Aceh Barat",
    method: "Steam-Water Combined",
    durationHours: 10,
    rendemenPercent: 2.4,
    farmerId: "farmer-abdullah-baratdaya",
    uskVerified: true,
  },
  {
    id: "distillery-heritage-lab",
    name: "Atsiri Heritage Lab",
    location: "Banda Aceh",
    method: "Penyulingan Air",
    durationHours: 6,
    rendemenPercent: 2.1,
    farmerId: "farmer-siti-baratdaya",
    uskVerified: false,
  },
];

export const CURRENT_FARMER = FARMERS[0]; // Pak Syukur — protagonist of the locked demo flow
