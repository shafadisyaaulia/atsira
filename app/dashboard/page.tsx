"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store";
import { Package, Truck, CheckCircle2, Clock, Search, Send, RefreshCw } from "lucide-react";

interface OrderItem {
  id: string;
  product_title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_number?: string;
  shipping_address?: string;
  items: OrderItem[];
}

export default function SellerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch Order Data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/orders?status=${activeTab}&sellerId=${user?.id || ""}`);
      const result = await res.json();
      if (result.data) {
        setOrders(result.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Handle Update Resi / Status Pesanan
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const trackingNumber = trackingInputs[orderId];
      const res = await fetch("/api/seller/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingNumber,
        }),
      });

      if (res.ok) {
        alert("Status pesanan berhasil diperbarui!");
        fetchOrders();
      } else {
        alert("Gagal memperbarui status pesanan.");
      }
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <PageShell>
      <div className="container-app py-8 max-w-6xl mx-auto px-4">
        {/* Header Dashboard Seller */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-primary">
              Dashboard Seller & UMKM
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Kelola pesanan masuk, pemrosesan resi, dan pengiriman produk hasil olahan Nilam.
            </p>
          </div>
          <Button
            onClick={fetchOrders}
            className="bg-surface-container-high hover:bg-surface-container text-primary font-bold text-xs px-4 py-2 rounded-xl border-0 flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
          </Button>
        </div>

        {/* Tab Filter Status */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-surface-container-high mb-6">
          {[
            { id: "all", label: "Semua Pesanan" },
            { id: "processing", label: "Perlu Diproses" },
            { id: "shipped", label: "Dikirim" },
            { id: "delivered", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar Pesanan */}
        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-outline">
            Memuat pesanan masuk...
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center border border-dashed border-surface-container-high bg-white rounded-2xl">
            <Package className="w-12 h-12 text-outline mx-auto mb-3" />
            <p className="text-sm font-bold text-primary">Belum Ada Pesanan Masuk</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Pesanan dari pembeli akan muncul secara otomatis di panel ini.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-5 border border-surface-container-high bg-white rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-outline tracking-wider">
                      ID ORDER: #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Tanggal: {new Date(order.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-700" />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-primary">
                        {item.product_title} <span className="text-outline">x{item.quantity}</span>
                      </span>
                      <span className="font-bold text-primary">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking & Control Action */}
                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] font-extrabold uppercase text-outline block mb-1">
                      Nomor Resi Pengiriman
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan No. Resi (Contoh: JNE12345)"
                      value={trackingInputs[order.id] ?? order.tracking_number ?? ""}
                      onChange={(e) =>
                        setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border border-surface-container-high rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      onClick={() => handleUpdateStatus(order.id, "Dikirim")}
                      disabled={updatingId === order.id}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl border-0 flex items-center gap-1.5 w-full sm:w-auto"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {updatingId === order.id ? "Menyimpan..." : "Kirim Resi & Update Status"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}