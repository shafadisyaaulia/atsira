"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Package } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";

// Kamus Ganda Bahasa untuk Halaman Sukses
const T = {
  success: { ID: "Pembayaran Berhasil", EN: "Payment Successful" },
  processing: { ID: "Pesanan sedang diproses.", EN: "Your order is being processed." },
  escrowTitle: { ID: "Dana Anda Aman di Escrow ATSIRA", EN: "Your Funds are Safe in ATSIRA Escrow" },
  escrowDesc: { 
    ID: "Pembayaran Anda ditahan dengan aman oleh sistem escrow dan baru akan dicairkan ke penjual setelah barang Anda terima dengan baik.", 
    EN: "Your payment is securely held by the escrow system and will only be disbursed to the seller after you successfully receive the package." 
  },
  etaTitle: { ID: "Estimasi Pengiriman", EN: "Estimated Delivery" },
  etaDesc: { 
    ID: "3 - 5 hari kerja (Domestik) / 7 - 14 hari kerja (Internasional). Anda akan menerima notifikasi nomor resi pelacakan.", 
    EN: "3 - 5 working days (Domestic) / 7 - 14 working days (International). You will receive a tracking number notification." 
  },
  btnStatus: { ID: "Lihat Status Pesanan", EN: "View Order Status" },
  btnShop: { ID: "Lanjut Belanja", EN: "Continue Shopping" }
};

export default function CheckoutSuccessPage() {
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [orderId, setOrderId] = useState("");
  const { clear } = useCartStore();

  useEffect(() => {
    // Membaca preferensi bahasa dari halaman sebelumnya
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "EN") setLang("EN");

    // Membuat Order ID acak secara Client-Side untuk menghindari mismatch SSR
    setOrderId(`ATR-${Math.floor(1000 + Math.random() * 9000)}`);
    
    // KUNCI PERBAIKAN: Keranjang baru dikosongkan dengan aman di sini
    clear(); 
  }, [clear]);

  return (
    <PageShell>
      <div className="container-app py-20 max-w-lg mx-auto px-4">
        <Card className="p-8 text-center border border-surface-container-high bg-white rounded-2xl shadow-xs">
          
          {/* Efek Lingkaran Centang Hijau */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-100/50">
            <CheckCircle2 className="w-10 h-10 text-emerald-800" />
          </div>

          <h1 className="font-display text-2xl font-black text-primary mb-2 tracking-tight">
            {T.success[lang]}
          </h1>
          <p className="text-xs text-on-surface-variant mb-6 font-medium bg-surface-container-low py-1.5 px-3 rounded-lg inline-block">
            {lang === "ID" ? "Nomor Pesanan" : "Order ID"}: <span className="font-bold text-on-surface">#{orderId || "..."}</span>
          </p>

          {/* Kotak Detail Proteksi Escrow & Kurir */}
          <div className="bg-surface-container-low/60 border border-surface-container-high rounded-xl p-5 mb-8 text-left space-y-4">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-on-surface">{T.escrowTitle[lang]}</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                  {T.escrowDesc[lang]}
                </p>
              </div>
            </div>

            <div className="border-t border-surface-container-high/60 my-2" />

            <div className="flex items-start gap-3.5">
              <Package className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-on-surface">{T.etaTitle[lang]}</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                  {T.etaDesc[lang]}
                </p>
              </div>
            </div>
          </div>

          {/* Navigasi Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/dashboard/buyer" className="flex-1 rounded-xl text-xs font-bold py-3">
              {T.btnStatus[lang]}
            </Button>
            <Button href="/marketplace" variant="secondary" className="flex-1 rounded-xl text-xs font-bold py-3 border border-surface-container-high hover:bg-surface-container-low">
              {T.btnShop[lang]}
            </Button>
          </div>

        </Card>
      </div>
    </PageShell>
  );
}