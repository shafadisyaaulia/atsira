"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Coins, 
  ArrowUpRight, 
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/mock";
import { useArcStore, useAuthStore } from "@/lib/store";
import CoAPDFButton from "@/components/shared/CoAPDFButton";

// Mock data statistik untuk simulasi dashboard seller
const STATS_DATA = [
  {
    title: "Estimasi Nilai Panen",
    value: 15200000,
    subtext: "+45.5% dari bulan lalu",
    isPositive: true,
    icon: Coins,
    iconColor: "text-amber-600 bg-amber-50"
  },
  {
    title: "Stok Minyak Mentah (Kg)",
    value: 45,
    subtext: "Tersedia di gudang",
    isPositive: true,
    icon: Package,
    iconColor: "text-emerald-700 bg-emerald-50"
  },
  {
    title: "Permintaan B2B",
    value: 5,
    subtext: "Dari UMKM/Buyer",
    isPositive: false,
    icon: ShoppingBag,
    iconColor: "text-amber-700 bg-amber-50"
  },
];

// Mock data aktivitas transaksi pesanan terbaru
const RECENT_ORDERS = [
  {
    id: "TRX-9821",
    customer: "Atsiri Mandiri Utama",
    product: "Minyak Nilam Murni Gayo (Raw Oil)",
    amount: 13500000,
    date: "Hari ini, 14:20 WIB",
    status: "Perlu Dikirim",
    statusColor: "bg-amber-100 text-amber-900 border-amber-300"
  },
  {
    id: "TRX-9754",
    customer: "Rania Fragrance Jakarta",
    product: "Atsira Luxury EDP Perfume - 5 Pcs",
    amount: 1725000,
    date: "Kemarin, 09:15 WIB",
    status: "Selesai",
    statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300"
  },
  {
    id: "TRX-9611",
    customer: "Koperasi Nilam Aceh Barat",
    product: "Minyak Nilam Mentah Lhoong",
    amount: 6000000,
    date: "08 Juli 2026",
    status: "Selesai",
    statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300"
  }
];

export default function PetaniDashboardPage() {
  const [timeRange, setTimeRange] = useState("30-days");
  const { user } = useAuthStore();
  const { queue, addRequest, coas } = useArcStore();
  
  // Filter queue untuk petani yang sedang login
  const myRequests = queue.filter(q => q.farmerId === (user?.id || "petani-1"));
  const myCoas = coas.filter(c => c.farmer_name.includes(user?.name) || myRequests.some(q => q.id === c.batch_id));

  const handleAjukan = () => {
    addRequest({
      nodeName: user?.name || "Petani Nilam",
      region: "Aceh",
      farmerId: user?.id || "petani-1"
    });
    alert("Berhasil mengajukan sertifikasi lab ARC-USK.");
  };

  return (
    <DashboardShell role="petani">
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-45">
        
        {/* ROW HEADER & FILTER WAKTU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-sm">
          <div>
            <h1 className="font-display text-headline-sm text-primary font-black tracking-tight flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-emerald-700" /> Dashboard Petani Nilam
            </h1>
            <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
              Pantau hasil panen, proses penyulingan, dan sertifikasi ARC Anda.
            </p>
          </div>
          
          <div className="w-full sm:w-auto">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full sm:w-44 border border-emerald-200 bg-stone-50 rounded-md text-xs p-2 outline-none h-9 font-medium text-emerald-900"
            >
              <option value="7-days">7 Hari Terakhir</option>
              <option value="30-days">30 Hari Terakhir</option>
              <option value="this-month">Bulan Berjalan</option>
            </select>
          </div>
        </div>

        {/* ROW STATISTIK UTAMA (CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS_DATA.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="p-5 bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-stone-500 max-w-[80%] leading-snug">{stat.title}</span>
                  <div className={`p-2 rounded-lg ${stat.iconColor} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-mono font-black text-primary">
                    {typeof stat.value === "number" && stat.title.includes("Pendapatan") 
                      ? formatIDR(stat.value) 
                      : stat.value}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[11px]">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 font-bold" />
                    )}
                    <span className={stat.isPositive ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
                      {stat.subtext}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-5 bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Sertifikasi ARC-USK
            </h3>
            <Button onClick={handleAjukan} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 px-4 h-auto rounded-lg shadow-sm">
              Ajukan Pengujian Lab
            </Button>
          </div>
          
          {myRequests.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-stone-200 rounded-xl bg-stone-50">
              <p className="text-xs text-stone-500 font-medium">Belum ada pengajuan sampel ke lab ARC.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => {
                const coaMatch = myCoas.find(c => c.batch_id === req.id);
                return (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-stone-200 rounded-xl bg-white shadow-sm gap-3 hover:border-emerald-200 transition-colors">
                    <div>
                      <p className="text-sm font-black text-stone-900">{req.id}</p>
                      <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Tanggal Masuk: {req.date}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm border ${
                        req.status === "Terverifikasi" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        req.status === "Dalam Pengujian" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {req.status}
                      </span>
                      {coaMatch && (
                        <CoAPDFButton data={coaMatch} variant="button" className="text-[10px] h-7 px-3 py-0 rounded-md" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="grid md:grid-cols-45 gap-6">
          
          {/* PANEL KIRI: DAFTAR TRANSAKSI PESANAN TERBARU */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-5 bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Transaksi & Pesanan Masuk
                </h2>
                <span className="text-[11px] text-emerald-700 font-medium underline cursor-pointer hover:text-emerald-800">Lihat Semua</span>
              </div>

              <div className="divide-y divide-stone-100">
                {RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                          {order.id}
                        </span>
                        <p className="font-bold text-primary">{order.customer}</p>
                      </div>
                      <p className="text-stone-600 text-[11px]">{order.product}</p>
                      <p className="text-stone-400 text-[10px]">{order.date}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                      <p className="font-mono font-black text-primary text-sm">{formatIDR(order.amount)}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* PANEL KANAN: NOTIFIKASI INTEGRASI & AKSI CEPAT ATBOT */}
          <div className="md:col-span-5">
            <Card className="p-5 bg-stone-800 text-stone-100 border-t-4 border-amber-500 shadow-md h-full flex flex-col justify-between min-h-[340px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> INTEGRASI ATBOT AI
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black">
                    AKTIF
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="text-stone-300">
                    Sistem Anda telah terhubung penuh dengan modul **QualitySense v2.9**. 
                  </p>
                  
                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-700 space-y-2">
                    <div className="flex gap-2 items-start text-[11px]">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-300">Skrining Visual Aman</p>
                        <p className="text-stone-400 text-[10px]">Stok minyak nilam curah Anda sudah divalidasi bebas endapan besi karat.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-700 space-y-2">
                    <div className="flex gap-2 items-start text-[11px]">
                      <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-300">Margin Harga Stabil</p>
                        <p className="text-stone-400 text-[10px]">Rata-rata harga jual komoditas Anda berada 4% di atas benchmark harian lokal.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-700">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => window.location.href = "/dashboard/seller/qualitysense"} 
                    className="bg-stone-700 hover:bg-stone-600 text-white font-bold text-[11px] py-2 rounded shadow-sm"
                  >
                    Uji Sampel Baru
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/dashboard/seller/produk"} 
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[11px] py-2 rounded shadow-sm"
                  >
                    Update Etalase
                  </Button>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
