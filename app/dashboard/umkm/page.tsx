"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Store,
  TrendingUp,
  Package,
  QrCode,
  Plus,
  CheckCircle2,
  Truck,
  Filter,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, Badge, SectionEyebrow as SectionLabel } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label } from "@/components/ui/Input";
import { RAW_OIL_LISTINGS, FINISHED_PRODUCTS, ORDERS, formatIDR, formatDateID } from "@/lib/mock";
import { FARMERS } from "@/lib/mock/farmers";
import { UMKM_STORES } from "@/lib/mock/ecosystem";

const SALES_TREND = [
  { day: "Sen", sales: 1240000 },
  { day: "Sel", sales: 1890000 },
  { day: "Rab", sales: 980000 },
  { day: "Kam", sales: 2150000 },
  { day: "Jum", sales: 2840000 },
  { day: "Sab", sales: 3920000 },
  { day: "Min", sales: 3210000 },
];

const STATUS_COLOR: Record<string, "neutral" | "ai" | "success" | "warning"> = {
  "Menunggu Pembayaran": "warning",
  Diproses: "ai",
  Dikirim: "neutral",
  Diterima: "success",
  Selesai: "success",
  Dibatalkan: "warning",
};

export default function DashboardUmkmPage() {
  const store = UMKM_STORES[0];

  return (
    <DashboardShell role="umkm">
      <div className="space-y-10">
        <StoreAnalytics store={store} />
        <div id="sourcing">
          <B2BSourcingHub />
        </div>
        <OrderManagement />
        <div id="products">
          <B2CProductManager />
        </div>
        <div id="qr">
          <TraceabilityQrGenerator />
        </div>
      </div>
    </DashboardShell>
  );
}

function StoreAnalytics({ store }: { store: (typeof UMKM_STORES)[0] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-headline-md text-primary">{store.name}</h1>
        <Badge variant="success">
          <CheckCircle2 className="w-3 h-3" /> Halal &amp; BPOM
        </Badge>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs uppercase text-outline">Total Pendapatan</p>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{formatIDR(store.totalSales)}</p>
          <p className="text-xs text-[#1a7a3e] mt-1">↗ +12,4% dari bulan lalu</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <p className="text-xs uppercase text-outline">Pesanan Aktif</p>
          </div>
          <p className="font-display text-2xl font-bold text-primary">24</p>
          <p className="text-xs text-clay-earth mt-1">8 perlu dikirim segera</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-primary" />
            <p className="text-xs uppercase text-outline">Total Produk</p>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{store.totalProducts}</p>
          <p className="text-xs text-outline mt-1">Produk tren: Midnight Patchouli</p>
        </Card>
      </div>
      <Card className="p-6">
        <p className="font-semibold text-on-surface mb-1">Tren Penjualan 7 Hari Terakhir</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SALES_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e2dd" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#727973" }} />
            <YAxis tick={{ fontSize: 11, fill: "#727973" }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
            <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="sales" fill="#173124" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function B2BSourcingHub() {
  const [sortByPa, setSortByPa] = useState(false);
  const listings = sortByPa ? [...RAW_OIL_LISTINGS].sort((a, b) => b.coa.paLevel - a.coa.paLevel) : RAW_OIL_LISTINGS;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-headline-md text-primary">Sourcing Bahan Baku B2B</h2>
        <Button variant="secondary" size="sm" onClick={() => setSortByPa(!sortByPa)}>
          <Filter className="w-4 h-4" /> {sortByPa ? "Diurutkan: Kadar PA" : "Urutkan berdasarkan PA"}
        </Button>
      </div>
      <p className="text-sm text-on-surface-variant mb-5">
        Beli minyak atsiri premium langsung dari penyuling terverifikasi.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => {
          const farmer = FARMERS.find((f) => f.id === listing.farmerId);
          return (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant={listing.grade === "Premium" ? "ai" : "usk"}>
                    {listing.badges.includes("AI Verified") ? "AI Verified" : "USK Verified"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-outline mb-1">{farmer?.name} · {listing.region}</p>
                <p className="font-semibold text-on-surface text-sm mb-2 line-clamp-1">{listing.title}</p>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-mono font-semibold text-clay-earth">PA {listing.coa.paLevel}%</span>
                  <span className="text-outline">min. {listing.minOrderKg}kg</span>
                </div>
                <p className="font-display font-bold text-primary mb-3">
                  {formatIDR(listing.pricePerKg)} <span className="text-xs font-body font-normal text-outline">/kg</span>
                </p>
                <Button size="sm" className="w-full">
                  Pesan Sekarang
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OrderManagement() {
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Manajemen Pesanan</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-container-low text-xs uppercase text-outline">
            <tr>
              <th className="text-left px-5 py-3">ID Pesanan</th>
              <th className="text-left px-5 py-3">Pelanggan</th>
              <th className="text-left px-5 py-3">Produk</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Kurir</th>
              <th className="text-right px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.filter((o) => o.type !== "B2B").map((o) => (
              <tr key={o.id} className="border-t border-surface-container-high">
                <td className="px-5 py-4 font-mono text-xs text-primary">#{o.id}</td>
                <td className="px-5 py-4">{o.buyerName}</td>
                <td className="px-5 py-4">
                  {o.items[0].title} <span className="text-outline">×{o.items[0].qty}</span>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={STATUS_COLOR[o.status]}>{o.status}</Badge>
                </td>
                <td className="px-5 py-4 text-xs text-on-surface-variant flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> {o.courier}
                </td>
                <td className="px-5 py-4 text-right font-semibold">{formatIDR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function B2CProductManager() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Manajer Produk B2C</h2>
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <Card className="p-6">
          <p className="font-semibold text-on-surface mb-4">Unggah Produk Baru</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setTimeout(() => setSubmitted(false), 2500);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="prod-name">Nama Produk</Label>
              <Input id="prod-name" placeholder="Contoh: Seulawah Elixir EDP" required />
            </div>
            <div>
              <Label htmlFor="prod-cat">Kategori</Label>
              <Select id="prod-cat" defaultValue="Parfum">
                <option>Parfum</option>
                <option>Lilin Aromaterapi</option>
                <option>Sabun Nilam</option>
                <option>Diffuser</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="prod-price">Harga (Rp)</Label>
                <Input id="prod-price" type="number" placeholder="450000" required />
              </div>
              <div>
                <Label htmlFor="prod-stock">Stok</Label>
                <Input id="prod-stock" type="number" placeholder="24" required />
              </div>
            </div>
            <div>
              <Label htmlFor="prod-desc">Deskripsi</Label>
              <Textarea id="prod-desc" placeholder="Ceritakan kisah produk Anda..." />
            </div>
            <div>
              <SectionLabel>Sumber Bahan Baku</SectionLabel>
              <Select defaultValue={RAW_OIL_LISTINGS[0].id}>
                {RAW_OIL_LISTINGS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} (PA {r.coa.paLevel}%)
                  </option>
                ))}
              </Select>
              <p className="text-xs text-outline mt-1.5">Memilih sumber ini akan mengunci data traceability produk secara otomatis.</p>
            </div>
            <Button type="submit" className="w-full">
              {submitted ? "Produk Berhasil Diunggah!" : "Unggah ke Marketplace"}
            </Button>
          </form>
        </Card>

        <div>
          <p className="font-semibold text-on-surface mb-4">Produk Aktif</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {FINISHED_PRODUCTS.slice(0, 4).map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <div className="aspect-square">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-on-surface line-clamp-1 mb-1">{p.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-primary">{formatIDR(p.price)}</span>
                    <span className="text-xs text-outline">{p.stock} stok</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TraceabilityQrGenerator() {
  const product = FINISHED_PRODUCTS[0];
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Generator QR Traceability</h2>
      <Card className="p-6 grid lg:grid-cols-[1fr_2fr] gap-6 items-center">
        <div className="bg-bone-wash border border-sand-gray rounded-md p-6 flex items-center justify-center">
          <QrCode className="w-32 h-32 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-on-surface mb-1">{product.title}</p>
          <p className="text-xs font-mono text-outline mb-4">Batch ID: {product.qrBatchId}</p>
          <p className="text-sm text-on-surface-variant mb-4">
            QR ini mengunci seluruh cerita asal-usul minyak yang Anda beli sebelumnya — dari kebun Pak
            Syukur di Gayo hingga ke botol ini. Cetak dan tempelkan pada kemasan produk Anda.
          </p>
          <div className="flex gap-3">
            <Button size="sm">
              <Plus className="w-4 h-4" /> Buat QR untuk Produk Baru
            </Button>
            <Button variant="secondary" size="sm">
              Unduh PNG
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
