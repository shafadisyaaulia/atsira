"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Package, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BuyerDashboardPage() {
  // Mock data ringkasan pengadaan buyer
  const stats = [
    {
      label: "Total Pengadaan (Tahun Ini)",
      value: "Rp 427.500.000",
      change: "+12.5%",
      isPositive: true,
      icon: Wallet,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50/60",
    },
    {
      label: "Kontrak Berjalan",
      value: "3 Kontrak",
      change: "2 Mitra Tani",
      isPositive: true,
      icon: Package,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/60",
    },
    {
      label: "Volume Total Atsiri",
      value: "750 Kg",
      change: "+150 Kg bulan ini",
      isPositive: true,
      icon: Layers,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/60",
    },
  ];

  // Mock data aktivitas pasokan terbaru
  const recentActivities = [
    {
      id: "ACT-001",
      title: "Batch Pengiriman Minyak Nilam Gayo A",
      description: "Manifes manifes kurir diperbarui: J&T Cargo - Sampai di Medan Hub.",
      time: "2 jam yang lalu",
      status: "shipping",
      icon: Clock,
      color: "text-purple-600 bg-purple-50"
    },
    {
      id: "ACT-002",
      title: "Kontrak Pembelian Baru Disetujui",
      description: "Koperasi Sulingan Jaya Blangkejeren telah menandatangani kontrak 500 Kg.",
      time: "1 hari yang lalu",
      status: "success",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: "ACT-003",
      title: "Tagihan Invoice Menunggu Pembayaran",
      description: "UMKM Atsiri Wangi Banda menerbitkan invoice Termin 14 Hari untuk 100 Botol Parfum.",
      time: "2 hari yang lalu",
      status: "pending",
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12 animate-in fade-in duration-200">
        
        {/* WELCOME SECTION BANNER */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-800" /> Premium Corporate Buyer
            </div>
            <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">
              Ringkasan Operasional & Pengadaan
            </h1>
            <p className="text-xs text-stone-500">
              Pantau kestabilan supply chain, harga pasar komoditas atsiri, dan validitas kontrak dokumen Anda.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg py-2 px-4 shadow-sm transition-colors border-none">
              Eksplor Komoditas Baru
            </Button>
          </div>
        </div>

        {/* STATS KARTU UTAMA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="p-5 bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-stone-900 tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {stat.isPositive ? (
                    <span className="flex items-center text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stat.change}
                    </span>
                  ) : (
                    <span className="flex items-center text-red-700 bg-red-50 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      <ArrowDownRight className="w-3 h-3 mr-0.5" /> {stat.change}
                    </span>
                  )}
                  <span className="text-stone-400 font-medium text-[11px]">vs kuartal lalu</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* DUA KOLOM: INTELIJEN HARGA & AKTIVITAS PASOKAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI (LEBAR 2x): MONITOR INTELIJEN HARGA ATSIRI */}
          <Card className="p-6 bg-white border border-stone-200 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" /> Indeks Harga Atsiri Terkini (ARC-USK)
                </h2>
                <p className="text-[11px] text-stone-400 mt-0.5">Update mingguan referensi harga komoditas utama asli Aceh.</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border">
                Live Data
              </span>
            </div>

            {/* BAR COMPONENT UNTUK TREN HARGA (MOCKUP VISUAL YANG BERSIH) */}
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Minyak Nilam Murni (Patchouli Oil) - PA Min 30%</span>
                  <span className="text-stone-900">Rp 1.250.000 / Kg</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-700 h-2 rounded-full w-[85%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Minyak Pala Grade Ekspor (Nutmeg Oil)</span>
                  <span className="text-stone-900">Rp 850.000 / Kg</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full w-[60%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Minyak Sereh Wangi Super (Citronella Oil)</span>
                  <span className="text-stone-900">Rp 320.000 / Kg</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-stone-400 h-2 rounded-full w-[40%]" />
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-[11px] text-stone-500 mt-2">
              💡 <strong>Rekomendasi Pengadaan:</strong> Harga Minyak Nilam cenderung naik tipis 2% minggu depan karena tingginya permintaan ekspor kosmetik Prancis. Disarankan melakukan *lock-contract* kuota pengadaan sekarang.
            </div>
          </Card>

          {/* KOLOM KANAN (LEBAR 1x): AKTIVITAS LOGISTIK & SUPPLY CHAIN */}
          <Card className="p-6 bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-stone-500" /> Logistik Terbaru
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Timeline pergerakan supply chain pengadaan Anda.</p>
            </div>

            <div className="space-y-4 pt-1">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex gap-3 items-start text-xs">
                    <div className={`p-2 rounded-lg shrink-0 ${act.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-stone-900">{act.title}</h4>
                      <p className="text-stone-500 text-[11px] leading-relaxed">{act.description}</p>
                      <span className="text-[10px] text-stone-400 block pt-0.5">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

        </div>

      </div>
    </DashboardShell>
  );
}