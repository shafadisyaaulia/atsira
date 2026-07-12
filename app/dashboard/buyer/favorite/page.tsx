"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Trash2, 
  Building, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// MOCK DATA PRODUK FAVORIT BUYER
const INITIAL_FAVORITES = [
  {
    id: "PROD-001",
    name: "Minyak Nilam Murni (Crude Patchouli Oil) - Kelas A",
    seller: "Kelompok Tani Nilam Gayo Mandiri",
    location: "Takengon, Aceh Tengah",
    price: "Rp 550.000",
    unit: "Kg",
    rating: "4.9",
    stock: "Tersedia",
    grade: "Grade A (PA > 32%)"
  },
  {
    id: "PROD-002",
    name: "Parfum Nilam Premium Royal Wood 30ml",
    seller: "UMKM Atsiri Wangi Banda",
    location: "Banda Aceh",
    price: "Rp 150.000",
    unit: "Botol",
    rating: "4.8",
    stock: "Tersedia",
    grade: "Retail Premium"
  }
];

export default function BuyerFavoritePage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const filteredFavorites = favorites.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="buyer">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12 animate-in fade-in duration-200">
        
        {/* HEADER UTAMA */}
        <div className="border-b border-stone-100 pb-4">
          <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Produk & Supplier Favorit
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Daftar komoditas pilihan dan produsen terpercaya (*whitelisted*) untuk mempercepat proses *repeat order* perusahaan Anda.
          </p>
        </div>

        {/* KONTROL PENCARIAN */}
        <Card className="p-4 bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              placeholder="Cari produk favorit Anda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium text-stone-800"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium hidden sm:block">
            Menampilkan <strong>{filteredFavorites.length}</strong> produk pilihan
          </span>
        </Card>

        {/* DAFTAR KARTU PRODUK */}
        {filteredFavorites.length === 0 ? (
          <Card className="p-12 border border-dashed border-stone-300 text-center text-stone-500 bg-stone-50/50 rounded-xl">
            <Star className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-700">Belum Ada Produk Favorit</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Klik ikon bintang pada marketplace untuk menambahkan produk langganan.</p>
            <Link href="/dashboard/buyer/market" className="inline-block mt-4">
              <Button className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-lg">
                Jelajahi Marketplace
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFavorites.map((product) => (
              <Card 
                key={product.id}
                className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Bagian Atas: Kategori & Tombol Hapus */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {product.grade}
                    </span>
                    <h3 className="text-sm font-black text-stone-900 tracking-tight mt-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bagian Tengah: Info Produsen */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                    {product.seller}
                  </p>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {product.location}
                  </p>
                </div>

                {/* Bagian Bawah: Harga & Tombol Aksi */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-50 gap-2">
                  <div>
                    <p className="text-[10px] text-stone-400 font-medium">Estimasi Harga Kontrak</p>
                    <p className="text-sm font-black text-emerald-800">
                      {product.price}<span className="text-stone-400 font-normal text-xs"> / {product.unit}</span>
                    </p>
                  </div>

                  <Link href="/dashboard/buyer/market">
                    <button className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2 px-3.5 rounded-lg shadow-sm transition-colors group">
                      <span>Pesan Ulang</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>

              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardShell>
  );
}