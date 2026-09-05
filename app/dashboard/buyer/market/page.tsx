"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Star, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Droplet,
  ArrowRight,
  ShoppingBag,
  Zap,
  Loader2,
  Store
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store";
import { formatIDR } from "@/lib/mock";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  seller_id?: string;
  unit: string;
}

export default function BuyerDashboardMarketplace() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { addItem } = useCartStore();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("Semua Grade");
  const [tab, setTab] = useState<"finished" | "raw">("finished");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    
    // Muat keranjang dari localStorage jika ada
    const savedCart = localStorage.getItem("atsira_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Gagal membaca local storage cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("atsira_cart", JSON.stringify(newCart));
  };

  // FETCH PRODUK DARI SUPABASE
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil produk marketplace:", error.message);
    } else {
      const formatted = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        stock: item.stock,
        unit: item.unit || (item.is_raw ? "kg" : "botol"),
        category: item.category,
        imageUrl: item.image_url || (item.is_raw ? "/images/products/minyak nilam.png" : "/images/products/parfume1.png"),
        isRaw: item.is_raw,
        description: item.description,
        seller_id: item.seller_id,
        seller: item.seller_id || "default_seller",
        region: "Aceh, Indonesia",
        grade: item.is_raw ? "Premium" : "Standard",
      }));
      setProductsList(formatted);
    }
    setLoading(false);
  };

  // FILTER PRODUK
  const filteredFinished = useMemo(() => {
    return productsList.filter((p) => {
      if (p.isRaw) return false;
      const title = p.title || "";
      const category = p.category || "";
      return title.toLowerCase().includes(query.toLowerCase()) || category.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, productsList]);

  const filteredRaw = useMemo(() => {
    return productsList.filter((p) => {
      if (!p.isRaw) return false;
      const title = p.title || "";
      const region = p.region || "";
      const matchQuery = title.toLowerCase().includes(query.toLowerCase()) || region.toLowerCase().includes(query.toLowerCase());
      const matchGrade = gradeFilter === "Semua Grade" || p.grade === gradeFilter;
      return matchQuery && matchGrade;
    });
  }, [query, gradeFilter, productsList]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // 1. TAMBAH KE KERANJANG LOKAL MARKETPLACE
  const handleAddToCart = (product: any) => {
    const minQty = product.isRaw ? 5 : 1;

    // Masukkan ke Zustand global cart store agar sinkron dengan /checkout
    addItem({
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      price: product.price,
      unit: product.unit,
      qty: minQty,
      category: product.isRaw ? "raw-oil" : "finished-product",
    });

    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, index) => 
        index === existingIndex ? { ...item, quantity: item.quantity + minQty } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product.id,
          name: product.title,
          price: product.price,
          quantity: minQty,
          seller: product.seller,
          seller_id: product.seller_id,
          unit: product.unit
        }
      ];
    }

    updateCartState(updatedCart);
    setToastMessage(`"${product.title}" berhasil ditambahkan ke keranjang!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    updateCartState(updated);
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 2. NAVIGASI DARI KERANJANG KE HALAMAN CHECKOUT
  const handleGoToCheckoutPage = () => {
    if (cart.length === 0) return;
    router.push("/checkout");
  };

  // 3. BELI INSTAN (BUY NOW) -> LANGSUNG KE HALAMAN CHECKOUT
  const handleBuyNow = (product: any) => {
    const pQty = product.isRaw ? 5 : 1;

    addItem({
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      price: product.price,
      unit: product.unit,
      qty: pQty,
      category: product.isRaw ? "raw-oil" : "finished-product",
    });

    // Pindah ke halaman checkout lengkap dengan URL params
    const queryParams = new URLSearchParams({
      productId: product.id,
      name: product.title,
      price: product.price.toString(),
      unit: product.unit,
      category: product.isRaw ? "raw-oil" : "finished-product",
      image: product.imageUrl,
    });

    router.push(`/checkout?${queryParams.toString()}`);
  };

  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 relative animate-in fade-in duration-200 pb-12">
        
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

        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
          <div>
            <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">Sourcing Hub & Marketplace</h1>
            <p className="text-xs text-stone-500 mt-0.5">Jelajahi komoditas minyak nilam & produk turunan resmi ATSIRA.</p>
          </div>

          <Button onClick={() => setIsCartOpen(true)} className="relative bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 py-2.5 px-4 shadow-sm">
            <ShoppingCart className="w-4 h-4" />
            <span>Keranjang Pengadaan</span>
            {cart.length > 0 && (
              <span className="bg-amber-500 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white ml-1">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </Button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder='Cari komoditas, contoh: "Parfum", "Nilam Murni", "Grade A"...'
              className="pl-11 rounded-xl bg-stone-50 border-stone-200 text-xs font-medium focus:bg-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {tab === "raw" && (
            <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="md:w-56 rounded-xl bg-stone-50 border-stone-200 text-xs font-medium">
              <option value="Semua Grade">Semua Kualitas Grade</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
            </Select>
          )}
        </div>

        {/* TAB KATALOG */}
        <div className="flex gap-4 border-b border-stone-200">
          <button 
            onClick={() => setTab("finished")} 
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              tab === "finished" ? "border-emerald-700 text-emerald-800" : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            Produk Jadi Turunan Retail ({productsList.filter(p => !p.isRaw).length})
          </button>
          <button 
            onClick={() => setTab("raw")} 
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              tab === "raw" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            Minyak Nilam Murni Bulk ({productsList.filter(p => p.isRaw).length})
          </button>
        </div>

        {/* CONTENT STATES */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
            <p className="text-xs font-semibold">Mengambil katalog produk dari database...</p>
          </div>
        ) : (
          <>
            {/* GRID PRODUK JADI */}
            {tab === "finished" && (
              filteredFinished.length === 0 ? (
                <Card className="p-12 border border-dashed border-stone-300 text-center text-stone-500 bg-stone-50/50 rounded-xl">
                  <Store className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700">Belum Ada Produk Jadi</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Produk olahan turunan akan tampil di sini.</p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredFinished.map((p) => {
                    const isFav = favorites.includes(p.id);
                    return (
                      <Card key={p.id} className="relative overflow-hidden h-full flex flex-col justify-between rounded-xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-all group">
                        <button 
                          onClick={() => toggleFavorite(p.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full border border-stone-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-105 z-10"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? "text-amber-500 fill-amber-500" : "text-stone-300"}`} />
                        </button>

                        <div>
                          <div className="relative aspect-square overflow-hidden bg-stone-50 border-b border-stone-100">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border bg-emerald-900 text-emerald-100 border-emerald-950">
                                Retail
                              </span>
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <span className="text-[10px] font-bold text-stone-400 block truncate">{p.category}</span>
                            <h3 className="font-bold text-stone-900 text-xs leading-snug line-clamp-2 h-8">{p.title}</h3>
                            <p className="text-[10px] text-stone-500">Stok: <strong className="text-stone-700">{p.stock} {p.unit}</strong></p>
                          </div>
                        </div>

                        <div className="p-4 bg-stone-50/80 border-t border-stone-100 space-y-3">
                          <p className="font-black text-stone-900 text-sm">{formatIDR(p.price)} <span className="text-[10px] font-normal text-stone-400">/{p.unit}</span></p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleAddToCart(p)} className="text-[11px] font-bold rounded-lg h-8 border-stone-200 bg-white text-stone-700">
                              + Keranjang
                            </Button>
                            <Button size="sm" onClick={() => handleBuyNow(p)} className="text-[11px] font-bold rounded-lg h-8 bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 fill-amber-400 stroke-amber-400" /> Beli
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )
            )}

            {/* GRID PRODUK RAW */}
            {tab === "raw" && (
              filteredRaw.length === 0 ? (
                <Card className="p-12 border border-dashed border-stone-300 text-center text-stone-500 bg-stone-50/50 rounded-xl">
                  <Droplet className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700">Belum Ada Minyak Nilam Murni</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Minyak mentah hasil distilasi akan muncul di sini.</p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredRaw.map((p) => {
                    const isFav = favorites.includes(p.id);
                    return (
                      <Card key={p.id} className="relative overflow-hidden h-full flex flex-col justify-between rounded-xl border border-amber-200/80 bg-white shadow-sm hover:shadow-md transition-all group">
                        <button 
                          onClick={() => toggleFavorite(p.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full border border-stone-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-105 z-10"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? "text-amber-500 fill-amber-500" : "text-stone-300"}`} />
                        </button>

                        <div>
                          <div className="relative aspect-square overflow-hidden bg-stone-50 border-b border-stone-100">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border bg-amber-950 text-amber-400 border-amber-900">
                                Bulk Raw
                              </span>
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <span className="text-[10px] font-bold text-stone-400 block truncate">{p.category}</span>
                            <h3 className="font-bold text-stone-900 text-xs leading-snug line-clamp-2 h-8">{p.title}</h3>
                            <p className="text-[10px] text-stone-500">Persediaan: <strong className="text-stone-700">{p.stock} kg</strong></p>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50/40 border-t border-amber-100 space-y-3">
                          <p className="font-black text-stone-900 text-sm">{formatIDR(p.price)} <span className="text-[10px] font-normal text-stone-400">/kg</span></p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleAddToCart(p)} className="text-[11px] font-bold rounded-lg h-8 border-stone-200 bg-white text-stone-700">
                              + Sourcing
                            </Button>
                            <Button size="sm" onClick={() => handleBuyNow(p)} className="text-[11px] font-bold rounded-lg h-8 bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 fill-amber-400 stroke-amber-400" /> Beli
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )
            )}
          </>
        )}

        {/* LACI KERANJANG SOURCING */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-5 animate-in slide-in-from-right duration-200">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-tight flex items-center gap-2 text-stone-900">
                  <ShoppingCart className="w-4 h-4 text-emerald-700" /> Ringkasan Keranjang Pengadaan
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 space-y-2">
                    <Droplet className="w-8 h-8 mx-auto stroke-1 animate-pulse" />
                    <p className="text-xs font-bold">Keranjang pengadaan Anda kosong.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.productId} className="border border-stone-200 p-3 rounded-xl bg-stone-50 space-y-2">
                      <h4 className="text-xs font-bold text-stone-900 leading-tight">{item.name}</h4>
                      <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                        <span className="text-xs font-bold text-emerald-800">{formatIDR(item.price * item.quantity)}</span>
                        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-1 shadow-sm">
                          <button onClick={() => updateQuantity(item.productId, item.unit === "kg" ? -5 : -1)} className="p-0.5 hover:bg-stone-100 rounded">
                            <Minus className="w-3 h-3 text-stone-600" />
                          </button>
                          <span className="text-xs font-mono font-bold px-1 text-stone-800">{item.quantity} {item.unit}</span>
                          <button onClick={() => updateQuantity(item.productId, item.unit === "kg" ? 5 : 1)} className="p-0.5 hover:bg-stone-100 rounded">
                            <Plus className="w-3 h-3 text-stone-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-stone-100 pt-4 bg-white space-y-3">
                  <div className="flex justify-between text-xs font-bold text-stone-900">
                    <span>Estimasi Subtotal:</span>
                    <span className="text-sm font-black text-emerald-800">{formatIDR(totalCartPrice)}</span>
                  </div>

                  <button 
                    onClick={handleGoToCheckoutPage}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow group transition-all"
                  >
                    <span>Lanjut ke Halaman Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}