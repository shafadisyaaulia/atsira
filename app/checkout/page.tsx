"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Lock, ShieldCheck, CreditCard, ShoppingBag, Globe, Truck, UserCheck, LogIn, CheckCircle2, Loader2, Copy, Building2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label } from "@/components/ui/Input";
import { useAuthStore, useCartStore } from "@/lib/store";
import { formatIDR } from "@/lib/mock";

declare global {
  interface Window {
    snap: any;
  }
}

const EXCHANGE_RATE = 16000;
const formatUSD = (val: number) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val / EXCHANGE_RATE);

const T = {
  title: { ID: "Pembayaran Aman", EN: "Secure Checkout" },
  empty: { ID: "Keranjang belanja Anda kosong.", EN: "Your shopping cart is empty." },
  section1: { ID: "1. Alamat & Tujuan Pengiriman", EN: "1. Delivery Address & Destination" },
  shippingType: { ID: "Wilayah Tujuan Paket", EN: "Destination Region" },
  domestic: { ID: "Dalam Negeri (Domestik)", EN: "Domestic (Indonesia)" },
  international: { ID: "Luar Negeri (Internasional)", EN: "International (Worldwide)" },
  fullname: { ID: "Nama Lengkap Penerima", EN: "Recipient's Full Name" },
  phone: { ID: "Nomor Telepon / WhatsApp", EN: "Phone / WhatsApp Number" },
  address: { ID: "Alamat Lengkap (Jalan, Blok, No. Rumah)", EN: "Full Address (Street, Block, House No.)" },
  province: { ID: "Provinsi", EN: "Province" },
  country: { ID: "Negara Tujuan", EN: "Destination Country" },
  postal: { ID: "Kode Pos", EN: "Postal / ZIP Code" },
  section2: { ID: "2. Jasa Pengiriman (Kurir)", EN: "2. Shipping Courier" },
  guaranteeTitle: { ID: "Jaminan Keaslian Ekosistem:", EN: "Ecosystem Authenticity Guarantee:" },
  guaranteeDesc: { 
    ID: "Setiap produk terhubung langsung dengan sistem pelacakan (traceability) digital hulu minyak nilam murni dari petani mitra Aceh & ARC-USK.", 
    EN: "Every product is directly linked to the digital traceability system tracking back to Acehnese patchouli farmers & ARC-USK Lab." 
  },
  section3: { ID: "3. Metode Pembayaran", EN: "3. Payment Method" },
  summary: { ID: "Ringkasan Pesanan", EN: "Order Summary" },
  shippingFee: { ID: "Ongkos Kirim", EN: "Shipping Fee" },
  tax: { ID: "Pajak (PPN 11%)", EN: "Tax (VAT 11%)" },
  escrow: { 
    ID: "Sistem Pembayaran Terproteksi: Dana ditahan di rekening bersama aman hingga produk diverifikasi oleh pembeli.", 
    EN: "Protected Payment System: Funds are safely held in escrow secure until the buyer verifies product delivery." 
  },
  totalPay: { ID: "Total Pembayaran", EN: "Total Payment" },
  btnPay: { ID: "Bayar Sekarang", EN: "Pay Now" },
  processing: { ID: "Memproses...", EN: "Processing..." },
  secure: { ID: "Enkripsi Aman SSL 256-bit", EN: "256-bit SSL Secure Encryption" },
  authRequired: { ID: "Langkah Terakhir Sebelum Checkout", EN: "Final Step Before Checkout" },
  authSubtitle: { ID: "Silakan masuk atau buat akun baru untuk mengamankan sertifikat digital pelacakan produk Anda.", EN: "Please login or create a new account to secure your product's digital traceability certificate." },
  btnLogin: { ID: "Masuk / Login Akun", EN: "Sign In / Login Account" },
  btnRegister: { ID: "Daftar Akun Baru", EN: "Register New Account" },
  btnGuest: { ID: "Demo Juri: Langsung Lanjut Checkout", EN: "Judge Demo: Fast Track Checkout" }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, addItem } = useCartStore();
  const user = useAuthStore((state) => state.user);
  
  const [isInternational, setIsInternational] = useState(false);
  const [courier, setCourier] = useState("std");
  const [payment, setPayment] = useState("cod");
  const [processing, setProcessing] = useState(false);
  const [payStep, setPayStep] = useState("form"); // form | va_code | verifying
  const [vaCode, setVaCode] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    province: "Aceh",
    country: "Indonesia",
    postal: "",
  });

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(Boolean(user));

    const savedLang = localStorage.getItem("lang");
    if (savedLang === "EN") setLang("EN");
  }, [user]);

  useEffect(() => {
    setShippingForm((prev) => ({
      ...prev,
      fullname: user?.name || prev.fullname || (isInternational ? "Maison Global Aroma Ltd" : "Budi Santoso"),
      phone: prev.phone || (isInternational ? "+33 1 42 27 78 00" : "+62 812 3456 7890"),
      address: prev.address || (isInternational ? "23 Rue de la Paix" : "Jl. Teuku Umar No. 45, Sukaramai"),
      province: prev.province || "Aceh",
      country: prev.country || "Indonesia",
      postal: prev.postal || (isInternational ? "75002" : "23243"),
    }));
  }, [user, isInternational]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const directProductId = searchParams.get("productId");
    const directProductName = searchParams.get("name");
    const directProductPrice = Number(searchParams.get("price") ?? "0");
    const directProductUnit = searchParams.get("unit") ?? "pcs";
    const directProductCategory = searchParams.get("category") === "raw-oil" ? "raw-oil" : "finished-product";

    if (directProductId && directProductName && items.length === 0) {
      addItem({
        productId: directProductId,
        title: decodeURIComponent(directProductName),
        imageUrl: searchParams.get("image") || "/images/products/default.jpg",
        price: directProductPrice || 0,
        unit: directProductUnit,
        qty: 1,
        category: directProductCategory,
      });
    }

    if (isMounted && (user || isLoggedIn) && items.length === 0 && !directProductId) {
      router.push("/cart");
    }
  }, [isMounted, user, isLoggedIn, items, router, addItem]);

  const courierOptions = isInternational 
    ? [
        { id: "std", label: "Biteship Export Cargo (Standard)", desc: "7 - 14 Days", price: 480000 },
        { id: "exp", label: "DHL Express International", desc: "3 - 5 Days", price: 1200000 }
      ]
    : [
        { id: "std", label: "JNE Regular / J&T Express", desc: "3 - 5 Hari Kerja", price: 15000 },
        { id: "exp", label: "Pos Indonesia Kilat Khusus", desc: "1 - 2 Hari Kerja", price: 45000 }
      ];

  const paymentOptions = isInternational
    ? [
        { id: "stripe", label: "Credit / Debit Card (Visa/Mastercard via Stripe)" }
      ]
    : [
        { id: "midtrans", label: "Virtual Account (BCA, Mandiri, BSI) / QRIS Domestik" }
      ];

  useEffect(() => {
    setCourier("std");
    setPayment(isInternational ? "stripe" : "cod");
  }, [isInternational]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = courierOptions.find((c) => c.id === courier)?.price ?? 0;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shippingFee + tax;

  const money = (val: number) => isInternational ? formatUSD(val) : formatIDR(val);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setProcessing(true);
    localStorage.setItem("lang", lang);

    try {
      const selectedPaymentMethod = isInternational ? "stripe" : "midtrans";

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: user?.id ?? null,
          buyerName: shippingForm.fullname || user?.name || "Guest Customer",
          buyerPhone: shippingForm.phone,
          shippingAddress: shippingForm.address,
          shippingProvince: shippingForm.province,
          shippingCountry: shippingForm.country,
          shippingPostal: shippingForm.postal,
          items: items.map((item) => ({
            productId: item.productId,
            title: item.title,
            qty: item.qty,
            unit: item.unit || "pcs",
            price: item.price,
          })),
          subtotal,
          shippingFee,
          tax,
          total,
          paymentMethod: selectedPaymentMethod,
          courier: courierOptions.find((option) => option.id === courier)?.label ?? courier,
          orderType: "B2C",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Checkout failed");
      }

      localStorage.setItem("lastOrderId", result.orderId);

      // 1. STRIPE REDIRECT
      if (result.url) {
        window.location.href = result.url;
        return;
      }

      // 2. MIDTRANS SNAP POPUP
      if (result.token) {
        if (window.snap) {
          window.snap.pay(result.token, {
            onSuccess: function () {
              router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`);
            },
            onPending: function () {
              router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`);
            },
            onError: function () {
              alert("Pembayaran gagal!");
              setProcessing(false);
            },
            onClose: function () {
              setProcessing(false);
            },
          });
          return;
        } else {
          // Fallback jika script Snap belum termuat
          alert("Layanan Midtrans Snap sedang dimuat, silakan coba tekan tombol bayar sekali lagi.");
          setProcessing(false);
          return;
        }
      }

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }

      router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setProcessing(false);
      alert(error instanceof Error ? error.message : "Checkout gagal. Silakan coba lagi.");
    }
  }

  if (!isMounted) return null;

  const isSessionAuthenticated = Boolean(user) || isLoggedIn;

  if (!isSessionAuthenticated) {
    return (
      <PageShell>
        <div className="container-app py-20 max-w-md mx-auto px-4">
          <Card className="p-8 border border-surface-container-high bg-white rounded-2xl shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            
            <h2 className="font-display text-xl font-black text-primary tracking-tight mb-2">
              {T.authRequired[lang]}
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              {T.authSubtitle[lang]}
            </p>

            <div className="space-y-3">
              <Button onClick={() => router.push("/login")} className="w-full rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2">
                {T.btnLogin[lang]}
              </Button>
              <Button onClick={() => router.push("/register")} variant="secondary" className="w-full rounded-xl py-3 text-xs font-bold border border-surface-container-high hover:bg-surface-container-low">
                {T.btnRegister[lang]}
              </Button>
              
              <div className="relative my-4 flex py-1 items-center font-bold text-[10px] text-outline uppercase tracking-wider">
                <div className="flex-grow border-t border-surface-container-high"></div>
                <span className="flex-shrink mx-3 text-outline-variant">Or / Atau</span>
                <div className="flex-grow border-t border-surface-container-high"></div>
              </div>

              <button 
                type="button" 
                onClick={() => setIsLoggedIn(true)} 
                className="w-full py-3 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-amber-700" />
                {T.btnGuest[lang]}
              </button>
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="container-app py-24 text-center">
          <ShoppingBag className="w-12 h-12 text-outline mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium">{T.empty[lang]}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Script Midtrans Snap Sandbox */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="container-app py-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-surface-container-high pb-4">
          <div className="flex items-center gap-2 notranslate" translate="no">
            <Lock className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl font-black text-primary tracking-tight">{T.title[lang]}</h1>
          </div>
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-surface-container-high w-fit">
            <button type="button" onClick={() => setLang("ID")} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === "ID" ? "bg-primary text-white shadow-xs" : "text-outline"}`}>ID</button>
            <button type="button" onClick={() => setLang("EN")} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === "EN" ? "bg-primary text-white shadow-xs" : "text-outline"}`}>EN</button>
          </div>
        </div>

        <form onSubmit={handlePay} className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-6 border border-surface-container-high bg-white rounded-2xl">
              <p className="font-bold text-sm mb-5 uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <Globe className="w-4 h-4" /> {T.section1[lang]}
              </p>

              <div className="mb-5">
                <Label>{T.shippingType[lang]}</Label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button type="button" onClick={() => setIsInternational(false)} className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${!isInternational ? "bg-primary text-white border-primary shadow-xs" : "bg-white text-on-surface border-surface-container-high"}`}>
                    {T.domestic[lang]}
                  </button>
                  <button type="button" onClick={() => setIsInternational(true)} className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${isInternational ? "bg-primary text-white border-primary shadow-xs" : "bg-white text-on-surface border-surface-container-high"}`}>
                    {T.international[lang]}
                  </button>
                </div>
              </div>

              <div key={isInternational ? "intl-fields" : "dom-fields"} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullname">{T.fullname[lang]}</Label>
                    <Input
                      id="fullname"
                      required
                      value={shippingForm.fullname}
                      onChange={(e) => setShippingForm((prev) => ({ ...prev, fullname: e.target.value }))}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{T.phone[lang]}</Label>
                    <Input
                      id="phone"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">{T.address[lang]}</Label>
                  <Input
                    id="address"
                    required
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1 rounded-xl"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    {isInternational ? (
                      <>
                        <Label htmlFor="country">{T.country[lang]}</Label>
                        <Select
                          id="country"
                          value={shippingForm.country}
                          onChange={(e) => setShippingForm((prev) => ({ ...prev, country: e.target.value }))}
                          className="mt-1 rounded-xl h-11"
                        >
                          <option>France</option>
                          <option>Singapore</option>
                          <option>United States</option>
                          <option>Germany</option>
                          <option>Indonesia</option>
                        </Select>
                      </>
                    ) : (
                      <>
                        <Label htmlFor="province">{T.province[lang]}</Label>
                        <Select
                          id="province"
                          value={shippingForm.province}
                          onChange={(e) => setShippingForm((prev) => ({ ...prev, province: e.target.value }))}
                          className="mt-1 rounded-xl h-11"
                        >
                          <option>Aceh</option>
                          <option>DKI Jakarta</option>
                          <option>Sumatera Utara</option>
                          <option>Jawa Barat</option>
                        </Select>
                      </>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postal">{T.postal[lang]}</Label>
                    <Input
                      id="postal"
                      value={shippingForm.postal}
                      onChange={(e) => setShippingForm((prev) => ({ ...prev, postal: e.target.value }))}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-surface-container-high bg-white rounded-2xl">
              <p className="font-bold text-sm mb-4 uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <Truck className="w-4 h-4" /> {T.section2[lang]}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {courierOptions.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCourier(c.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      courier === c.id 
                        ? "border-primary bg-emerald-50/40 shadow-xs ring-1 ring-primary" 
                        : "border-surface-container-high hover:bg-surface-container-low"
                    }`}
                  >
                    <p className="text-xs font-bold text-on-surface">{c.label}</p>
                    <p className="text-[11px] text-outline mb-2">{c.desc}</p>
                    <p className="text-xs font-black text-primary">{money(c.price)}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2.5 mt-4 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-950 leading-relaxed">
                  <strong>{T.guaranteeTitle[lang]}</strong> {T.guaranteeDesc[lang]}
                </p>
              </div>
            </Card>

            <Card className="p-6 border border-surface-container-high bg-white rounded-2xl">
              <p className="font-bold text-sm mb-4 uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> {T.section3[lang]}
              </p>
              <div className="space-y-2">
                {paymentOptions.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPayment(p.id)}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-xl border transition-all ${
                      payment === p.id 
                        ? "border-primary bg-emerald-50/40 shadow-xs ring-1 ring-primary" 
                        : "border-surface-container-high hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="text-xs font-bold text-on-surface">{p.label}</span>
                    <span className="w-3.5 h-3.5 rounded-full border-2 transition-all border-outline-variant" style={payment === p.id ? { borderColor: "var(--md-sys-color-primary)", backgroundColor: "var(--md-sys-color-primary)", boxShadow: "0 0 0 4px #d1fae5" } : {}} />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 h-fit sticky top-24 border border-surface-container-high bg-white rounded-2xl shadow-xs">
            <p className="font-bold text-sm mb-4 uppercase tracking-wider text-emerald-800">{T.summary[lang]}</p>
            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1 no-scrollbar">
              {items.map((i, index) => (
                <div key={`${i.productId ?? i.title ?? "item"}-${index}`} className="flex justify-between text-xs">
                  <span className="text-on-surface-variant pr-2 line-clamp-1">
                    {i.title} <span className="text-outline font-bold">×{i.qty}</span>
                  </span>
                  <span className="font-bold text-on-surface flex-shrink-0">{money(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-surface-container-high pt-3 space-y-2 text-xs mb-4 text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{T.shippingFee[lang]}</span>
                <span className="font-semibold text-on-surface">{money(shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>{T.tax[lang]}</span>
                <span className="font-semibold text-on-surface">{money(tax)}</span>
              </div>
            </div>

            <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-3 mb-4 text-[10px] text-outline flex gap-2 items-center">
              <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{T.escrow[lang]}</span>
            </div>

            <div className="border-t border-surface-container-high pt-3 mb-5 flex justify-between items-center font-bold">
              <span className="text-xs text-on-surface">{T.totalPay[lang]}</span>
              <span className="font-display text-lg text-primary font-black">{money(total)}</span>
            </div>

            <Button type="submit" disabled={processing} className="w-full rounded-xl font-bold text-xs py-3.5">
              {processing ? T.processing[lang] : T.btnPay[lang]}
            </Button>
            
            <p className="text-[10px] text-outline text-center mt-3.5 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-700" /> {T.secure[lang]}
            </p>
          </Card>
        </form>
      </div>
    </PageShell>
  );
}