"use client";

import { useState, useEffect } from "react";
import { 
  QrCode, 
  Search, 
  ShoppingBag, 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowRight,
  DollarSign,
  Loader2,
  PackageCheck
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/mock";

export default function OrderIncomingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch pesanan dari database via API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seller/orders");
      const json = await res.json();
      
      const mappedOrders = (json.data || json || []).map((order: any) => ({
        id: order.id,
        buyerName: order.buyer_name || order.buyerName || "Pembeli Anonim",
        shippingAddress: order.shipping_address || order.shippingAddress || "Alamat tidak tersedia",
        status: (order.status || "pending").toLowerCase().replace(" ", "_"),
        paymentMethod: order.payment_method || order.paymentMethod || "Transfer / Escrow",
        createdAt: order.created_at || order.createdAt,
        total: Number(order.total || 0),
        items: (order.items || []).map((item: any) => ({
          title: item.title || item.product?.title || "Produk Minyak Nilam",
          price: Number(item.price || item.product?.price || 0),
          qty: Number(item.qty || item.quantity || 1),
          imageUrl: item.imageUrl || item.product?.imageUrl || "/images/products/default.jpg",
        }))
      }));

      setOrders(mappedOrders);
      if (mappedOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(mappedOrders[0]);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar pesanan:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter pencarian berdasarkan ID Pesanan atau Nama Pembeli
  const filteredOrders = orders.filter(order => {
    const orderId = order.id.toLowerCase();
    const buyer = (order.buyerName || "").toLowerCase();
    const search = searchQuery.toLowerCase();

    return orderId.includes(search) || buyer.includes(search);
  });

  // Memperbarui status pesanan ke database
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Fallback jika route spesifik ID tidak tersedia, coba route umum
        await fetch(`/api/seller/orders`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status: newStatus }),
        });
      }

      // Update state lokal secara responsif
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Gagal mengubah status pesanan:", err);
      alert("Gagal memperbarui status pesanan ke server.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "menunggu_pembayaran":
      case "pending":
        return <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Menunggu Aksi</span>;
      case "diproses":
      case "processing":
        return <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Siap Dikemas</span>;
      case "dikirim":
      case "shipped":
        return <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Dalam Pengiriman</span>;
      default:
        return <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
        
        {/* HEADER MODUL */}
        <div>
          <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">Pesanan Masuk</h1>
          <p className="text-xs text-stone-500 mt-1">
            Kelola dan penuhi pesanan produk turunan minyak nilam yang masuk dari pembeli retail marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* SISI KIRI: DAFTAR PESANAN MASUK */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-5 bg-white border border-stone-200 shadow-xs space-y-4 rounded-xl">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-700" /> Pipeline Pesanan ({filteredOrders.length})
                </h2>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />}
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari ID Pesanan atau nama pembeli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-stone-800"
                />
              </div>

              {/* LIST ITEMS */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="py-12 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
                    <span>Memuat data pesanan...</span>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <p className="text-xs text-center text-stone-400 py-8">Tidak ada pesanan masuk.</p>
                ) : (
                  filteredOrders.map((order: any) => {
                    const itemCount = order.items?.reduce((acc: number, item: any) => acc + item.qty, 0) || 1;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-3.5 border rounded-xl flex gap-4 cursor-pointer transition-all ${
                          selectedOrder?.id === order.id
                            ? "border-emerald-600 bg-emerald-50/20 shadow-xs"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg bg-stone-100 shrink-0 border border-stone-200 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-stone-400" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold text-stone-400">#{order.id}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <h3 className="text-xs font-bold text-stone-900 truncate">{order.buyerName}</h3>
                          
                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-[11px] text-stone-500 font-medium">
                              Jumlah Item: <strong className="text-stone-800">{itemCount} pcs</strong>
                            </span>
                            <span className="text-xs font-mono font-black text-stone-900">
                              {formatIDR(order.total || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* SISI KANAN: FULFILLMENT MANAGER PANEL */}
          <div className="md:col-span-5">
            <Card className="bg-stone-900 border border-stone-800 shadow-xl rounded-xl p-5 min-h-[460px] flex flex-col justify-between text-stone-200">
              
              {!selectedOrder ? (
                <div className="flex flex-col items-center justify-center text-center py-24 text-stone-500 my-auto">
                  <ShoppingBag className="w-12 h-12 text-stone-800 mb-3 stroke-[1.2]" />
                  <p className="text-xs font-bold text-stone-300">Pusat Pengiriman Pesanan</p>
                  <p className="text-[11px] text-stone-600 max-w-[260px] mt-1 leading-relaxed">
                    Pilih pesanan di panel sebelah kiri untuk melihat rincian pengiriman dan memproses paket.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 flex flex-col justify-between h-full flex-1">
                  
                  {/* DETAILS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        Manifest Pesanan
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        Pembayaran: {selectedOrder.paymentMethod}
                      </span>
                    </div>

                    {/* LOGISTICS DATA */}
                    <div className="bg-stone-950 border border-stone-800 p-3.5 rounded-lg space-y-2.5 text-xs font-mono">
                      <div className="flex gap-2">
                        <User className="w-4 h-4 text-stone-500 shrink-0" />
                        <div>
                          <p className="text-stone-500 text-[10px]">Penerima</p>
                          <p className="text-stone-200 font-bold">{selectedOrder.buyerName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                        <div>
                          <p className="text-stone-500 text-[10px]">Alamat Tujuan</p>
                          <p className="text-stone-300 leading-relaxed text-[11px]">{selectedOrder.shippingAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* PRODUCT SUMMARY LIST */}
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-stone-950/60 rounded-lg border border-stone-800/80 flex gap-3 items-center">
                            <div className="w-10 h-10 rounded bg-stone-800 shrink-0 border border-stone-700 flex items-center justify-center overflow-hidden">
                              <PackageCheck className="w-5 h-5 text-stone-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-stone-100 truncate">{item.title}</p>
                              <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                                {formatIDR(item.price)} Ã— {item.qty}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-stone-950/60 rounded-lg border border-stone-800 text-xs text-stone-400">
                          Rincian item tidak tersedia.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="pt-4 border-t border-stone-800 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Total Pesanan:
                      </span>
                      <span className="text-xl font-mono font-black text-emerald-400">
                        {formatIDR(selectedOrder.total)}
                      </span>
                    </div>

                    {/* DYNAMIC ACTION BUTTONS */}
                    <div className="space-y-2">
                      {(selectedOrder.status === "pending" || selectedOrder.status === "menunggu_pembayaran") && (
                        <Button
                          disabled={updating}
                          onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border-none"
                        >
                          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Terima Pesanan & Kemas Produk <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                      )}
                      {(selectedOrder.status === "processing" || selectedOrder.status === "diproses") && (
                        <Button
                          disabled={updating}
                          onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border-none"
                        >
                          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Serahkan ke Kurir / Kirim <Truck className="w-4 h-4" /></>}
                        </Button>
                      )}
                      {(selectedOrder.status === "shipped" || selectedOrder.status === "dikirim") && (
                        <div className="text-center p-2.5 bg-stone-950 border border-emerald-900/40 text-emerald-400 font-mono text-[11px] rounded-lg">
                          âœ“ Paket dalam perjalanan pengiriman kurir.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </Card>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
