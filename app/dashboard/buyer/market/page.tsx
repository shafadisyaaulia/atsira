"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  MapPin, 
  Sparkles, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CheckCircle2,
  Droplet,
  Lock,
  CreditCard,
  Building2,
  Receipt,
  ArrowRight,
  ShoppingBag,
  Zap
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, Badge } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// ── IMPORT DATA ASLI SESUAI FILE PRODUCTS.TS ANDA
import { RAW_OIL_LISTINGS, FINISHED_PRODUCTS } from "@/lib/mock/products";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  unit: string;
}

interface SuccessReceipt {
  type: "nasional" | "internasional" | "instan";
  amount: number;
  methodDetail: string;
  gateway: string;
  cardLastFour?: string;
}

export default function BuyerDashboardMarketplace() {
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("Semua Grade");
  const [tab, setTab] = useState<"raw" | "finished">("finished");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment">("cart");
  const [paymentRoute, setPaymentRoute] = useState<"nasional" | "internasional">("nasional");

  // FITUR FAVORITE: State menampung list ID produk terfavorit
  const [favorites, setFavorites] = useState<string[]>([]);

  // FITUR BELI LANGSUNG: State modal beli instan
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);
  const [selectedDirectProduct, setSelectedDirectProduct] = useState<any | null>(null);
  const [directPaymentMethod, setDirectPaymentMethod] = useState("BCA Corporate Virtual Account (Auto-Settlement)");

  // Form States Pembayaran
  const [selectedBank, setSelectedBank] = useState("BCA");
  const [cardNumber, setCardNumber] = useState("4121 5562 8891 0024");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("321");
  const [hasSavedVisa, setHasSavedVisa] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false);

  // States Kontrol Pop-up & Notifikasi
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss notification setelah 3 detik
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  const filteredRaw = useMemo(() => {
    return RAW_OIL_LISTINGS.filter((p) => {
      const title = p.title || "";
      const matchQuery = title.toLowerCase().includes(query.toLowerCase()) || p.region.toLowerCase().includes(query.toLowerCase());
      const matchGrade = gradeFilter === "Semua Grade" || p.grade === gradeFilter;
      return matchQuery && matchGrade;
    });
  }, [query, gradeFilter]);

  const filteredFinished = useMemo(() => {
    return FINISHED_PRODUCTS.filter((p) => {
      const title = p.title || "";
      const description = p.description || "";
      return title.toLowerCase().includes(query.toLowerCase()) || description.toLowerCase().includes(query.toLowerCase());
    });
  }, [query]);

  // LOGIKA FAVORITE TOGGLE
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // LOGIKA PEMICU BELI LANGSUNG
  const handleOpenDirectBuy = (product: any, type: "raw" | "finished") => {
    const pPrice = type === "raw" ? product.pricePerKg : product.price;
    const pUnit = type === "raw" ? "kg" : product.unit || "pcs";
    const pSeller = type === "raw" ? "Kelompok Tani Mitra" : (product.id === "fp-sabun-nilam" || product.id === "fp-lilin-aromaterapi" ? "UMKM Aceh Scent" : "UMKM Seulawah Parfum");
    const pQty = type === "raw" ? product.minOrderKg : 1;

    setSelectedDirectProduct({
      ...product,
      calculatedPrice: pPrice,
      calculatedUnit: pUnit,
      calculatedSeller: pSeller,
      calculatedQty: pQty,
      calculatedTotal: pPrice * pQty
    });
    setShowDirectCheckout(true);
  };

  // LOGIKA SUBMIT PEMBAYARAN BELI LANGSUNG
  const handleDirectPaymentSubmit = () => {
    if (!selectedDirectProduct) return;
    setIsProcessing(true);

    setTimeout(() => {
      setSuccessReceipt({
        type: "instan",
        amount: selectedDirectProduct.calculatedTotal,
        methodDetail: directPaymentMethod,
        gateway: "Mandatori Vault Escrow Fast-Track",
      });
      setIsProcessing(false);
      setShowDirectCheckout(false);
      setSelectedDirectProduct(null);
    }, 1200);
  };

  const handleAddToCart = (product: any, type: "raw" | "finished") => {
    const pId = product.id;
    const pName = product.title;
    const pPrice = type === "raw" ? product.pricePerKg : product.price;
    const pUnit = type === "raw" ? "kg" : product.unit || "pcs";
    const pSeller = type === "raw" ? "Kelompok Tani Mitra" : (product.id === "fp-sabun-nilam" || product.id === "fp-lilin-aromaterapi" ? "UMKM Aceh Scent" : "UMKM Seulawah Parfum");
    const minQty = type === "raw" ? product.minOrderKg : 1;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === pId);
      if (existing) {
        return prev.map((item) =>
          item.productId === pId ? { ...item, quantity: item.quantity + (type === "raw" ? 5 : 1) } : item
        );
      }
      return [...prev, { productId: pId, name: pName, price: pPrice, quantity: minQty, seller: pSeller, unit: pUnit }];
    });
    
    setToastMessage(`"${pName}" berhasil dimasukkan ke keranjang!`);
    setCheckoutStep("cart"); 
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinalPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      if (paymentRoute === "internasional") {
        setSuccessReceipt({
          type: "internasional",
          amount: totalCartPrice,
          methodDetail: `Visa Corporate Card (•••• ${cardNumber.slice(-4)})`,
          gateway: "Stripe Escrow Layer Security",
          cardLastFour: cardNumber.slice(-4)
        });
        setHasSavedVisa(true); 
      } else {
        setSuccessReceipt({
          type: "nasional",
          amount: totalCartPrice,
          methodDetail: `Bank Transfer VA (${selectedBank} Auto-Settlement)`,
          gateway: "Midtrans Webhook Interconnection",
        });
      }
      
      setIsProcessing(false);
      setCart([]);
      setIsCartOpen(false);
      setCheckoutStep("cart");
    }, 1500);
  };

  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 relative animate-in fade-in duration-200">
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[110] bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-stone-800 text-xs font-bold max-w-sm animate-in slide-in-from-top-4 duration-300">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 text-stone-200 leading-snug">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-stone-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* HEADER BAR DASHBOARD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-container-high pb-4">
          <div>
            <h1 className="font-display text-headline-medium text-primary font-bold">Sourcing Hub & Marketplace</h1>
            <p className="text-sm text-outline">Gunakan katalog komoditas asli untuk simulasi pembelian end-to-end langsung.</p>
          </div>

          <Button onClick={() => setIsCartOpen(true)} className="relative rounded-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Keranjang Sourcing</span>
            {cart.length > 0 && (
              <span className="bg-amber-500 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white ml-1">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </Button>
        </div>

        {/* INPUT PENCARIAN & FILTER */}
        <div className="flex flex-col md:flex-row gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <Input
              placeholder='Coba cari: "Premium", "Gayo", atau "Parfum Elixir"...'
              className="pl-12 rounded-xl bg-white text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {tab === "raw" && (
            <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="md:w-56 rounded-xl bg-white text-sm">
              <option value="Semua Grade">Semua Kualitas Grade</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
            </Select>
          )}
          <Button variant="secondary" className="rounded-xl text-sm font-medium"><SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filter Lanjutan</Button>
        </div>

        {/* NAVIGASI TAB KATALOG */}
        <div className="flex gap-4 border-b border-surface-container-high">
          <button onClick={() => setTab("finished")} className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${tab === "finished" ? "border-primary text-primary" : "border-transparent text-outline hover:text-primary"}`}>Produk Jadi Turunan</button>
          <button onClick={() => setTab("raw")} className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${tab === "raw" ? "border-primary text-primary" : "border-transparent text-outline hover:text-primary"}`}>Minyak Nilam Murni (B2B Bulk)</button>
        </div>

        {/* GRID RENDER PRODUK JADI TURUNAN */}
        {tab === "finished" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFinished.map((p) => {
              const isFav = favorites.includes(p.id);
              return (
                <Card key={p.id} className="relative overflow-hidden h-full flex flex-col justify-between rounded-2xl border border-surface-container-high bg-white shadow-sm hover:shadow-md transition-all group">
                  {/* 1. TOMBOL FAVORITE (BINTANG) */}
                  <button 
                    onClick={() => toggleFavorite(p.id)}
                    className="absolute top-3 right-3 p-2 rounded-full border border-stone-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-105 z-10"
                    title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                  >
                    <Star className={`w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : "text-stone-400"}`} />
                  </button>

                  <div>
                    <div className="relative aspect-square overflow-hidden bg-bone-wash">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3"><Badge variant="ai" className="flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-200"><Sparkles className="w-3 h-3 text-amber-500 inline" /> Terverifikasi AI</Badge></div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-outline mb-1">{p.id === "fp-sabun-nilam" || p.id === "fp-lilin-aromaterapi" ? "UMKM Aceh Scent" : "UMKM Seulawah Parfum"}</p>
                      <p className="font-semibold text-on-surface text-sm leading-snug mb-2 line-clamp-2 h-10 pr-6">{p.title}</p>
                      <div className="flex items-center gap-1 mb-3"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="text-xs font-medium text-on-surface-variant">{p.rating} <span className="text-outline">({p.reviewCount})</span></span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-surface-container-low border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-primary text-sm">{formatCurrency(p.price)} <span className="text-xs font-body font-normal text-outline">/{p.unit}</span></p>
                    </div>
                    {/* AKSI TOMBOL LAYANAN */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAddToCart(p, "finished")} className="text-xs font-bold rounded-xl h-9 border-stone-200 text-stone-700">
                        + Keranjang
                      </Button>
                      {/* 2. TOMBOL BELI LANGSUNG INSTAN */}
                      <Button size="sm" onClick={() => handleOpenDirectBuy(p, "finished")} className="text-xs font-extrabold rounded-xl h-9 bg-stone-950 hover:bg-stone-800 text-white flex items-center justify-center gap-1 shadow-sm">
                        <Zap className="w-3 h-3 fill-amber-400 stroke-amber-400" /> Beli Langsung
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* GRID RENDER MINYAK NILAM MURNI (BULK) */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRaw.map((p) => {
              const isFav = favorites.includes(p.id);
              return (
                <Card key={p.id} className="relative overflow-hidden h-full flex flex-col justify-between rounded-2xl border border-surface-container-high bg-white shadow-sm hover:shadow-md transition-all group">
                  {/* 1. TOMBOL FAVORITE (BINTANG) */}
                  <button 
                    onClick={() => toggleFavorite(p.id)}
                    className="absolute top-3 right-3 p-2 rounded-full border border-stone-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-105 z-10"
                    title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                  >
                    <Star className={`w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : "text-stone-400"}`} />
                  </button>

                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-bone-wash">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3"><Badge variant="ai" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200"><Sparkles className="w-2.5 h-2.5 text-amber-500 inline mr-0.5" /> Terverifikasi AI</Badge></div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-xs font-semibold text-outline mb-1.5"><MapPin className="w-3.5 h-3.5 text-clay-earth" /> {p.region}</div>
                      <p className="font-semibold text-on-surface text-sm leading-snug mb-2 line-clamp-2 h-10 pr-6">{p.title}</p>
                      <div className="flex items-center justify-between mb-3 bg-surface-container-low p-2 rounded-xl border"><span className="text-xs text-outline font-medium">Grade: <span className="text-primary font-bold">{p.grade}</span></span><span className="text-xs font-mono font-bold text-primary">PA {p.coa?.paLevel}%</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-surface-container-low border-t space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-display font-bold text-primary text-sm">{formatCurrency(p.pricePerKg)}<span className="text-xs font-body font-normal text-outline">/kg</span></p>
                        <span className="text-[10px] text-outline block">Min order: {p.minOrderKg}kg</span>
                      </div>
                    </div>
                    {/* AKSI TOMBOL LAYANAN */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAddToCart(p, "raw")} className="text-xs font-bold rounded-xl h-9 border-stone-200 text-stone-700">
                        + Sourcing
                      </Button>
                      {/* 2. TOMBOL BELI LANGSUNG INSTAN */}
                      <Button size="sm" onClick={() => handleOpenDirectBuy(p, "raw")} className="text-xs font-extrabold rounded-xl h-9 bg-stone-950 hover:bg-stone-800 text-white flex items-center justify-center gap-1 shadow-sm">
                        <Zap className="w-3 h-3 fill-amber-400 stroke-amber-400" /> Beli Langsung
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* LACI KERANJANG PANELS */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-5 animate-in slide-in-from-right duration-200">
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2 text-primary">
                  <ShoppingCart className="w-5 h-5" /> 
                  {checkoutStep === "cart" ? "Ringkasan Pengadaan" : "Metode Pembayaran B2B"}
                </h3>
                <button onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }} className="text-outline hover:text-on-surface"><X className="w-6 h-6" /></button>
              </div>

              {checkoutStep === "cart" && (
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-outline space-y-2">
                      <Droplet className="w-8 h-8 mx-auto stroke-1 text-outline/50 animate-pulse" />
                      <p className="text-xs font-bold">Keranjang pengadaan Anda kosong.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.productId} className="border border-surface-container-high p-3 rounded-xl bg-surface-container-low space-y-2">
                        <h4 className="text-xs font-bold text-on-surface leading-tight">{item.name}</h4>
                        <p className="text-[11px] text-outline font-medium">Pemasok: {item.seller}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-surface-container-high">
                          <span className="text-xs font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                          <div className="flex items-center gap-2 bg-white border rounded-lg p-1 shadow-sm">
                            <button onClick={() => updateQuantity(item.productId, item.unit === "kg" ? -5 : -1)} className="p-0.5 hover:bg-surface-container-high rounded"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-mono font-bold px-1">{item.quantity} {item.unit}</span>
                            <button onClick={() => updateQuantity(item.productId, item.unit === "kg" ? 5 : 1)} className="p-0.5 hover:bg-surface-container-high rounded"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {checkoutStep === "payment" && (
                <form onSubmit={handleFinalPaymentSubmit} className="flex-1 overflow-y-auto py-4 space-y-5">
                  <div className="bg-emerald-950 text-emerald-100 p-3.5 rounded-xl border border-emerald-900 space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Pilih Jalur Kliring Kontrak</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setPaymentRoute("nasional")} className={`p-2 rounded-lg text-xs font-bold text-center border transition-all ${paymentRoute === "nasional" ? "bg-white text-stone-950 border-white shadow-sm" : "bg-emerald-900/40 text-emerald-300 border-emerald-800"}`}>🇮🇩 Bank Domestik</button>
                      <button type="button" onClick={() => setPaymentRoute("internasional")} className={`p-2 rounded-lg text-xs font-bold text-center border transition-all ${paymentRoute === "internasional" ? "bg-white text-stone-950 border-white shadow-sm" : "bg-emerald-900/40 text-emerald-300 border-emerald-800"}`}>🌐 Visa Internasional</button>
                    </div>
                  </div>

                  {paymentRoute === "nasional" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-outline uppercase">Pilih Bank Virtual Account</label>
                        <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full bg-white border border-sand-gray rounded-xl p-2.5 text-xs font-bold text-on-surface focus:outline-none focus:border-primary">
                          <option value="BCA">Bank Central Asia (BCA Corporate VA)</option>
                          <option value="Mandiri">Bank Mandiri (MCM Auto-Settlement)</option>
                          <option value="BNI">Bank Negara Indonesia (BNI Direct)</option>
                        </select>
                      </div>
                      <div className="p-3 bg-surface-container-low border rounded-xl text-[11px] text-outline flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p>Sistem ATSIRA akan otomatis menerbitkan nomor rekening VA unik untuk total invoice pengadaan ini.</p>
                      </div>
                    </div>
                  )}

                  {paymentRoute === "internasional" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      {hasSavedVisa ? (
                        <div className="p-4 bg-surface-container-low border-2 border-dashed border-primary rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-amber-500" /> Visa Korporat Terdeteksi</span>
                            <button type="button" onClick={() => setHasSavedVisa(false)} className="text-[10px] underline text-outline font-semibold">Ganti Kartu</button>
                          </div>
                          <p className="text-xs font-mono font-bold text-on-surface tracking-wider">**** **** **** {cardNumber.slice(-4)}</p>
                          <p className="text-[11px] text-outline">Anda tidak perlu mengisi ulang berkas. Jalur 3D-Secure Stripe di-bypass menggunakan token tersimpan.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-outline uppercase">Nomor Kartu Visa Korporat</label>
                            <div className="relative">
                              <Input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4121 5562 8891 0024" className="pl-10 font-mono text-xs font-bold" required />
                              <CreditCard className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-outline uppercase">Masa Berlaku</label>
                              <Input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" className="text-center font-bold text-xs" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-outline uppercase">CVV</label>
                              <Input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="•••" maxLength={3} className="text-center font-bold text-xs tracking-widest" required />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-outline flex items-center justify-center gap-1 bg-surface-container-low p-2 rounded-lg border border-dashed">
                    <Lock className="w-3 h-3 text-emerald-600" /> Secure B2B Checkout Enabled
                  </div>
                </form>
              )}

              {cart.length > 0 && (
                <div className="border-t pt-4 bg-white space-y-3">
                  <div className="flex justify-between text-sm font-bold text-on-surface">
                    <span>{checkoutStep === "cart" ? "Estimasi Kontrak:" : "Total Pembayaran:"}</span>
                    <span className="text-base font-bold text-primary">{formatCurrency(totalCartPrice)}</span>
                  </div>

                  {checkoutStep === "cart" ? (
                    <button 
                      onClick={() => setCheckoutStep("payment")}
                      className="w-full bg-primary text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow"
                    >
                      Lanjut ke Metode Pembayaran
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep("cart")}
                        className="bg-surface-container-high hover:bg-surface-container-highest font-bold text-xs px-3 rounded-xl text-on-surface"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={handleFinalPaymentSubmit}
                        disabled={isProcessing}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow"
                      >
                        {isProcessing ? "Memproses Otentikasi..." : paymentRoute === "nasional" ? `Konfirmasi Bayar VA ${selectedBank}` : "Otorisasi Pembayaran Visa"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL POP-UP SIMULASI CHECKOUT INSTAN (BELI LANGSUNG) */}
        {showDirectCheckout && selectedDirectProduct && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="bg-white border border-surface-container-high rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="border-b pb-2 flex justify-between items-center">
                <h2 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-500 stroke-amber-500" /> Checkout Kilat B2B
                </h2>
                <button 
                  onClick={() => { setShowDirectCheckout(false); setSelectedDirectProduct(null); }} 
                  className="text-xs text-outline hover:text-stone-900 font-bold"
                >
                  Batal
                </button>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border text-xs space-y-1.5">
                <p className="font-extrabold text-stone-950">{selectedDirectProduct.title}</p>
                <p className="text-outline flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5" /> {selectedDirectProduct.calculatedSeller}
                </p>
                <div className="pt-2 border-t flex justify-between font-bold text-stone-800">
                  <span>Subtotal Kontrak ({selectedDirectProduct.calculatedQty} {selectedDirectProduct.calculatedUnit}):</span>
                  <span className="text-primary">{formatCurrency(selectedDirectProduct.calculatedTotal)}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {/* VALID & SYNCED TAG LABEL */}
                <label className="font-bold text-stone-700 block">Metode Pembayaran Mandatori Vault</label>
                <select 
                  value={directPaymentMethod} 
                  onChange={(e) => setDirectPaymentMethod(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xl font-medium outline-none focus:border-stone-900 text-stone-800"
                >
                  <option value="BCA Corporate Virtual Account (Auto-Settlement)">BCA Corporate Virtual Account (Auto-Settlement)</option>
                  <option value="Mandiri MCM Escrow">Mandiri MCM Escrow</option>
                  <option value="Visa Corporate Credit Line">Visa Corporate Credit Line</option>
                </select>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleDirectPaymentSubmit}
                  disabled={isProcessing}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md group"
                >
                  <span>{isProcessing ? "Mengunci Saldo Vault..." : "Konfirmasi Pembayaran Instan"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL POP-UP SUKSES PEMBAYARAN */}
        {successReceipt && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl border border-surface-container-high shadow-2xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-black text-stone-950 tracking-tight">Kontrak Berhasil Dibayar!</h3>
                <p className="text-xs text-outline font-medium">Smart contract ATSIRA otomatis membentuk invoice berstatus <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">PAID</span>.</p>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left space-y-2.5 font-medium text-xs text-stone-700">
                <div className="flex justify-between items-center border-b pb-2 font-bold text-primary">
                  <span className="flex items-center gap-1"><Receipt className="w-4 h-4" /> Gateway Dokumen</span>
                  <span className="text-[11px] font-mono uppercase bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">{successReceipt.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Metode Kliring</span>
                  <span className="text-stone-950 font-bold">{successReceipt.methodDetail}</span>
                </div>
                {successReceipt.type === "internasional" && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Token Status</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">3D-Secure Bypassed (Saved)</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t font-bold text-sm">
                  <span className="text-stone-950">Total Dana Terpotong</span>
                  <span className="text-emerald-800 text-base font-black">{formatCurrency(successReceipt.amount)}</span>
                </div>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => setSuccessReceipt(null)}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                  <span>Selesai & Masuk Antrean Sourcing</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}