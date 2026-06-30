"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  FlaskConical,
  CheckCircle2,
  ShoppingCart,
  MessageCircle,
  Gavel,
  Star,
  ChevronLeft,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatIDR, formatDateID } from "@/lib/mock";
import { FARMERS } from "@/lib/mock/farmers";
import { UMKM_STORES } from "@/lib/mock/ecosystem";
import { useCartStore } from "@/lib/store";
import type { RawOilListing, FinishedProduct } from "@/lib/types";

const STAGE_ICON: Record<string, typeof MapPin> = {
  Kebun: MapPin,
  Penyulingan: FlaskConical,
  Pengujian: CheckCircle2,
  Distribusi: ShoppingCart,
  Botol: Star,
};

export function ProductDetailClient({ product }: { product: RawOilListing | FinishedProduct }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(product.type === "raw-oil" ? product.minOrderKg : 1);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const isRaw = product.type === "raw-oil";
  const images = isRaw ? [product.imageUrl] : product.gallery;
  const farmer = isRaw ? FARMERS.find((f) => f.id === product.farmerId) : undefined;
  const store = !isRaw ? UMKM_STORES.find((s) => s.id === product.umkmId) : undefined;
  const coa = isRaw ? product.coa : product.coaSnapshot;
  const traceability = !isRaw ? product.traceability : undefined;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      title: product.title,
      imageUrl: isRaw ? product.imageUrl : product.imageUrl,
      price: isRaw ? product.pricePerKg : product.price,
      unit: isRaw ? "kg" : product.unit,
      qty,
      category: product.type,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <PageShell>
      <div className="container-app py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-4">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Pasar
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-md overflow-hidden mb-3 bg-surface-container-low">
              <img src={images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
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

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {product.badges.map((b) => (
                <Badge key={b} variant={b === "AI Verified" ? "ai" : b === "USK Verified" ? "usk" : b === "Eco Badge" ? "eco" : "halal"}>
                  {b}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-headline-md text-primary mb-2">{product.title}</h1>

            {isRaw ? (
              <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {product.region} · oleh {farmer?.name}
              </p>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 fill-secondary-fixed text-secondary-fixed" />
                <span className="text-sm text-on-surface-variant">
                  {product.rating} ({product.reviewCount} ulasan) · {store?.name}
                </span>
              </div>
            )}

            <p className="font-display text-3xl font-bold text-primary mb-1">
              {formatIDR(isRaw ? product.pricePerKg : product.price)}
              <span className="text-base font-body font-normal text-outline"> /{isRaw ? "kg" : product.unit}</span>
            </p>
            {isRaw && product.sellMode === "auction" && product.highestBid && (
              <p className="text-sm text-clay-earth font-semibold mb-4">
                Penawaran tertinggi saat ini: {formatIDR(product.highestBid)}
              </p>
            )}

            <p className="text-body-md text-on-surface-variant mb-6">{product.description}</p>

            {/* Spec table */}
            <Card className="p-5 mb-6">
              <p className="text-label-md uppercase text-on-surface-variant mb-3">Spesifikasi Teknis & Kualitas</p>
              <div className="grid grid-cols-2 gap-4 font-mono text-technical-mono">
                <Spec label="Kadar PA" value={`${coa.paLevel}%`} highlight />
                <Spec label="Bilangan Asam" value={`${coa.acidNumber}`} />
                <Spec label="Densitas" value={`${coa.density} g/mL`} />
                <Spec label="Warna" value={coa.color} />
                <Spec label="Kekentalan" value={coa.viscosity} />
                <Spec label="Metode Uji" value={coa.method} />
              </div>
            </Card>

            {!isRaw && (product as FinishedProduct).notes && (
              <Card className="p-5 mb-6">
                <p className="text-label-md uppercase text-on-surface-variant mb-3">Profil Aroma</p>
                <div className="space-y-2 text-sm">
                  {(["top", "middle", "base"] as const).map((layer) => {
                    const notes = (product as FinishedProduct).notes[layer];
                    if (!notes.length) return null;
                    return (
                      <div key={layer} className="flex gap-3">
                        <span className="w-20 text-outline capitalize">{layer === "top" ? "Atas" : layer === "middle" ? "Tengah" : "Dasar"}</span>
                        <span className="text-on-surface">{notes.join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mb-4">
              <input
                type="number"
                value={qty}
                min={isRaw ? product.minOrderKg : 1}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-24 px-3 py-3 rounded border border-sand-gray bg-bone-wash text-center font-semibold"
              />
              <span className="text-sm text-outline">{isRaw ? "kg" : product.unit}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                {added ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? "Ditambahkan!" : isRaw && product.sellMode === "auction" ? "Ajukan Penawaran" : "Tambah ke Keranjang"}
              </Button>
              <Button variant="secondary" size="lg">
                <MessageCircle className="w-5 h-5" /> Chat Penjual
              </Button>
            </div>
          </div>
        </div>

        {/* Traceability */}
        {traceability && (
          <section className="mb-16">
            <SectionEyebrow>Transparansi dari Tanah ke Botol</SectionEyebrow>
            <h2 className="font-display text-headline-md text-primary mb-8">Rantai Asal-Usul Interaktif</h2>
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-outline-variant hidden sm:block" />
              <div className="space-y-6">
                {traceability.map((stage) => {
                  const Icon = STAGE_ICON[stage.stage] ?? MapPin;
                  return (
                    <div key={stage.stage} className="flex gap-4 sm:gap-5 relative">
                      <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary text-on-primary items-center justify-center flex-shrink-0 z-10">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Card className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-clay-earth font-semibold mb-0.5">{stage.stage}</p>
                            <p className="font-semibold text-on-surface">{stage.title}</p>
                          </div>
                          {stage.verified && (
                            <Badge variant="success">
                              <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-on-surface-variant mb-3">{stage.description}</p>
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
                        {stage.meta && (
                          <div className="flex gap-4 mt-3 pt-3 border-t border-surface-container-high flex-wrap">
                            {Object.entries(stage.meta).map(([k, v]) => (
                              <div key={k}>
                                <p className="text-[10px] uppercase text-outline">{k}</p>
                                <p className="text-sm font-mono font-semibold text-primary">{v}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
            {"qrBatchId" in product && (
              <div className="mt-6">
                <Link href={`/traceability?batch=${product.qrBatchId}`} className="text-sm font-semibold text-primary hover:underline">
                  Lihat halaman pelacakan lengkap untuk Batch {product.qrBatchId} →
                </Link>
              </div>
            )}
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
