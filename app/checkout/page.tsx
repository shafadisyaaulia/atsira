"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label } from "@/components/ui/Input";
import { useCartStore } from "@/lib/store";
import { formatIDR } from "@/lib/mock";

const COURIERS = [
  { id: "standard", label: "Pengiriman Standar", desc: "3 - 5 Hari Kerja", price: 15000 },
  { id: "express", label: "Pengiriman Ekspres", desc: "1 - 2 Hari Kerja", price: 45000 },
];

const PAYMENT_METHODS = [
  { id: "va", label: "Transfer Bank (Virtual Account)" },
  { id: "ewallet", label: "E-Wallet (GoPay, OVO, DANA)" },
  { id: "card", label: "Kartu Kredit / Debit" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const [courier, setCourier] = useState("standard");
  const [payment, setPayment] = useState("va");
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = COURIERS.find((c) => c.id === courier)?.price ?? 0;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shippingFee + tax;

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      clear();
      router.push("/checkout/success");
    }, 1200);
  }

  return (
    <PageShell>
      <div className="container-app py-10">
        <div className="flex items-center gap-2 mb-8">
          <Lock className="w-4 h-4 text-primary" />
          <h1 className="font-display text-headline-md text-primary">Pembayaran Aman</h1>
        </div>

        <form onSubmit={handlePay} className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <p className="font-semibold text-on-surface mb-4">1. Alamat Pengiriman</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="fullname">Nama Lengkap</Label>
                  <Input id="fullname" required defaultValue="Budi Santoso" />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" required defaultValue="+62 812 3456 7890" />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required defaultValue="budi@example.com" />
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" required defaultValue="Jl. Sudirman No. 123, Kebayoran Baru" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Provinsi</Label>
                  <Select id="province" defaultValue="DKI Jakarta">
                    <option>DKI Jakarta</option>
                    <option>Aceh</option>
                    <option>Jawa Barat</option>
                    <option>Jawa Timur</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postal">Kode Pos</Label>
                  <Input id="postal" defaultValue="12345" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="font-semibold text-on-surface mb-4">2. Metode Pengiriman</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {COURIERS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCourier(c.id)}
                    className={`text-left p-4 rounded-md border ${
                      courier === c.id ? "border-primary bg-primary-fixed/30" : "border-sand-gray"
                    }`}
                  >
                    <p className="text-sm font-semibold text-on-surface">{c.label}</p>
                    <p className="text-xs text-outline mb-2">{c.desc}</p>
                    <p className="text-sm font-semibold text-primary">{formatIDR(c.price)}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 mt-4 bg-surface-container-low rounded-md p-3">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant">
                  Jaminan Keaslian: Setiap pembelian dilengkapi sertifikat digital yang melacak asal-usul
                  minyak nilam Anda.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <p className="font-semibold text-on-surface mb-4">3. Metode Pembayaran</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPayment(p.id)}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-md border ${
                      payment === p.id ? "border-primary bg-primary-fixed/30" : "border-sand-gray"
                    }`}
                  >
                    <span className="text-sm font-medium text-on-surface">{p.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 ${
                        payment === p.id ? "border-primary bg-primary" : "border-outline-variant"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 h-fit sticky top-24">
            <p className="font-semibold text-on-surface mb-4">Ringkasan Pesanan</p>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">
                    {i.title} <span className="text-outline">×{i.qty}</span>
                  </span>
                  <span className="font-medium">{formatIDR(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-container-high pt-3 space-y-1.5 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pengiriman</span>
                <span>{formatIDR(shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pajak (PPN 11%)</span>
                <span>{formatIDR(tax)}</span>
              </div>
            </div>
            <div className="border-t border-surface-container-high pt-3 mb-5 flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-display text-lg text-primary">{formatIDR(total)}</span>
            </div>
            <Button type="submit" disabled={processing || items.length === 0} size="lg" className="w-full">
              {processing ? "Memproses..." : "Bayar Sekarang"}
            </Button>
            <p className="text-xs text-outline text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Enkripsi SSL 256-bit
            </p>
          </Card>
        </form>
      </div>
    </PageShell>
  );
}
