"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuthStore } from "@/lib/store";
import { useArcStore, usePemastaStore } from "@/lib/store";
import { 
  ArrowUpRight,
  LayoutDashboard, 
  TrendingUp,
  AlertCircle,
  Package,
  Wallet,
  Clock,
  Sparkles,
  CheckCircle,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import PriceTrendChart from "@/components/shared/PriceTrendChart";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import CoAPDFButton from "@/components/shared/CoAPDFButton";



const formatIDR = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function SellerDashboardPage() {
  const supabase = createSupabaseBrowserClient();
  const [timeRange, setTimeRange] = useState("30-days");
  const { user } = useAuthStore();
  const isPetani = user?.role === "petani";
  
  // REAL DATA STATES
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalProduk, setTotalProduk] = useState(0);
  const [pesananBaru, setPesananBaru] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchDashboardData = async () => {
      // Fetch Products
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user.id);
      
      setTotalProduk(products?.length || 0);

      // Fetch Orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
        
      if (orders) {
        // Hitung pendapatan (hanya status Selesai atau setidaknya diproses, bukan dibatalkan)
        const income = orders
          .filter(o => o.status !== "Dibatalkan")
          .reduce((acc, curr) => acc + Number(curr.total || 0), 0);
        setTotalPendapatan(income);
        
        // Hitung pesanan baru
        const newOrds = orders.filter(o => o.status === "Menunggu Pembayaran");
        setPesananBaru(newOrds.length);
        
        // 3 pesanan terbaru
        setRecentOrders(orders.slice(0, 3));
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const STATS_DATA = [
    {
      title: "Total Pendapatan (Sepanjang Waktu)",
      value: totalPendapatan,
      isPositive: true,
      subtext: "Berdasarkan pesanan berhasil",
      icon: Wallet,
      iconColor: "bg-amber-100 text-amber-700",
    },
    {
      title: "Produk Live di Etalase",
      value: totalProduk,
      isPositive: true,
      subtext: "Produk yang Anda jual",
      icon: Package,
      iconColor: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Pesanan Masuk Baru",
      value: pesananBaru,
      isPositive: pesananBaru === 0,
      subtext: pesananBaru > 0 ? "Memerlukan pengiriman segera" : "Semua pesanan sudah diproses",
      icon: Clock,
      iconColor: "bg-orange-100 text-orange-700",
    },
  ];
  const { queue, coas } = useArcStore();
  const { marketPrices } = usePemastaStore();
  const latestPrice = marketPrices[0];
  
  const myRequests = queue.filter(q => q.farmerId === (user?.id || "petani-1"));
  const myCoas = coas.filter(c => c.farmer_name.includes(user?.name) || myRequests.some(q => q.id === c.batch_id));

  const handleAjukan = () => {
    window.location.href = "/dashboard/seller/produk";
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-12">
        
        {/* ROW HEADER & FILTER WAKTU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-sm">
          <div>
            <h1 className="font-display text-headline-sm text-primary font-black tracking-tight flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-emerald-700" /> Ringkasan Performa Seller
            </h1>
            <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
              Pantau perkembangan penjualan produk hilir aromaterapi dan komoditas minyak mentah hasil mitra kelompok tani Anda.
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

        <div className="grid md:grid-cols-12 gap-6">
          
          {marketPrices.length >= 2 && <PriceTrendChart />}

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
                {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">Belum ada pesanan terbaru.</div>
              ) : recentOrders.map((order) => (
                  <div key={order.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                          {order.id}
                        </span>
                        <p className="font-bold text-primary">{order.buyer_name || "Pembeli"}</p>
                      </div>
                      <p className="text-stone-600 text-[11px]">{order.id}</p>
                      <p className="text-stone-400 text-[10px]">{new Date(order.created_at).toLocaleDateString("id-ID", {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                      <p className="font-mono font-black text-primary text-sm">{formatIDR(Number(order.total || 0))}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${(order.status === "pending" || order.status === "Menunggu Pembayaran" ? "text-amber-700 border-amber-200 bg-amber-50" : order.status === "completed" || order.status === "Selesai" ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-blue-700 border-blue-200 bg-blue-50")}`}>
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
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> KECERDASAN ATBOT AI
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black">
                    AKTIF
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="text-stone-300">
                    Sistem Anda telah terhubung penuh dengan modul <strong className="text-white font-black">QualitySense v2.9</strong>.
                  </p>
                  
                  {isPetani && latestPrice ? (
                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30 space-y-2 animate-pulse">
                      <div className="flex gap-2 items-start text-[11px]">
                        <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-400 mb-1">Perubahan Harga Pemasta!</p>
                          <p className="text-stone-300 text-[10px] leading-relaxed">
                            Harga base nilam per <strong>{latestPrice.date}</strong> dari {latestPrice.region} telah diperbarui ke 
                            <strong className="text-white bg-stone-700 px-1 py-0.5 rounded ml-1">Rp {Number(latestPrice.pricePerKg).toLocaleString("id-ID")}/Kg</strong>.
                          </p>
                          <p className="text-amber-200/70 text-[9px] mt-1.5 italic">
                            Segera sesuaikan etalase minyak mentah Anda agar tidak merugi.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-stone-900 p-3 rounded-lg border border-stone-700 space-y-2">
                      <div className="flex gap-2 items-start text-[11px]">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-300">Harga Stabil</p>
                          <p className="text-stone-400 text-[10px]">Belum ada update harga terbaru dari Pemasta di region Anda.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-700 space-y-2">
                    <div className="flex gap-2 items-start text-[11px]">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-300">Skrining Visual AI</p>
                        <p className="text-stone-400 text-[10px]">Tips peningkatan mutu fisik akan diberikan secara personal tiap Anda menguji sampel.</p>
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
                    Uji Kualitas (AI)
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/dashboard/seller/produk"} 
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[11px] py-2 rounded shadow-sm relative"
                  >
                    {isPetani && latestPrice && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    )}
                    {isPetani && latestPrice && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    )}
                    Update Harga
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
