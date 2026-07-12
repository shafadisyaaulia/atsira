"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  FlaskConical,
  CheckCircle2,
  ShoppingCart,
  MessageCircle,
  Star,
  ChevronLeft,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatIDR, formatDateID } from "@/lib/mock";
import { useCartStore } from "@/lib/store";
import { useLang } from "@/components/layout/Navbar";

// ── IMPORT DATABASE PRODUK UTAMA ──
import { ALL_PRODUCTS } from "@/lib/mock/products";

const STAGE_ICON: Record<string, typeof MapPin> = {
  Kebun: MapPin,
  Penyulingan: FlaskConical,
  Pengujian: CheckCircle2,
  Distribusi: ShoppingCart,
  Botol: Star,
};

// Kamus Translasi Lokal
const T_DETAIL = {
  back: { ID: "Kembali ke Pasar", EN: "Back to Marketplace" },
  by: { ID: "oleh", EN: "by" },
  reviews: { ID: "ulasan", EN: "reviews" },
  technicalSpec: { ID: "Spesifikasi Teknis & Kualitas", EN: "Technical & Quality Specifications" },
  scentProfile: { ID: "Profil Aroma", EN: "Scent Profile" },
  scentLayers: {
    top: { ID: "Atas", EN: "Top" },
    middle: { ID: "Tengah", EN: "Middle" },
    base: { ID: "Dasar", EN: "Base" }
  },
  btnAdded: { ID: "Ditambahkan!", EN: "Added!" },
  btnCart: { ID: "Tambah ke Keranjang", EN: "Add to Cart" },
  btnChat: { ID: "Chat Penjual", EN: "Chat Seller" },
  traceEyebrow: { ID: "Transparansi dari Tanah ke Botol", EN: "Transparency from Soil to Bottle" },
  traceTitle: { ID: "Rantai Asal-Usul Interaktif", EN: "Interactive Chain of Origin" },
  verified: { ID: "Terverifikasi", EN: "Verified" },
  fullTrace: { ID: "Lihat halaman pelacakan lengkap untuk Batch", EN: "View full tracking page for Batch" },
  specLabels: {
    paLevel: { ID: "Kadar PA", EN: "PA Level" },
    acidNumber: { ID: "Bilangan Asam", EN: "Acid Number" },
    density: { ID: "Densitas", EN: "Density" },
    color: { ID: "Warna", EN: "Color" },
    viscosity: { ID: "Kekentalan", EN: "Viscosity" },
    method: { ID: "Metode Uji", EN: "Test Method" }
  }
};

export function ProductDetailClient({ product }: { product: any }) {
  const lang = (useLang() || "ID") as "ID" | "EN";

  // 1. STATE PENGUNCI HYDRATION MISMATCH
  const [mounted, setMounted] = useState(false);
  
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cari di database ALL_PRODUCTS global yang lengkap
  const matchedProduct = ALL_PRODUCTS.find((p: any) => p.id === product?.id) || ALL_PRODUCTS[0];
  
  // Normalisasi tipe produk
  const isRaw = matchedProduct.type === "raw-oil" || !matchedProduct.unit || matchedProduct.unit === "kg";
  
  // FIX 1: Gunakan Type Assertion (as any) untuk properti dinamis minOrderKg
  const [qty, setQty] = useState(isRaw ? ((matchedProduct as any).minOrderKg || 5) : 1);

  // 2. PROTEKSI RENDER: Jika belum di-mount di client, tampilkan loading agar server & client sinkron
  if (!mounted) {
    return (
      <PageShell>
        <div className="container-app py-24 flex items-center justify-center text-outline text-sm">
          Memuat detail produk...
        </div>
      </PageShell>
    );
  }

  // FIX 2: Gunakan Type Assertion (as any) untuk properti alternatif gambar .img
  const mainImage = matchedProduct.imageUrl || (matchedProduct as any).img || "/images/products/minyak nilam.png";  
  const images = isRaw 
    ? [mainImage] 
    : ((matchedProduct as any).gallery && (matchedProduct as any).gallery.length > 0 ? (matchedProduct as any).gallery : [mainImage]);

  // FIX 3: Gunakan Type Assertion (as any) untuk properti dokumen laboratorium CoA dan Traceability
  const coa = (matchedProduct as any).coa || (matchedProduct as any).coaSnapshot || (matchedProduct as any).coaFields;
  const traceability = !isRaw ? (matchedProduct as any).traceability : undefined;

  // Normalisasi judul dan deskripsi dwi-bahasa
  const getLocalizedText = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field["ID"] || field["EN"] || "";
  };

  function handleAddToCart() {
    addItem({
      productId: matchedProduct.id,
      title: getLocalizedText(matchedProduct.title),
      imageUrl: mainImage,
      // FIX 4: Gunakan Type Assertion (as any) untuk pricePerKg grosir
      price: isRaw ? ((matchedProduct as any).pricePerKg || (matchedProduct as any).price) : (matchedProduct as any).price,
      unit: isRaw ? "kg" : (matchedProduct.unit || "pcs"),
      qty,
      category: isRaw ? "raw-oil" : "finished-product", // Disinkronkan dengan keranjang belanja
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <PageShell>
      <div className="container-app py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-4">
          <ChevronLeft className="w-4 h-4" /> {T_DETAIL.back[lang]}
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Sisi Kiri: Gambar */}
          <div>
            <div className="aspect-square rounded-md overflow-hidden mb-3 bg-surface-container-low border border-surface-container-high shadow-sm">
              <img src={images[activeImg]} alt={getLocalizedText(matchedProduct.title)} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 ${
                      activeImg === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Konten */}
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {matchedProduct.badges && matchedProduct.badges.map((b: string) => (
                <Badge key={b} variant={b === "AI Verified" ? "ai" : b === "USK Verified" ? "usk" : b === "Eco Badge" ? "eco" : "halal"}>
                  {b}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-headline-md text-primary mb-2">{getLocalizedText(matchedProduct.title)}</h1>

            {isRaw ? (
              <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {getLocalizedText((matchedProduct as any).region)} · {T_DETAIL.by[lang]} {(matchedProduct as any).farmerName || (matchedProduct as any).seller || "Petani Nilam"}
              </p>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 fill-secondary-fixed text-secondary-fixed" />
                <span className="text-sm text-on-surface-variant">
                  {(matchedProduct as any).rating || "5.0"} ({(matchedProduct as any).reviewCount || (matchedProduct as any).reviews || 10} {T_DETAIL.reviews[lang]}) · {(matchedProduct as any).storeName || (matchedProduct as any).seller || "UMKM Aceh"}
                </span>
              </div>
            )}

            <p className="font-display text-3xl font-bold text-primary mb-1">
              {formatIDR(isRaw ? ((matchedProduct as any).pricePerKg || (matchedProduct as any).price) : (matchedProduct as any).price)}
              <span className="text-base font-body font-normal text-outline"> /{isRaw ? "kg" : (matchedProduct.unit || "pcs")}</span>
            </p>

            <p className="text-body-md text-on-surface-variant mb-6 mt-4">{getLocalizedText(matchedProduct.description)}</p>

            {/* COA / Lab Specs */}
            {coa && (
              <Card className="p-5 mb-6">
                <p className="text-label-md uppercase text-on-surface-variant mb-3">{T_DETAIL.technicalSpec[lang]}</p>
                <div className="grid grid-cols-2 gap-4 font-mono text-technical-mono">
                  <Spec label={T_DETAIL.specLabels.paLevel[lang]} value={`${coa.paLevel || 30}%`} highlight />
                  <Spec label={T_DETAIL.specLabels.acidNumber[lang]} value={`${coa.acidNumber || "1.1"}`} />
                  <Spec label={T_DETAIL.specLabels.density[lang]} value={`${coa.density || "0.9"} g/mL`} />
                  <Spec label={T_DETAIL.specLabels.color[lang]} value={typeof coa.color === "object" ? getLocalizedText(coa.color) : (coa.color || "Kuning")} />
                  <Spec label={T_DETAIL.specLabels.viscosity[lang]} value={typeof coa.viscosity === "object" ? getLocalizedText(coa.viscosity) : (coa.viscosity || "Cair")} />
                  <Spec label={T_DETAIL.specLabels.method[lang]} value={coa.method || "GC-MS"} />
                </div>
              </Card>
            )}

            {!isRaw && (matchedProduct as any).notes && (
              <Card className="p-5 mb-6">
                <p className="text-label-md uppercase text-on-surface-variant mb-3">{T_DETAIL.scentProfile[lang]}</p>
                <div className="space-y-2 text-sm">
                  {(["top", "middle", "base"] as const).map((layer) => {
                    const notes = (matchedProduct as any).notes[layer];
                    if (!notes || !notes.length) return null;
                    return (
                      <div key={layer} className="flex gap-3">
                        <span className="w-20 text-outline capitalize">{T_DETAIL.scentLayers[layer][lang]}</span>
                        <span className="text-on-surface">{notes.join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <div className="flex items-center gap-3 mb-4">
              <input
                type="number"
                value={qty}
                min={isRaw ? ((matchedProduct as any).minOrderKg || 5) : 1}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-24 px-3 py-3 rounded border border-sand-gray bg-bone-wash text-center font-semibold"
              />
              <span className="text-sm text-outline">{isRaw ? "kg" : (matchedProduct.unit || "pcs")}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                {added ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? T_DETAIL.btnAdded[lang] : T_DETAIL.btnCart[lang]}
              </Button>
              <Button variant="secondary" size="lg">
                <MessageCircle className="w-5 h-5" /> {T_DETAIL.btnChat[lang]}
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline Traceability */}
        {traceability && (
          <section className="mb-16">
            <SectionEyebrow>{T_DETAIL.traceEyebrow[lang]}</SectionEyebrow>
            <h2 className="font-display text-headline-md text-primary mb-8">{T_DETAIL.traceTitle[lang]}</h2>
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-outline-variant hidden sm:block" />
              <div className="space-y-6">
                {traceability.map((stage: any, index: number) => {
                  const Icon = STAGE_ICON[stage.stage] ?? MapPin;
                  return (
                    <div key={index} className="flex gap-4 sm:gap-5 relative">
                      <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary text-on-primary items-center justify-center flex-shrink-0 z-10">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Card className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-clay-earth font-semibold mb-0.5">{stage.stage}</p>
                            <p className="font-semibold text-on-surface">{getLocalizedText(stage.title)}</p>
                          </div>
                          {stage.verified && (
                            <Badge variant="success">
                              <CheckCircle2 className="w-3 h-3" /> {T_DETAIL.verified[lang]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-on-surface-variant mb-3">{getLocalizedText(stage.description)}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-outline">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {formatDateID(stage.date)}
                          </span>
                          {stage.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {stage.location}
                            </span>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

function Spec({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-outline mb-0.5">{label}</p>
      <p className={highlight ? "text-clay-earth font-semibold" : "text-on-surface"}>{value}</p>
    </div>
  );
}