"use client";

import { useState } from "react";
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
  DollarSign
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FINISHED_PRODUCTS } from "@/lib/mock/products";
import { formatIDR } from "@/lib/mock";

// Simulasi data pesanan masuk dari pembeli (Buyer) untuk produk jadi Seller
const MOCK_INCOMING_ORDERS = [
  {
    id: "ORD-2026-001",
    buyerName: "Rizky Ramadhan",
    shippingAddress: "Jl. T. Nyak Arief No. 24, Banda Aceh",
    productId: "fp-seulawah-elixir", // Mengarah ke Seulawah Elixir
    quantity: 2,
    status: "pending", // pending | processing | shipped
    paymentMethod: "Atsira Wallet",
    orderedAt: "2026-07-11T10:30:00+07:00"
  },
  {
    id: "ORD-2026-002",
    buyerName: "Siti Rahmah",
    shippingAddress: "Kopelma Darussalam, Syiah Kuala, Banda Aceh",
    productId: "fp-gayowood-musk", // Mengarah ke Gayowood Musk
    quantity: 1,
    status: "processing",
    paymentMethod: "Transfer Bank Direct",
    orderedAt: "2026-07-10T15:45:00+07:00"
  },
  {
    id: "ORD-2026-003",
    buyerName: "Budi Santoso",
    shippingAddress: "Menteng, Jakarta Pusat, DKI Jakarta",
    productId: "fp-nilam-diffuser", // Mengarah ke Diffuser Set
    quantity: 1,
    status: "shipped",
    paymentMethod: "QRIS",
    orderedAt: "2026-07-08T09:15:00+07:00"
  }
];

export default function OrderIncomingPage() {
  const [orders, setOrders] = useState(MOCK_INCOMING_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Pasangkan data pesanan dengan detail produk jadi dari products.ts
  const ordersWithDetails = orders.map(order => {
    const productDetail = FINISHED_PRODUCTS.find(p => p.id === order.productId);
    return {
      ...order,
      product: productDetail
    };
  });

  // Filter pencarian berdasarkan ID Pesanan, Nama Pembeli, atau Nama Produk
  const filteredOrders = ordersWithDetails.filter(order => {
    const orderId = order.id.toLowerCase();
    const buyer = order.buyerName.toLowerCase();
    const productTitle = order.product?.title?.toLowerCase() ?? "";
    const search = searchQuery.toLowerCase();

    return orderId.includes(search) || buyer.includes(search) || productTitle.includes(search);
  });

  // Fungsi untuk memperbarui status pesanan (Simulasi aksi seller)
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Awaiting Action</span>;
      case "processing":
        return <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Processing Pack</span>;
      case "shipped":
        return <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Dispatched</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardShell role="umkm">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
        
        {/* HEADER MODUL */}
        <div>
          <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">Order Incoming</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage and fulfill downstream finished product orders incoming from marketplace retail buyers.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* SISI KIRI: DAFTAR PESANAN MASUK */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-5 bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-700" /> Incoming Order Pipeline ({filteredOrders.length})
                </h2>
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, buyer name, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-stone-800"
                />
              </div>

              {/* LIST ITEMS */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredOrders.length === 0 ? (
                  <p className="text-xs text-center text-stone-400 py-8">No retail orders found.</p>
                ) : (
                  filteredOrders.map((order: any) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3.5 border rounded-xl flex gap-4 cursor-pointer transition-all ${
                        selectedOrder?.id === order.id
                          ? "border-emerald-600 bg-emerald-50/10 shadow-sm"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <img
                        src={order.product?.imageUrl}
                        alt={order.product?.title}
                        className="w-14 h-14 rounded-lg object-cover bg-stone-50 shrink-0 border border-stone-100"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-stone-400">{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <h3 className="text-xs font-bold text-stone-900 truncate">{order.product?.title}</h3>
                        
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-[11px] text-stone-500 font-medium">
                            Qty: <strong className="text-stone-800">{order.quantity} pcs</strong>
                          </span>
                          <span className="text-xs font-mono font-black text-stone-900">
                            {formatIDR((order.product?.price || 0) * order.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
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
                  <p className="text-xs font-bold text-stone-300">Order Dispatch Center</p>
                  <p className="text-[11px] text-stone-600 max-w-[260px] mt-1 leading-relaxed">
                    Please click on an incoming item pipeline from the left panel to review logistics and dispatch packages.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 flex flex-col justify-between h-full flex-1">
                  
                  {/* DETAILS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        Order Manifest
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        Method: {selectedOrder.paymentMethod}
                      </span>
                    </div>

                    {/* PILLED LOGISTICS DATA */}
                    <div className="bg-stone-950 border border-stone-850 p-3.5 rounded-lg space-y-2.5 text-xs font-mono">
                      <div className="flex gap-2"><User className="w-4 h-4 text-stone-500 shrink-0" /><div><p className="text-stone-500 text-[10px]">Recipient</p><p className="text-stone-200 font-bold">{selectedOrder.buyerName}</p></div></div>
                      <div className="flex gap-2"><MapPin className="w-4 h-4 text-stone-500 shrink-0" /><div><p className="text-stone-500 text-[10px]">Shipping Destination</p><p className="text-stone-300 leading-relaxed text-[11px]">{selectedOrder.shippingAddress}</p></div></div>
                    </div>

                    {/* PRODUCT SUMMARY */}
                    <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex gap-3">
                      <img src={selectedOrder.product?.imageUrl} className="w-10 h-10 rounded object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-100 truncate">{selectedOrder.product?.title}</p>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">{formatIDR(selectedOrder.product?.price || 0)} x {selectedOrder.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="pt-4 border-t border-stone-850 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Total Revenue:
                      </span>
                      <span className="text-xl font-mono font-black text-emerald-400">
                        {formatIDR((selectedOrder.product?.price || 0) * selectedOrder.quantity)}
                      </span>
                    </div>

                    {/* DYNAMIC ACTION BUTTONS */}
                    <div className="space-y-2">
                      {selectedOrder.status === "pending" && (
                        <Button
                          onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border-none"
                        >
                          Accept Order & Package Item <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                      {selectedOrder.status === "processing" && (
                        <Button
                          onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border-none"
                        >
                          Handover to Courier (Dispatch) <Truck className="w-4 h-4" />
                        </Button>
                      )}
                      {selectedOrder.status === "shipped" && (
                        <div className="text-center p-2 bg-stone-950 border border-emerald-900/30 text-emerald-400 font-mono text-[11px] rounded-lg">
                          ✓ This shipment has left the warehouse facility.
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