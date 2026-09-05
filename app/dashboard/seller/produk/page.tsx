"use client";

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
  Loader2
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatIDR } from "@/lib/mock";

export default function MyProductsPage() {
  const supabase = createSupabaseBrowserClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "finished" | "raw">("all");
  const [mounted, setMounted] = useState(false);
  
  // STATE DATABASE SUPABASE
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // STATE NAVIGASI & POPUP
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);

  // FORM INPUT STATES
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategory, setFormCategory] = useState("Parfum Wewangian");
  const [formType, setFormType] = useState<"finished" | "raw">("finished");
  
  // STATE FOTO PRODUK
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    return () => setMounted(false);
  }, []);

  // 1. AMBIL DATA DARI SUPABASE
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil produk:", error.message);
    } else {
      // Mapping field dari Supabase agar sesuai dengan UI kamu
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
        seller_id: item.seller_id
      }));
      setProductsList(formatted);
    }
    setLoading(false);
  };

  // 2. FUNGSI UPLOAD FOTO KE SUPABASE STORAGE
  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

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

  // HANDLER PILIH FOTO
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 3. HANDLER TAMBAH PRODUK BARU
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      setSubmitting(false);
      return;
    }

    const isRawType = formType === "raw";
    let finalImageUrl = isRawType ? "/images/products/minyak nilam.png" : "/images/products/parfume1.png";

    // Upload ke Supabase Storage jika ada file yang dipilih
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    // Insert ke View 'products'
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
      },
    ]);

    if (error) {
      alert("Gagal menyimpan produk: " + error.message);
    } else {
      await fetchProducts(); // Refresh data asli dari database
      setIsAddPageOpen(false);
      resetForm();
    }
    setSubmitting(false);
  };

  // 4. HANDLER EDIT & HAPUS
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormPrice(String(product.price));
    setFormStock(String(product.stock));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Update ke tabel fisik berdasarkan tipe produk
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
    if (activeTab === "finished") return !product.isRaw;
    if (activeTab === "raw") return product.isRaw;
    return true;
  });

  // TAMPILAN 1: FORM TAMBAH PRODUK
  if (isAddPageOpen) {
    return (
      <DashboardShell role="umkm">
        <div className="max-w-3xl mx-auto w-full pb-16 pt-2">
          <button 
            onClick={() => setIsAddPageOpen(false)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold text-sm mb-6 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg transition-colors border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Kembali ke Daftar Produk
          </button>

          <Card className="bg-white border border-stone-200 shadow-md rounded-xl p-8 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h1 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-800 rounded-lg"><Plus className="w-5 h-5 stroke-[3]" /></span>
                Isi Data Produk Baru Anda
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Silakan isi kolom di bawah pelan-pelan. Teks dibuat besar agar mudah dibaca oleh Ayah/Ibu petani.
              </p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6 text-sm">
              <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <label className="block text-sm font-extrabold text-stone-900">
                  1. Pilih Jenis Barang Yang Ingin Dijual:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <div 
                    onClick={() => setFormType("finished")}
                    className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col justify-between transition-all ${
                      formType === "finished" ? "bg-emerald-50/50 border-emerald-600 shadow-sm" : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className={`w-5 h-5 ${formType === "finished" ? "text-emerald-700" : "text-stone-400"}`} />
                      <span className="font-bold text-stone-900">Produk Jadi / Olahan</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-normal">Contoh: Parfum siap pakai, sabun herbal, diffuser wewangian, lilin aroma.</p>
                  </div>

                  <div 
                    onClick={() => setFormType("raw")}
                    className={`p-4 rounded-lg border-2 cursor-pointer flex flex-col justify-between transition-all ${
                      formType === "raw" ? "bg-amber-50/50 border-amber-600 shadow-sm" : "bg-white border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className={`w-5 h-5 ${formType === "raw" ? "text-amber-700" : "text-stone-400"}`} />
                      <span className="font-bold text-stone-900">Minyak Mentah Murni</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-normal">Contoh: Minyak Nilam murni hasil sulingan curah yang dijual per kilogram (kg).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-extrabold text-stone-900">
                  2. Unggah Foto / Gambar Produk:
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50/50">
                  <div className="w-28 h-28 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Pratinjau barang" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left space-y-1">
                    <label className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-800 font-extrabold text-xs py-2 px-4 border border-stone-300 rounded-lg shadow-sm cursor-pointer transition-colors">
                      <UploadCloud className="w-4 h-4 text-emerald-700" />
                      {imagePreview ? "Ganti Foto Produk" : "Pilih Foto Dari HP / Laptop"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                    <p className="text-xs text-stone-500 font-medium">
                      Bisa langsung pakai kamera HP atau ambil dari galeri foto. Usahakan foto terlihat terang dan jelas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-extrabold text-stone-900">
                  3. Tulis Nama Lengkap Produk / Barang:
                </label>
                <Input 
                  placeholder={formType === "raw" ? "Contoh: Minyak Nilam Murni Super Gayo Kelas A" : "Contoh: Parfum Nilam Wangi Premium 30ml"} 
                  value={formTitle} 
                  onChange={(e) => setFormTitle(e.target.value)} 
                  className="bg-white border-stone-300 text-stone-950 text-sm p-3 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-600 font-medium rounded-lg h-11" 
                  required 
                />
              </div>

              {formType === "finished" && (
                <div className="space-y-2">
                  <label className="block text-sm font-extrabold text-stone-900">
                    4. Masukkan Jenis Kategori Barang:
                  </label>
                  <Input 
                    placeholder="Contoh: Parfum / Minyak Wangi / Kosmetik" 
                    value={formCategory} 
                    onChange={(e) => setFormCategory(e.target.value)} 
                    className="bg-white border-stone-300 text-stone-950 text-sm p-3 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-600 font-medium rounded-lg h-11" 
                    required 
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="block text-sm font-extrabold text-stone-900">
                    {formType === "raw" ? "5. Harga Jual per Kilo (Rp):" : "5. Harga Jual per Botol/Pcs (Rp):"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-stone-500 font-bold text-xs">Rp</span>
                    <Input 
                      type="number" 
                      placeholder="Contoh: 150000" 
                      value={formPrice} 
                      onChange={(e) => setFormPrice(e.target.value)} 
                      className="bg-white border-stone-300 text-stone-950 text-sm p-3 pl-10 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-600 font-bold rounded-lg h-11" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-extrabold text-stone-900">
                    6. Jumlah Stok Yang Tersedia saat ini:
                  </label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder={formType === "raw" ? "Contoh: 25" : "Contoh: 100"} 
                      value={formStock} 
                      onChange={(e) => setFormStock(e.target.value)} 
                      className="bg-white border-stone-300 text-stone-950 text-sm p-3 pr-16 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-600 font-bold rounded-lg h-11" 
                      required 
                    />
                    <span className="absolute right-3.5 top-3 text-stone-500 font-extrabold text-xs">
                      {formType === "raw" ? "Kg" : "Botol"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddPageOpen(false)} 
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 px-4 rounded-xl text-sm border border-stone-300 transition-colors order-2 sm:order-1"
                >
                  Batalkan & Kembali
                </button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl text-sm border-none shadow-md flex items-center justify-center gap-1.5 transition-colors order-1 sm:order-2 h-11"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
                  {submitting ? "Menyimpan ke Supabase..." : "Simpan Produk Masuk Katalog"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  // TAMPILAN 2: DAFTAR KATALOG UTAMA
  return (
    <DashboardShell role="umkm">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">Katalog Produk Saya</h1>
            <p className="text-xs text-stone-500 mt-1">
              Kelola stok barang dagangan hasil sulingan dan produk jadi retail Anda di sini.
            </p>
          </div>
          <Button 
            onClick={() => { resetForm(); setIsAddPageOpen(true); }}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5 self-start sm:self-auto border-none shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Tambah Produk Baru
          </Button>
        </div>

        <Card className="p-4 bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex bg-stone-100 p-1 rounded-lg w-full md:w-auto text-xs font-bold">
              <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 rounded-md transition-all ${activeTab === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                Semua Produk ({productsList.length})
              </button>
              <button onClick={() => setActiveTab("finished")} className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-1 ${activeTab === "finished" ? "bg-white text-emerald-800 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                <Layers className="w-3.5 h-3.5" /> Produk Jadi (Retail)
              </button>
              <button onClick={() => setActiveTab("raw")} className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-1 ${activeTab === "raw" ? "bg-white text-amber-700 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>
                <Droplet className="w-3.5 h-3.5" /> Minyak Mentah (Murni)
              </button>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                placeholder="Cari nama produk Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-stone-800"
              />
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="py-20 text-center text-stone-500 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
            <p className="text-xs font-semibold">Memuat produk dari Supabase...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12 border border-dashed border-stone-300 text-center text-stone-500 bg-stone-50/50 rounded-xl">
            <Store className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-700">Belum Ada Produk</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Produk berdasarkan kategori pilihan belum ditemukan.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product: any) => (
              <div 
                key={product.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${
                  product.isRaw ? "border-amber-200/70" : "border-stone-200"
                }`}
              >
                <div className="relative aspect-square bg-stone-50 overflow-hidden border-b border-stone-100">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border ${product.isRaw ? "bg-amber-950 text-amber-400 border-amber-900" : "bg-emerald-900 text-emerald-100 border-emerald-950"}`}>
                      {product.isRaw ? "Minyak Mentah" : "Produk Jadi"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 block truncate">{product.category}</span>
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">{product.title}</h3>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] text-stone-400">Stok: <strong className="text-stone-700 font-bold">{product.stock} {product.unit}</strong></span>
                      <span className="text-sm font-black text-stone-900">{formatIDR(product.price)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-stone-100">
                      <button onClick={() => setSelectedProduct(product)} className="p-2 border border-stone-200 rounded-md hover:bg-stone-50 text-stone-500 flex justify-center transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEditModal(product)} className="p-2 border border-stone-200 rounded-md hover:bg-stone-50 text-stone-500 flex justify-center transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeletingProduct(product)} className="p-2 border border-stone-200 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-stone-400 flex justify-center transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
            {editingProduct && createPortal(
              <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0 top-0 left-0" style={{ zIndex: 999999 }}>
                <div className="bg-white border border-stone-200 rounded-xl max-w-md w-full overflow-hidden shadow-2xl p-6 text-stone-900 space-y-4 mx-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-50 text-amber-800 rounded-lg"><Edit3 className="w-5 h-5 stroke-[2.5]" /></div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">Ubah Data Barang</h2>
                        <p className="text-[11px] text-stone-500">Perbarui informasi harga atau jumlah persediaan stok barang Anda.</p>
                      </div>
                    </div>
                    <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-stone-700">Nama Barang</label>
                      <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="bg-white border-stone-300 text-stone-900 text-sm p-2.5 focus:ring-2 focus:ring-emerald-600" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-stone-700">Harga Terkini (Rp)</label>
                        <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="bg-white border-stone-300 text-stone-900 text-xs p-2.5 font-mono focus:ring-2 focus:ring-emerald-600" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-stone-700">Jumlah Stok</label>
                        <Input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} className="bg-white border-stone-300 text-stone-900 text-xs p-2.5 font-mono focus:ring-2 focus:ring-emerald-600" required />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex gap-2">
                      <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2.5 rounded-lg text-xs transition-colors">Batal</button>
                      <Button type="submit" disabled={submitting} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-xs border-none transition-colors">
                        {submitting ? "Memperbarui..." : "Perbarui Data"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}

            {deletingProduct && createPortal(
              <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0 top-0 left-0" style={{ zIndex: 999999 }}>
                <div className="bg-white border border-stone-200 rounded-xl max-w-sm w-full overflow-hidden shadow-2xl p-6 text-center space-y-4 mx-4">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6 stroke-[2]" /></div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-stone-900">Yakin Ingin Menghapus Produk?</h3>
                    <p className="text-[12px] text-stone-600 leading-relaxed">
                      Apakah Anda benar-benar ingin menghapus produk <strong className="text-stone-900">"{deletingProduct.title}"</strong>? Data tidak bisa dikembalikan lagi.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-2 text-xs font-bold">
                    <button onClick={() => setDeletingProduct(null)} className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 py-2.5 rounded-lg transition-colors">Tidak, Simpan</button>
                    <button onClick={handleConfirmDelete} disabled={submitting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-colors border-none shadow-sm">
                      {submitting ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {selectedProduct && createPortal(
              <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm m-0 p-0 top-0 left-0" style={{ zIndex: 999999 }}>
                <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl border border-stone-200 relative p-5 space-y-4 mx-4">
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
                  <h2 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wide border-b pb-2">Detail Informasi Produk</h2>
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-48 object-cover rounded-lg bg-stone-50" />
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded ${selectedProduct.isRaw ? "bg-amber-50 text-amber-800 border-amber-200":"bg-emerald-50 text-emerald-800 border-emerald-200"}`}>{selectedProduct.isRaw ? "Minyak Mentah Murni":"Produk Olahan Jadi"}</span>
                    <h3 className="text-sm font-bold text-stone-900 mt-2">{selectedProduct.title}</h3>
                    <p className="text-[12px] text-stone-600 mt-1 leading-relaxed">{selectedProduct.description || "Informasi deskripsi belum ditambahkan."}</p>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg flex justify-between items-center text-xs font-semibold">
                    <div><p className="text-[10px] text-stone-400">Total Stok Saat Ini</p><p className="font-bold text-stone-800">{selectedProduct.stock} {selectedProduct.unit}</p></div>
                    <div className="text-right"><p className="text-[10px] text-stone-400">Harga Satuan</p><p className="font-black text-emerald-700 text-sm">{formatIDR(selectedProduct.price)}</p></div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}