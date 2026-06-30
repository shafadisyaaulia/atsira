"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Wallet,
  Heart,
  Truck,
  Globe2,
  Gavel,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ORDERS, RAW_OIL_LISTINGS, FINISHED_PRODUCTS, formatIDR, formatDateID } from "@/lib/mock";

const STATUS_COLOR: Record<string, "neutral" | "ai" | "success" | "warning"> = {
  "Menunggu Pembayaran": "warning",
  Diproses: "ai",
  Dikirim: "neutral",
  Diterima: "success",
  Selesai: "success",
  Dibatalkan: "warning",
};

export default function DashboardBuyerPage() {
  return (
    <DashboardShell role="buyer">
      <div className="space-y-10">
        <h1 className="font-display text-headline-md text-primary">Dasbor Buyer</h1>
        <div id="orders">
          <OrderTracking />
        </div>
        <div id="wallet">
          <WalletSection />
        </div>
        <div id="favorites">
          <FavoritesWatchlist />
        </div>
      </div>
    </DashboardShell>
  );
}

function OrderTracking() {
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Pelacakan Pesanan</h2>
      <div className="space-y-4">
        {ORDERS.map((o) => (
          <Card key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-mono text-xs text-primary">#{o.id}</p>
                <Badge variant={o.type === "B2B" ? "ai" : "neutral"}>{o.type}</Badge>
                <Badge variant={STATUS_COLOR[o.status]}>{o.status}</Badge>
              </div>
              <p className="text-sm font-medium text-on-surface">
                {o.items[0].title} <span className="text-outline">×{o.items[0].qty} {o.items[0].unit}</span>
              </p>
              <p className="text-xs text-outline mt-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> {o.courier} · {o.trackingNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-primary">{formatIDR(o.total)}</p>
              <p className="text-xs text-outline">{formatDateID(o.createdAt)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WalletSection() {
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Dompet B2B &amp; Multi-Currency</h2>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6 bg-primary text-inverse-on-surface">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-secondary-fixed" />
            <p className="text-sm text-inverse-on-surface/70">Saldo Tersedia</p>
          </div>
          <p className="font-display text-3xl font-bold mb-1">{formatIDR(45200000)}</p>
          <p className="text-sm text-inverse-on-surface/60 mb-5">≈ USD 2.890</p>
          <div className="flex gap-3">
            <Button variant="gold" size="sm">
              <CreditCard className="w-4 h-4" /> Top Up
            </Button>
            <Button variant="secondary" size="sm" className="border-white/40 text-white hover:bg-white hover:text-primary">
              <Globe2 className="w-4 h-4" /> Tukar Mata Uang
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          <p className="font-semibold text-on-surface mb-4">Riwayat Invoice</p>
          <div className="space-y-3">
            {ORDERS.filter((o) => o.type === "B2B").map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-surface-container-high pb-3 last:border-0">
                <div>
                  <p className="font-medium text-on-surface">{o.id}</p>
                  <p className="text-xs text-outline">{o.paymentMethod}</p>
                </div>
                <p className="font-semibold text-primary">{formatIDR(o.total)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function FavoritesWatchlist() {
  const favoriteAuctions = RAW_OIL_LISTINGS.filter((p) => p.sellMode === "auction");
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Favorit &amp; Daftar Pantau</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-on-surface-variant mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-clay-earth" /> Penyuling Favorit
          </p>
          <div className="grid grid-cols-2 gap-3">
            {FINISHED_PRODUCTS.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/marketplace/${p.id}`}>
                <Card className="overflow-hidden">
                  <div className="aspect-square">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-on-surface line-clamp-1">{p.title}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface-variant mb-3 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-clay-earth" /> Lelang Aktif yang Dipantau
          </p>
          <div className="space-y-3">
            {favoriteAuctions.map((a) => (
              <Card key={a.id} className="p-4 flex items-center gap-4">
                <img src={a.imageUrl} alt={a.title} className="w-14 h-14 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface line-clamp-1">{a.title}</p>
                  <p className="text-xs text-outline">Penawaran tertinggi: {formatIDR(a.highestBid ?? 0)}</p>
                </div>
                <Link href={`/marketplace/${a.id}`} className="text-primary">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
