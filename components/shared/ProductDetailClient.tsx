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
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { formatIDR, formatDateID } from "@/lib/mock";
import { useCartStore } from "@/lib/store";
import { useLang } from "@/components/layout/Navbar";
import { ALL_PRODUCTS } from "@/lib/mock/products";

const STAGE_ICON: Record<string, typeof MapPin> = {
  Kebun: MapPin,
  Penyulingan: FlaskConical,
  Pengujian: CheckCircle2,
  Distribusi: ShoppingCart,
  Botol: Star,
};

const T_DETAIL = {
  back: { ID: "Kembali ke Pasar", EN: "Back to Marketplace" },
  by: { ID: "oleh", EN: "by" },
  reviews: { ID: "ulasan", EN: "reviews" },
  technicalSpec: { ID: "Spesifikasi Teknis & Kualitas", EN: "Technical & Quality Specifications" },
  scentProfile: { ID: "Profil Aroma", EN: "Scent Profile" },
  scentLayers: { top: { ID: "Atas", EN: "Top" }, middle: { ID: "Tengah", EN: "Middle" }, base: { ID: "Dasar", EN: "Base" } },
  btnAdded: { ID: "Ditambahkan!", EN: "Added!" },
  btnCart: { ID: "Tambah ke Keranjang", EN: "Add to Cart" },
  btnChat: { ID: "Chat Penjual", EN: "Chat Seller" },
  traceEyebrow: { ID: "Transparansi dari Tanah ke Botol", EN: "Transparency from Soil to Bottle" },
  traceTitle: { ID: "Rantai Asal-Usul Interaktif", EN: "Interactive Chain of Origin" },
  verified: { ID: "Terverifikasi", EN: "Verified" },
  specLabels: {
    paLevel: { ID: "Kadar PA", EN: "PA Level" },
    acidNumber: { ID: "Bilangan Asam", EN: "Acid Number" },
    color: { ID: "Warna", EN: "Color" },
    viscosity: { ID: "Kekentalan", EN: "Viscosity" }
  }
};

export function ProductDetailClient({ product }: { product: any }) {
  const lang = (useLang() || "ID") as "ID" | "EN";
  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const matchedProduct = ALL_PRODUCTS.find((p: any) => p.id === product?.id) || ALL_PRODUCTS[0];
  const isRaw = matchedProduct.type === "raw-oil" || !matchedProduct.unit || matchedProduct.unit === "kg";
  const [qty, setQty] = useState(isRaw ? ((matchedProduct as any).minOrderKg || 5) : 1);

  if (!mounted) {
    return (
      <PageShell>
        <div className="container-app py-24 flex items-center justify-center text-outline text-sm">
          Memuat detail produk...
        </div>
      </PageShell>
    );
  }

  // LOGIKA KONSISTEN: Pencocokan kriteria ARC / USK Verified yang sama persis dengan page induk
  const isArcVerified = 
  (matchedProduct as any).badges?.includes("USK Verified") || 
  (matchedProduct as any).verifiedBy === "arc" || 
  String(matchedProduct.id).includes("gayowood") || 
  String(matchedProduct.id).includes("usk");

  const mainImage = matchedProduct.imageUrl || (matchedProduct as any).img || "/images/products/minyak nilam.png";
  const images = isRaw ? [mainImage] : ((matchedProduct as any).gallery?.length > 0 ? (matchedProduct as any).gallery : [mainImage]);
  const coa = (matchedProduct as any).coa || (matchedProduct as any).coaSnapshot || (matchedProduct as any).coaFields;
  const traceability = !isRaw ? (matchedProduct as any).traceability : undefined;

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
      price: isRaw ? ((matchedProduct as any).pricePerKg || (matchedProduct as any).price) : (matchedProduct as any).price,
      unit: isRaw ? "kg" : (matchedProduct.unit || "pcs"),
      qty,
      category: isRaw ? "raw-oil" : "finished-product",
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
          <div>
            <div className="aspect-square rounded-md overflow-hidden mb-3 bg-surface-container-low border border-surface-container-high shadow-sm">
              <img src={images[activeImg]} alt={getLocalizedText(matchedProduct.title)} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded overflow-hidden border-2 ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {isArcVerified ? (
                <Badge variant="usk" className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-sky-50 text-sky-950 border border-sky-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 inline" /> Arc Verified
                </Badge>
              ) : (
                <Badge variant="ai" className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-amber-50 text-amber-950 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 inline" /> Atsira Verified
                </Badge>
              )}
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
                  {(matchedProduct as any).rating || "5.0"} ({(matchedProduct as any).reviewCount || 10} {T_DETAIL.reviews[lang]}) · {(matchedProduct as any).storeName || "UMKM Aceh"}
                </span>
              </div>
            )}

            <p className="font-display text-3xl font-bold text-primary mb-1">
              {formatIDR(isRaw ? ((matchedProduct as any).pricePerKg || (matchedProduct as any).price) : (matchedProduct as any).price)}
              <span className="text-base font-body font-normal text-outline"> /{isRaw ? "kg" : (matchedProduct.unit || "pcs")}</span>
            </p>

            <p className="text-body-md text-on-surface-variant mb-6 mt-4">{getLocalizedText(matchedProduct.description)}</p>

            {coa && (
              <Card className="p-5 mb-6">
                <p className="text-label-md uppercase text-on-surface-variant mb-3">{T_DETAIL.technicalSpec[lang]}</p>
                <div className="grid grid-cols-2 gap-4 font-mono text-technical-mono">
                  <Spec label={T_DETAIL.specLabels.paLevel[lang]} value={`${coa.paLevel || 32}%`} highlight />
                  <Spec label={T_DETAIL.specLabels.acidNumber[lang]} value={`${coa.acidNumber || "1.1"}`} />
                  <Spec label={T_DETAIL.specLabels.color[lang]} value={typeof coa.color === "object" ? getLocalizedText(coa.color) : (coa.color || "Kuning")} />
                  <Spec label={T_DETAIL.specLabels.viscosity[lang]} value={typeof coa.viscosity === "object" ? getLocalizedText(coa.viscosity) : (coa.viscosity || "Cair")} />
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-[11.5px] text-on-surface-variant/80 leading-relaxed font-sans">
                  {isArcVerified ? (
                    lang === "ID" ? (
                      <p>🧪 <strong>Metode Uji:</strong> Mutu sampel batch ini terverifikasi melalui pengujian kromatografi gas <em>Gas Chromatography-Mass Spectrometry</em> (GC-MS) resmi di <strong>Laboratorium ARC-USK</strong>.</p>
                    ) : (
                      <p>🧪 <strong>Test Method:</strong> Batch quality verified through official <em>Gas Chromatography-Mass Spectrometry</em> (GC-MS) analysis at <strong>ARC-USK Laboratory</strong>.</p>
                    )
                  ) : (
                    lang === "ID" ? (
                      <p>✨ <strong>Metode Uji:</strong> Mutu sampel batch ini terverifikasi spektral optik model prediksi NIRS-PLS oleh sistem <strong>Atsira QualitySense</strong>.</p>
                    ) : (
                      <p>✨ <strong>Test Method:</strong> Batch quality verified instantly via optical spectral scan and NIRS-PLS prediction on the <strong>Atsira QualitySense</strong> platform.</p>
                    )
                  )}
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
              <button onClick={handleAddToCart} className="flex-1 bg-primary text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors shadow-xs">
                {added ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? T_DETAIL.btnAdded[lang] : T_DETAIL.btnCart[lang]}
              </button>
              <button className="px-4 py-3 border border-stone-200 hover:border-stone-900 rounded-xl transition-colors bg-stone-50 text-stone-700 font-bold text-sm flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> {T_DETAIL.btnChat[lang]}
              </button>
            </div>
          </div>
        </div>
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