"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  FileText,
  Building,
  MapPin,
  Calendar,
  Phone,
  ArrowRight
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// DATA TRANSAKSI PESANAN BUYER
const BUYER_ORDERS = [
  {
    id: "PSN-2026-001",
    sellerName: "Kelompok Tani Nilam Gayo Mandiri",
    date: "12 Jul 2026",
    productName: "Minyak Nilam Murni (Crude Patchouli Oil) - Kelas A",
    quantity: "150 Kg",
    totalPrice: 82500000,
    status: "dikirim",
    shippingCourier: "Kurir Internal ATSIRA (Resi: ATSR-GAYO01)",
    location: "Takengon, Aceh Tengah",
    paymentMethod: "Bank Transfer (BCA Virtual Account)",
    notes: "Harap pastikan segel jerigen terlindungi dengan bubble wrap ekstra."
  },
  {
    id: "PSN-2026-002",
    sellerName: "UMKM Atsiri Wangi Banda",
    date: "10 Jul 2026",
    productName: "Parfum Nilam Premium Royal Wood 30ml",
    quantity: "100 Botol",
    totalPrice: 15000000,
    status: "selesai",
    shippingCourier: "Sicepat Kargo (Resi: SIG9918221)",
    location: "Banda Aceh",
    paymentMethod: "Visa Corporate Card",
    notes: "Kemasan dus luar mohon dilapisi plastik tahan air."
  },
  {
    id: "PSN-2026-003",
    sellerName: "Koperasi Sulingan Jaya Blangkejeren",
    date: "28 Jun 2026",
    productName: "Minyak Nilam Mentah Murni Curah",
    quantity: "50 Kg",
    totalPrice: 18500000,
    status: "diproses",
    shippingCourier: "Menunggu Penjemputan Armada Logistik B2B",
    location: "Gayo Lues",
    paymentMethod: "Mandiri MCM Auto-Settlement",
    notes: "Pengecekan kualitas lab gelombang kedua dijadwalkan besok pagi."
  }
];

export default function BuyerPesananPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // STATE DETAIL: Menyimpan data pesanan yang diklik untuk masuk ke halaman detail penuh
  const [activeDetailOrder, setActiveDetailOrder] = useState<any>(null);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Uji Mutu Lab
          </span>
        );
      case "dikirim":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" /> Dalam Pengiriman
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Pesanan Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-50 text-stone-600 border border-stone-200">
            <XCircle className="w-3 h-3" /> Dibatalkan
          </span>
        );
    }
  };

  const filteredOrders = BUYER_ORDERS.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ─── TAMPILAN 1: DETAILS FULL PAGE (JIKA TOMBOL DETAIL DIKLIK) ───
  if (activeDetailOrder) {
    return (
      <DashboardShell role="buyer">
        <div className="max-w-4xl mx-auto w-full pb-16 pt-2 animate-in fade-in duration-200">
          
          <button 
            onClick={() => setActiveDetailOrder(null)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold text-sm mb-6 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg transition-colors border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Kembali ke Daftar Pesanan
          </button>

          <Card className="bg-white border border-stone-200 shadow-md rounded-xl p-8 space-y-6">
            
            <div className="border-b border-stone-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-stone-100 border rounded text-stone-500">
                  Dokumen Kontrak Pengadaan Digital
                </span>
                <h1 className="text-xl font-extrabold text-stone-900 tracking-tight mt-1">
                  ID Pesanan: {activeDetailOrder.id}
                </h1>
                <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Transaksi dibuat pada {activeDetailOrder.date}
                </p>
              </div>
              <div className="self-start sm:self-auto">
                {renderStatusBadge(activeDetailOrder.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h3 className="font-extrabold text-stone-400 text-xs uppercase tracking-wider">Pihak Penjual (Produsen)</h3>
                <div className="space-y-2">
                  <p className="font-black text-stone-900 flex items-center gap-1.5 text-sm">
                    <Building className="w-4 h-4 text-emerald-800" />
                    {activeDetailOrder.sellerName}
                  </p>
                  <p className="text-xs text-stone-600 flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>Gudang Pengambilan:<br /><strong>{activeDetailOrder.location}</strong></span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h3 className="font-extrabold text-stone-400 text-xs uppercase tracking-wider">Metode & Pengiriman</h3>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <p>Metode Bayar: <strong className="text-stone-900">{activeDetailOrder.paymentMethod}</strong></p>
                  <p className="pt-1 border-t border-stone-200/60 mt-1">
                    Pelacakan Logistik: <strong className="text-stone-900">{activeDetailOrder.shippingCourier}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 text-xs font-bold text-stone-600 grid grid-cols-3">
                <span className="col-span-2">Deskripsi Komoditas</span>
                <span className="text-right">Kuantitas</span>
              </div>
              <div className="p-4 grid grid-cols-3 items-center text-sm border-b border-stone-100">
                <div className="col-span-2 space-y-0.5">
                  <p className="font-bold text-stone-900">{activeDetailOrder.productName}</p>
                  <p className="text-xs text-stone-400">Mutu Terverifikasi Sistem Atsira AI</p>
                </div>
                <span className="text-right font-black text-stone-900">{activeDetailOrder.quantity}</span>
              </div>
              <div className="p-4 bg-stone-50/50 flex justify-between items-center text-sm">
                <span className="font-bold text-stone-700">Total Nilai Pesanan (Lunas):</span>
                <span className="font-black text-emerald-800 text-base">{formatIDR(activeDetailOrder.totalPrice)}</span>
              </div>
            </div>

            {activeDetailOrder.notes && (
              <div className="p-4 bg-amber-50/40 border border-amber-200/70 rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-900">Catatan Tambahan Pengadaan:</p>
                <p className="text-stone-600 italic">"{activeDetailOrder.notes}"</p>
              </div>
            )}

            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setActiveDetailOrder(null)} 
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 px-4 rounded-xl text-xs border border-stone-300 transition-colors order-2 sm:order-1"
              >
                Kembali ke Daftar
              </button>
              <Button 
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs border-none shadow-md flex items-center justify-center gap-1.5 transition-colors order-1 sm:order-2 h-11"
              >
                <Phone className="w-4 h-4" /> Hubungi Pihak Penjual / Koperasi
              </Button>
            </div>

          </Card>
        </div>
      </DashboardShell>
    );
  }

  // ─── TAMPILAN 2: HALAMAN UTAMA DAFTAR PESANAN ───
  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12 animate-in fade-in duration-200">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">Daftar Pesanan & Pengadaan</h1>
            <p className="text-xs text-stone-500 mt-1">
              Pantau status pengiriman logistik, uji lab, dan rincian transaksi pembelian komoditas minyak atsiri Anda.
            </p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button className="bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 shadow-sm rounded-lg flex items-center gap-1.5 py-2 px-3">
              <FileText className="w-4 h-4 text-stone-500" /> Unduh Rekap CSV
            </Button>
          </div>
        </div>

        <Card className="p-4 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap bg-stone-100 p-1 rounded-lg text-xs font-bold w-full md:w-auto">
              <button onClick={() => setStatusFilter("all")} className={`px-4 py-1.5 rounded-md transition-all ${statusFilter === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                Semua Pesanan
              </button>
              <button onClick={() => setStatusFilter("diproses")} className={`px-4 py-1.5 rounded-md transition-all ${statusFilter === "diproses" ? "bg-white text-amber-700 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                Uji Mutu
              </button>
              <button onClick={() => setStatusFilter("dikirim")} className={`px-4 py-1.5 rounded-md transition-all ${statusFilter === "dikirim" ? "bg-white text-blue-700 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                Dikirim
              </button>
              <button onClick={() => setStatusFilter("selesai")} className={`px-4 py-1.5 rounded-md transition-all ${statusFilter === "selesai" ? "bg-white text-emerald-700 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                Selesai
              </button>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                placeholder="Cari ID Pesanan atau Produsen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-stone-800"
              />
            </div>
          </div>
        </Card>

        {filteredOrders.length === 0 ? (
          <Card className="p-12 border border-dashed border-stone-300 text-center text-stone-500 bg-stone-50/50 rounded-xl">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-700">Belum Ada Transaksi</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Pesanan dengan status ini tidak ditemukan.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden p-5 hover:border-stone-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {order.id}
                    </span>
                    <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {order.date}
                    </div>
                    {renderStatusBadge(order.status)}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-emerald-800" />
                      {order.sellerName}
                    </h3>
                    <p className="text-xs font-bold text-stone-700">{order.productName}</p>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      Lokasi Gudang: {order.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between md:text-right items-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <div>
                    <p className="text-[11px] text-stone-400 font-medium">Volume & Nilai Kontrak</p>
                    <p className="text-xs font-extrabold text-stone-800">
                      {order.quantity} <span className="text-[11px] text-stone-400 font-normal">({formatIDR(order.totalPrice)})</span>
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveDetailOrder(order)}
                    className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold text-xs py-2 px-3.5 rounded-lg shadow-sm transition-colors group"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" /> 
                    <span>Detail Pesanan</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardShell>
  );
}