"use client";

import { useState } from "react";
import { 
  FileText, 
  Building, 
  ArrowRight, 
  CreditCard,
  Lock,
  CheckCircle2,
  Building2
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";

const DEMO_BILLS = [
  {
    id: "INV-2026-881",
    sellerName: "Kelompok Tani Nilam Gayo Mandiri",
    amountIDR: 137500000,
    amountUSD: 8950, 
    dueDate: "24 Jul 2026",
    status: "unpaid",
    type: "Termin 2 (Pelunasan DP 50%)",
    taxDoc: "e-Faktur PPh Pasal 22",
    exportDoc: "Bill of Lading & COO Cert"
  }
];

export default function BuyerWalletPage() {
  const [buyerPersona, setBuyerPersona] = useState<"nasional" | "internasional">("nasional");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<string | null>(null);

  // Form States Pembayaran
  const [selectedBank, setSelectedBank] = useState("BCA");
  const [cardNumber, setCardNumber] = useState("4121 5562 8891 0024");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("321");
  
  // LOGIKA BARU: Flag memory kartu tersimpan dari transaksi marketplace sebelumnya
  const [hasSavedVisa, setHasSavedVisa] = useState(true); 

  const formatCurrency = (bill: typeof DEMO_BILLS[0]) => {
    if (buyerPersona === "internasional") {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(bill.amountUSD);
    }
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(bill.amountIDR);
  };

  const handleDemoPaymentSubmit = (e: React.FormEvent, invoiceId: string) => {
    e.preventDefault();
    setLoadingId(invoiceId);
    
    setTimeout(() => {
      if (buyerPersona === "internasional") {
        alert(
          `[DEMO SUCCESS - VISA CORPROATE GATEWAY]\n` +
          `==========================================\n` +
          `• Menggunakan Kartu: **** **** **** ${cardNumber.slice(-4)}\n` +
          `• Status Tokenisasi: ${hasSavedVisa ? "Menggunakan Kartu Tersimpan (Fast Track)" : "Kartu Baru Berhasil Disimpan"}\n` +
          `• Dana $8,950 USD Masuk ke Escrow Atsira Layer!`
        );
        setHasSavedVisa(true);
      } else {
        alert(
          `[DEMO SUCCESS - VIRTUAL ACCOUNT LOKAL]\n` +
          `==========================================\n` +
          `• Rute Kliring: Interkoneksi Bank ${selectedBank}\n` +
          `• Nominal Terpangkas: Rp 137.500.000\n\n` +
          `Otentikasi Webhook sukses via Midtrans Network.`
        );
      }
      setLoadingId(null);
      setActiveInvoice(null);
    }, 1200);
  };

  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12 animate-in fade-in duration-200">
        
        {/* CONTROL PANEL SWITCHER (Pilihan Juri) */}
        <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-emerald-900">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">ATSIRA Live Demo Interaktif</p>
            </div>
            <p className="text-[11px] text-emerald-200/70">Pilih profil tipe pembeli untuk simulasi rute kliring nasional / internasional.</p>
          </div>
          
          <div className="flex bg-emerald-900/60 p-1 rounded-lg border border-emerald-800 self-stretch sm:self-auto">
            <button 
              type="button"
              onClick={() => { setBuyerPersona("nasional"); setActiveInvoice(null); }} 
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all ${buyerPersona === "nasional" ? "bg-white text-stone-900 shadow" : "text-emerald-300 hover:text-white"}`}
            >
              🇮🇩 Rute Bank Lokal
            </button>
            <button 
              type="button"
              onClick={() => { setBuyerPersona("internasional"); setActiveInvoice(null); }} 
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all ${buyerPersona === "internasional" ? "bg-white text-stone-900 shadow" : "text-emerald-300 hover:text-white"}`}
            >
              🌐 Rute Visa Internasional
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div>
          <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">
            {buyerPersona === "nasional" ? "Invoice Pengadaan Domestik" : "International Logistics Invoices"}
          </h1>
        </div>

        {/* INVOICE LIST */}
        <div className="space-y-4">
          {DEMO_BILLS.map((bill) => (
            <div key={bill.id} className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
              
              <div className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-stone-100">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-stone-50 border rounded-lg text-stone-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-black text-stone-900">{bill.id}</span>
                      <span className="text-stone-500 font-medium">{bill.type}</span>
                    </div>
                    <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-stone-400" /> {bill.sellerName}
                    </h3>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded mt-1">
                      📄 {buyerPersona === "nasional" ? bill.taxDoc : bill.exportDoc}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between md:text-right items-center md:items-end gap-3">
                  <div>
                    <p className="text-[10px] text-stone-400 font-medium">Total Tagihan</p>
                    <p className="text-base font-black text-emerald-950">{formatCurrency(bill)}</p>
                  </div>
                  
                  {activeInvoice !== bill.id && (
                    <button 
                      type="button"
                      onClick={() => setActiveInvoice(bill.id)}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-[11px] px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 h-9"
                    >
                      <span>Pilih Metode Bayar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* AREA INPUT CHECKOUT LANGSUNG (SINKRON DENGAN ALUR MARKETPLACE) */}
              {activeInvoice === bill.id && (
                <div className="bg-stone-50/70 p-5 border-t border-stone-100 animate-in slide-in-from-top-2 duration-200">
                  <form onSubmit={(e) => handleDemoPaymentSubmit(e, bill.id)} className="max-w-md space-y-4">
                    
                    <div className="flex items-center gap-2 text-xs font-black text-stone-700 uppercase tracking-tight">
                      <Lock className="w-3.5 h-3.5 text-emerald-700" /> Secure Checkout Integration
                    </div>

                    {/* JIKA PEMBELI NASIONAL - PILIH BANK */}
                    {buyerPersona === "nasional" ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-500 uppercase">Pilih Bank Korporat</label>
                          <select 
                            value={selectedBank} 
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
                          >
                            <option value="BCA">Bank Central Asia (BCA Corporate VA)</option>
                            <option value="Mandiri">Bank Mandiri (MCM Auto-Settlement)</option>
                            <option value="BNI">Bank Negara Indonesia (BNI Direct)</option>
                          </select>
                        </div>
                        <div className="p-3 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-500 flex items-start gap-2">
                          <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <p>Sistem ATSIRA akan menerbitkan nomor Virtual Account unik untuk pelunasan tagihan domestik ini secara otomatis.</p>
                        </div>
                      </div>
                    ) : (
                      /* JIKA PEMBELI INTERNASIONAL (LOGIKA INGATAN VISA) */
                      <div className="space-y-3">
                        {hasSavedVisa ? (
                          /* Kondisi: Sudah ada Visa dari transaksi sebelumnya */
                          <div className="p-4 bg-white border-2 border-dashed border-emerald-600 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-amber-500" /> Visa Korporat Terdeteksi
                              </span>
                              <button type="button" onClick={() => setHasSavedVisa(false)} className="text-[10px] underline text-stone-400 font-semibold">Ganti Kartu</button>
                            </div>
                            <p className="text-xs font-mono font-bold text-stone-900 tracking-wider">**** **** **** {cardNumber.slice(-4)}</p>
                            <p className="text-[11px] text-stone-500">Fast Track diaktifkan. Anda tidak perlu memasukkan ulang detail kartu Anda.</p>
                          </div>
                        ) : (
                          /* Kondisi: Isi baru jika belum ada kartu */
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-500 uppercase">Corporate Visa Number</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  placeholder="4121 5562 8891 0024"
                                  className="w-full bg-white border border-stone-300 rounded-lg p-2 pl-9 text-xs font-mono font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
                                  required
                                />
                                <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-stone-500 uppercase">Masa Berlaku</label>
                                <input 
                                  type="text" 
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-center font-bold text-stone-800 focus:outline-none focus:border-emerald-600"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-stone-500 uppercase">CVV</label>
                                <input 
                                  type="password" 
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="•••"
                                  maxLength={3}
                                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-center font-bold tracking-widest text-stone-800 focus:outline-none focus:border-emerald-600"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 pt-2">
                      <button 
                        type="submit"
                        disabled={loadingId !== null}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[11px] px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        {loadingId === bill.id ? "Memproses..." : buyerPersona === "nasional" ? `Konfirmasi Tagihan VA ${selectedBank}` : "Otorisasi Pembayaran Visa"}
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
          ))}
        </div>

      </div>
    </DashboardShell>
  );
}