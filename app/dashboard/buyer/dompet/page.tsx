"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Building, 
  ArrowRight, 
  CreditCard,
  Lock,
  CheckCircle2,
  Building2,
  Wallet,
  Clock,
  Download,
  Loader2,
  AlertCircle
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";

export default function BuyerWalletPage() {
  const [buyerPersona, setBuyerPersona] = useState<"nasional" | "internasional">("nasional");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<string | null>(null);

  // Form States
  const [selectedBank, setSelectedBank] = useState("BCA");

  // FETCH DATA DARI API REAL /api/buyer/orders
  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/buyer/orders");
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengambil data tagihan");
      }

      setOrders(result.data || []);
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // AGREGASI STATISTIK SUPABASE
  const totalUnpaidIDR = orders
    .filter((o) => o.status === "Menunggu Pembayaran")
    .reduce((acc, curr) => acc + Number(curr.total || 0), 0);

  const totalPaidIDR = orders
    .filter((o) => o.status !== "Menunggu Pembayaran" && o.status !== "Dibatalkan")
    .reduce((acc, curr) => acc + Number(curr.total || 0), 0);

  const formatCurrency = (amountIDR: number) => {
    if (buyerPersona === "internasional") {
      const amountUSD = Math.round(amountIDR / 15500);
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amountUSD);
    }
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amountIDR);
  };

  // HANDLER INTEGRASI STRIPE & MIDTRANS
  const handlePaymentSubmit = async (e: React.FormEvent, order: any) => {
    e.preventDefault();
    setLoadingId(order.id);
    
    try {
      if (buyerPersona === "internasional") {
        // Panggil /api/payments/create-session (Stripe Gateway)
        const payload = {
          orderId: order.id,
          buyerEmail: order.buyer_email || "buyer@atsira.id",
          buyerName: order.buyer_name || "Pembeli atSira",
          items: order.items && order.items.length > 0 
            ? order.items.map((i: any) => ({
                title: i.title || "Minyak Atsiri",
                price: Number(i.price || 0),
                qty: Number(i.qty || 1),
                unit: i.unit || "kg"
              }))
            : [{ title: "Kontrak Essential Oil", price: Number(order.total || 0), qty: 1, unit: "lot" }],
          subtotal: Number(order.subtotal || order.total || 0),
          shippingFee: Number(order.shipping_fee || 0),
          tax: Number(order.tax || 0),
          total: Number(order.total || 0),
          currency: "IDR",
          isInternational: true
        };

        const res = await fetch("/api/payments/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal membuat sesi Stripe");

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          alert("Sesi Stripe dibuat, namun URL pembayaran tidak ditemukan.");
        }
      } else {
        const payload = {
          orderId: order.id,
          total: Number(order.total || 0),
          buyerName: order.buyer_name || "Pembeli atSira",
          bank: selectedBank
        };
        const res = await fetch("/api/payments/create-midtrans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal menghubungkan ke Midtrans");
        
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          alert("Sesi Midtrans dibuat, namun URL pembayaran tidak ditemukan.");
        }
      }
    } catch (err: any) {
      alert(`Gagal memproses pembayaran: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12 animate-in fade-in duration-200">
        
        {/* CONTROL PANEL SWITCHER */}
        <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-emerald-900">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">atSira Clearing & Payment Gateway</p>
            </div>
            <p className="text-[11px] text-emerald-200/70">Pilih profil rute pembayaran untuk Midtrans (VA Domestik) atau Stripe (Visa Global).</p>
          </div>
          
          <div className="flex bg-emerald-900/60 p-1 rounded-lg border border-emerald-800 self-stretch sm:self-auto">
            <button 
              type="button"
              onClick={() => { setBuyerPersona("nasional"); setActiveInvoice(null); }} 
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all ${buyerPersona === "nasional" ? "bg-white text-stone-900 shadow" : "text-emerald-300 hover:text-white"}`}
            >
              🇮🇩 Midtrans VA
            </button>
            <button 
              type="button"
              onClick={() => { setBuyerPersona("internasional"); setActiveInvoice(null); }} 
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all ${buyerPersona === "internasional" ? "bg-white text-stone-900 shadow" : "text-emerald-300 hover:text-white"}`}
            >
              🌐 Stripe Visa
            </button>
          </div>
        </div>

        {/* STATISTIK WALLET SUPABASE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase">Tagihan Belum Dibayar</p>
              <p className="text-lg font-black text-stone-900">
                {formatCurrency(totalUnpaidIDR)}
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase">Saldo Escrow Atsira</p>
              <p className="text-lg font-black text-emerald-800">
                {formatCurrency(totalPaidIDR)}
              </p>
            </div>
          </Card>
        </div>

        {/* TITLE */}
        <div>
          <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">
            {buyerPersona === "nasional" ? "Invoice Pengadaan Domestik" : "International Logistics Invoices"}
          </h1>
        </div>

        {/* CONDITION STATE */}
        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-stone-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
            <span>Memuat tagihan dari database Supabase...</span>
          </div>
        ) : error ? (
          <Card className="p-6 border border-red-200 bg-red-50 text-red-700 flex items-center gap-3 rounded-xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 border border-dashed border-stone-300 text-center text-stone-500 bg-stone-50/50 rounded-xl">
            <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-700">Belum Ada Tagihan Aktif</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Semua transaksi Anda telah selesai diproses.</p>
          </Card>
        ) : (
          /* LIST ORDER DARI SUPABASE */
          <div className="space-y-4">
            {orders.map((order) => {
              const orderAmount = Number(order.total || 0);
              const isUnpaid = order.status === "Menunggu Pembayaran";
              const itemTitle = order.items && order.items.length > 0 ? order.items[0].title : "Produk Essential Oil atSira";

              return (
                <div key={order.id} className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                  
                  <div className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-stone-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-stone-50 border rounded-lg text-stone-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-black text-stone-900">{order.id}</span>
                          <span className="text-stone-500 font-medium">{order.order_type || "B2C"}</span>
                          {!isUnpaid ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {order.status?.toUpperCase()}
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              MENUNGGU PEMBAYARAN
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-stone-400" /> {itemTitle}
                        </h3>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded mt-1">
                          📄 {buyerPersona === "nasional" ? "e-Faktur PPh Pasal 22" : "Bill of Lading & COO Cert"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between md:text-right items-center md:items-end gap-3">
                      <div>
                        <p className="text-[10px] text-stone-400 font-medium">Total Tagihan</p>
                        <p className="text-base font-black text-emerald-950">{formatCurrency(orderAmount)}</p>
                      </div>
                      
                      {isUnpaid && activeInvoice !== order.id && (
                        <button 
                          type="button"
                          onClick={() => setActiveInvoice(order.id)}
                          className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-[11px] px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 h-9"
                        >
                          <span>Bayar Tagihan</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {!isUnpaid && (
                        <button 
                          type="button"
                          onClick={() => alert(`Unduh dokumen e-Faktur / Kuitansi untuk Order ID: ${order.id}`)}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-stone-200 transition-all flex items-center gap-1.5 h-8"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-500" />
                          <span>Unduh Dokumen</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FORM PAYOUT GATEWAY */}
                  {activeInvoice === order.id && (
                    <div className="bg-stone-50/70 p-5 border-t border-stone-100 animate-in slide-in-from-top-2 duration-200">
                      <form onSubmit={(e) => handlePaymentSubmit(e, order)} className="max-w-md space-y-4">
                        
                        <div className="flex items-center gap-2 text-xs font-black text-stone-700 uppercase tracking-tight">
                          <Lock className="w-3.5 h-3.5 text-emerald-700" /> API Session Gateway Connection
                        </div>

                        {buyerPersona === "nasional" ? (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-500 uppercase">Pilih Bank Virtual Account</label>
                              <select 
                                value={selectedBank} 
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
                              >
                                <option value="BCA">Bank Central Asia (BCA Virtual Account)</option>
                                <option value="Mandiri">Bank Mandiri (Mandiri Bill Payment)</option>
                                <option value="BNI">Bank Negara Indonesia (BNI Virtual Account)</option>
                              </select>
                            </div>
                            <div className="p-3 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-500 flex items-start gap-2">
                              <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              <p>Pembayaran akan terverifikasi secara otomatis melalui Midtrans Webhook ke tabel orders Supabase.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                              <CreditCard className="w-4 h-4 text-emerald-700" /> Redirect Ke Stripe Checkout
                            </div>
                            <p className="text-[11px] text-stone-500">
                              Mengklik tombol di bawah akan mengarahkan Anda ke halaman aman Stripe Hosted Checkout untuk memproses pembayaran Visa/Mastercard.
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button 
                            type="submit"
                            disabled={loadingId !== null}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[11px] px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                          >
                            {loadingId === order.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Menghubungkan API...</span>
                              </>
                            ) : buyerPersona === "nasional" ? (
                              `Bayar via VA ${selectedBank}`
                            ) : (
                              "Lanjut ke Stripe Checkout"
                            )}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setActiveInvoice(null)}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[11px] px-3 py-2 rounded-lg transition-colors"
                          >
                            Batal
                          </button>
                        </div>

                      </form>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardShell>
  );
}