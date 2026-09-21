const fs = require('fs');

const content = `"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Store, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  X,
  AlertTriangle,
  Layers,
  Droplet,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  FlaskConical,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatIDR } from "@/lib/mock";
import { NilamTraceQR } from "@/components/shared/NilamTraceQR";
import { useAuthStore } from "@/lib/store";

export default function MyProductsPage() {
  const supabase = createSupabaseBrowserClient();
  const { user } = useAuthStore();
  const isPetani = user?.role === "petani";

  const [searchQuery, setSearchQuery] = useState("");
  // Jika petani, tab otomatis di-lock ke 'raw'. Jika UMKM (seller), tab di-lock ke 'finished'
  const [activeTab, setActiveTab] = useState<"all" | "finished" | "raw">(isPetani ? "raw" : "finished");
  const [mounted, setMounted] = useState(false);
  
  // STATE DATABASE SUPABASE
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // STATE NAVIGASI & POPUP
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [showArcForm, setShowArcForm] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);

  // FORM INPUT STATES
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("Parfum Wewangian");
  const [formGrade, setFormGrade] = useState<"Grade A" | "Grade B" | "Grade C">("Grade B");
  const [formType, setFormType] = useState<"finished" | "raw">(isPetani ? "raw" : "finished");
  
  // ARC FORM STATES
  const [arcPA, setArcPA] = useState("");
  const [arcDesc, setArcDesc] = useState("");

  // STATE FOTO PRODUK
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    return () => setMounted(false);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil produk:", error.message);
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
        batchId: item.qr_batch_id || item.id,
        isVerified: item.is_verified || false
      }));
      setProductsList(formatted);
    }
    setLoading(false);
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = Date.now() + "-" + Math.random() + "." + fileExt;
      const filePath = "products/" + fileName;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        return null;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error("Upload fail:", err);
      return null;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user) {
      alert("Silakan login terlebih dahulu!");
      setSubmitting(false);
      return;
    }

    const isRawType = formType === "raw";
    let finalImageUrl = isRawType ? "/images/products/minyak nilam.png" : "/images/products/parfume1.png";

    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    // Short QR ID
    const shortId = "BCH-" + Math.random().toString(36).substring(2, 7).toUpperCase();

    const { error } = await supabase.from("products").insert([
      {
        title: formTitle,
        price: Number(formPrice),
        stock: Number(formStock),
        unit: isRawType ? "kg" : "botol",
        category: isRawType ? "Minyak Mentah (Crude Oil)" : formCategory,
        image_url: finalImageUrl,
        is_raw: isRawType,
        seller_id: user.id,
        qr_batch_id: shortId,
      },
    ]);

    if (error) {
      alert("Gagal menyimpan produk: " + error.message);
    } else {
      await fetchProducts(); 
      setIsAddPageOpen(false);
      resetForm();
    }
    setSubmitting(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const targetTable = editingProduct.isRaw ? "raw_oil_listings" : "finished_products";
    const updateData = editingProduct.isRaw
      ? { title: formTitle, price_per_kg: Number(formPrice), stock_kg: Number(formStock) }
      : { title: formTitle, price: Number(formPrice), stock: Number(formStock) };

    const { error } = await supabase
      .from(targetTable)
      .update(updateData)
      .eq("id", editingProduct.id);

    if (error) {
      alert("Gagal update data: " + error.message);
    } else {
      await fetchProducts();
      setEditingProduct(null);
      resetForm();
    }
    setSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setSubmitting(true);

    const targetTable = deletingProduct.isRaw ? "raw_oil_listings" : "finished_products";
    const { error } = await supabase
      .from(targetTable)
      .delete()
      .eq("id", deletingProduct.id);

    if (error) {
      alert("Gagal menghapus produk: " + error.message);
    } else {
      await fetchProducts();
      setDeletingProduct(null);
    }
    setSubmitting(false);
  };

  const submitToARC = () => {
    alert("Pengajuan lab untuk produk " + viewingProduct.title + " sedang diproses. Silakan kirim pesan ke peneliti.");
    setShowArcForm(false);
    setViewingProduct(null);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormPrice("");
    setFormStock("");
    setSelectedFile(null);
    setImagePreview(null);
  };

  const filteredProducts = productsList.filter((product: any) => {
    const title = product?.title?.toLowerCase() ?? "";
    const category = product?.category?.toLowerCase() ?? "";
    const search = searchQuery.toLowerCase();
    const matchesSearch = title.includes(search) || category.includes(search);

    if (!matchesSearch) return false;
    
    // Hard lock view based on role
    if (isPetani && !product.isRaw) return false;
    if (!isPetani && product.isRaw) return false;

    return true;
  });

  return (
    <DashboardShell role={(user?.role as any) ?? "umkm"}>
      {isAddPageOpen ? (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-10">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => setIsAddPageOpen(false)} className="p-2 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
              <ArrowLeft className="w-4 h-4 text-stone-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-stone-900 font-display">Tambah Produk Baru</h1>
              <p className="text-sm text-stone-500">Masukkan detail produk untuk ditambahkan ke etalase Anda.</p>
            </div>
          </div>
          
          <form onSubmit={handleAddProduct}>
            <Card className="bg-white border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 space-y-8">
                
                {/* 1. Tipe Produk (Hidden & Locked) */}
                
                {/* 2. Informasi Dasar */}
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Informasi Dasar</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1.5">Nama Produk</label>
                      <Input 
                        required 
                        value={formTitle} 
                        onChange={e => setFormTitle(e.target.value)} 
                        placeholder={isPetani ? "Contoh: Minyak Nilam Super Gayo" : "Contoh: Parfum Eksklusif Nilam"} 
                        className="bg-stone-50" 
                      />
                    </div>

                    {!isPetani && (
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1.5">Kategori Produk Retail</label>
                        <select 
                          className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 transition-colors"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          <option>Parfum Wewangian</option>
                          <option>Sabun & Perawatan Tubuh</option>
                          <option>Aromaterapi & Diffuser</option>
                          <option>Lainnya</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* 3. Harga & Stok */}
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Harga & Stok</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1.5">Harga per {isPetani ? "Kg" : "Pcs"}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-stone-500 font-medium text-sm">Rp</span>
                        <Input 
                          required 
                          type="number"
                          value={formPrice} 
                          onChange={e => setFormPrice(e.target.value)} 
                          className="pl-9 bg-stone-50" 
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1.5">Jumlah Stok ({isPetani ? "Kg" : "Pcs"})</label>
                      <Input 
                        required 
                        type="number"
                        value={formStock} 
                        onChange={e => setFormStock(e.target.value)} 
                        className="bg-stone-50" 
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* 4. Upload Foto Produk */}
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-emerald-600"/> Foto Produk</h3>
                  <div className="max-w-xl">
                    <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-stone-200 border-dashed rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer overflow-hidden group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-bold">Ganti Foto</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-stone-500">
                          <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
                          <p className="mb-1 text-sm"><span className="font-bold">Klik untuk upload</span> foto</p>
                          <p className="text-xs opacity-70">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 md:p-6 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddPageOpen(false)}>Batal</Button>
                <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Menyimpan...</> : "Simpan Produk"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-stone-900 font-display">Katalog Produk Saya</h1>
              <p className="text-sm text-stone-500 mt-1">Kelola stok barang dagangan {isPetani ? "hasil sulingan mentah" : "produk jadi retail"} Anda di sini.</p>
            </div>
            <Button onClick={() => { setFormType(isPetani ? "raw" : "finished"); setIsAddPageOpen(true); }} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-10 px-5 shadow-sm rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Produk Baru
            </Button>
          </div>

          <Card className="p-4 bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex bg-stone-100 p-1 rounded-lg w-full md:w-auto text-xs font-bold">
                <div className="px-4 py-1.5 rounded-md bg-white text-stone-900 shadow-sm">
                  {isPetani ? "Minyak Mentah (Murni)" : "Produk Jadi (Retail)"} ({productsList.length})
                </div>
              </div>
              
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama produk Anda..." 
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-600" />
              <p className="font-medium text-sm">Memuat data produk...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="font-bold text-stone-800 mb-1">Tidak ada produk</h3>
              <p className="text-sm text-stone-500 mb-4 max-w-sm">Anda belum menambahkan produk apapun atau pencarian tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col">
                  
                  {/* FOTO PRODUK */}
                  <div className="h-44 md:h-52 bg-stone-100 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    
                    <div className="absolute top-3 left-3">
                      {product.isRaw ? (
                        <span className="bg-amber-900/80 backdrop-blur-md text-amber-100 text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider">
                          MINYAK MENTAH
                        </span>
                      ) : (
                        <span className="bg-emerald-900/80 backdrop-blur-md text-emerald-100 text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider">
                          PRODUK JADI
                        </span>
                      )}
                    </div>
                    {product.isVerified && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-sm">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* KONTEN KARTU */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">{product.category}</span>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight mb-3 line-clamp-2">{product.title}</h3>
                    
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-[10px] text-stone-500 font-medium">Stok:</p>
                          <p className="text-xs font-bold text-stone-700">{product.stock} {product.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[13px] font-black text-stone-900">{formatIDR(product.price)}</p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS GRID */}
                      <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-stone-100">
                        <button onClick={() => setViewingProduct(product)} className="p-2 border border-stone-200 rounded-md hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-stone-500 flex justify-center transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { openEditModal(product); }} className="p-2 border border-stone-200 rounded-md hover:bg-stone-50 text-stone-500 flex justify-center transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeletingProduct(product)} className="p-2 border border-stone-200 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-stone-400 flex justify-center transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        <NilamTraceQR
                          batchId={product.batchId || product.id}
                          productName={product.title}
                          variant="icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODAL EDIT, DELETE, DETAIL */}
          {mounted && typeof document !== "undefined" && (
            <>
              {/* EDIT MODAL */}
              {editingProduct && createPortal(
                <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0 top-0 left-0" style={{ zIndex: 999999 }}>
                  <div className="bg-white border border-stone-200 rounded-xl max-w-md w-full overflow-hidden shadow-2xl p-6 text-stone-900 mx-4">
                    <h2 className="text-base font-bold text-stone-900 mb-4">Ubah Data Barang</h2>
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Nama Produk</label>
                        <Input required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Harga (Rp)</label>
                          <Input required type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Stok ({editingProduct.unit})</label>
                          <Input required type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingProduct(null)}>Batal</Button>
                        <Button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800" disabled={submitting}>
                          {submitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>, document.body
              )}
              
              {/* DELETE MODAL */}
              {deletingProduct && createPortal(
                <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0 top-0 left-0" style={{ zIndex: 999999 }}>
                  <div className="bg-white border border-stone-200 rounded-xl max-w-sm w-full overflow-hidden shadow-2xl p-6 text-stone-900 mx-4 text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h2 className="text-base font-bold text-stone-900 mb-2">Hapus Produk?</h2>
                    <p className="text-sm text-stone-500 mb-6">Apakah Anda yakin ingin menghapus <span className="font-bold text-stone-700">{deletingProduct.title}</span>? Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setDeletingProduct(null)}>Batal</Button>
                      <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={submitting}>
                        {submitting ? "Menghapus..." : "Ya, Hapus"}
                      </Button>
                    </div>
                  </div>
                </div>, document.body
              )}

              {/* VIEW DETAIL MODAL */}
              {viewingProduct && createPortal(
                <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0 top-0 left-0" style={{ zIndex: 999999 }}>
                  <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl mx-4 max-h-[90vh] flex flex-col relative">
                    <button onClick={() => {setViewingProduct(null); setShowArcForm(false);}} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="h-48 bg-stone-100 relative shrink-0">
                      <img src={viewingProduct.imageUrl} alt={viewingProduct.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                      {!showArcForm ? (
                        <>
                          <div className="mb-6">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{viewingProduct.category}</span>
                            <h2 className="text-xl font-black text-stone-900 leading-tight">{viewingProduct.title}</h2>
                            <p className="text-sm text-stone-500 mt-2">{viewingProduct.description || "Tidak ada deskripsi produk."}</p>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl mb-6 border border-stone-100">
                            <div>
                              <p className="text-xs text-stone-500 font-bold mb-1">Harga Jual</p>
                              <p className="text-lg font-black text-emerald-700">{formatIDR(viewingProduct.price)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-stone-500 font-bold mb-1">Stok Tersedia</p>
                              <p className="text-lg font-black text-stone-900">{viewingProduct.stock} {viewingProduct.unit}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button onClick={() => setShowArcForm(true)} className="w-full py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold flex items-center justify-center gap-2 transition-colors">
                              <FlaskConical className="w-4 h-4" /> Kirimkan produk ke ARC
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="animate-fadeIn">
                          <button onClick={() => setShowArcForm(false)} className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 mb-4">
                            <ArrowLeft className="w-3 h-3" /> Kembali ke detail
                          </button>
                          
                          <h3 className="font-bold text-stone-900 text-lg mb-1">Pengajuan Uji Lab ARC</h3>
                          <p className="text-xs text-stone-500 mb-6">Lengkapi data awal sebelum sampel dikirim secara fisik ke laboratorium Atsiri Research Center.</p>
                          
                          <div className="space-y-4 mb-6">
                            <div>
                              <label className="text-xs font-bold text-stone-700 block mb-1">Kadar PA (Estimasi Anda) - Opsional</label>
                              <Input type="number" placeholder="Contoh: 32" value={arcPA} onChange={(e) => setArcPA(e.target.value)} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-stone-700 block mb-1">Catatan Tambahan</label>
                              <textarea 
                                rows={3}
                                className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                                placeholder="Jelaskan metode suling atau detail lainnya..."
                                value={arcDesc}
                                onChange={(e) => setArcDesc(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                            <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                              <strong className="block mb-1">Penting:</strong>
                              Kirimkan sampel fisik produk ini secara langsung ke alamat ARC-USK. Setelah form ini disimpan, segera hubungi pihak lab melalui atSira Connect.
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button onClick={submitToARC} className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center transition-colors">
                              Simpan Pengajuan
                            </button>
                            <Link href="/dashboard/community" className="w-full py-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold flex items-center justify-center gap-2 transition-colors">
                              <MessageSquare className="w-4 h-4" /> Hubungi Lab via atSira Connect
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>, document.body
              )}
            </>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
`;

fs.writeFileSync('app/dashboard/seller/produk/page.tsx', content, 'utf8');
