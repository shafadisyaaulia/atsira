"use client";

import { useState } from "react";
import { 
  Package, 
  Search, 
  FileText, 
  User, 
  MapPin, 
  CheckCircle2, 
  TrendingUp,
  Building
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// 1. IMPORT DATA DAN HELPER YANG VALID SESUAI FILE MOCK ANDA
import { RAW_OIL_LISTINGS } from "@/lib/mock/products";
import { formatIDR } from "@/lib/mock";

export default function B2BSourcingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(5); // Default 5 kg sesuai minOrderKg terkecil
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // 2. FILTER DATA PENCARIAN BERDASARKAN PROPERTI ASLI MOCK (title, farmerId, region)
  const filteredProducts = (RAW_OIL_LISTINGS || []).filter((p: any) => {
    const title = p?.title?.toLowerCase() ?? "";
    const farmer = p?.farmerId?.toLowerCase() ?? "";
    const region = p?.region?.toLowerCase() ?? "";
    const search = searchQuery.toLowerCase();

    return title.includes(search) || farmer.includes(search) || region.includes(search);
  });

  // Kalkulasi total biaya menggunakan properti harga asli: pricePerKg
  const totalCost = selectedProduct ? (selectedProduct.pricePerKg * quantity) : 0;

  function handleCreateContract(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        setSelectedProduct(null);
      }, 3000);
    }, 1500);
  }

  return (
    <DashboardShell role="umkm">
      <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
        
        {/* HEADER MODUL */}
        <div>
          <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight">B2B Sourcing Panel</h1>
          <p className="text-xs text-stone-500 mt-1">
            Procure raw materials for patchouli crude oil directly from upstream verified farmer groups.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* SISI KIRI: DAFTAR BAHAN BAKU MENTAH */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-5 bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-600" /> RAW COMMODITIES AVAILABLE ( {filteredProducts.length} )
                </h2>
              </div>

              {/* PENCARIAN */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Search by product name, farmer, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs bg-stone-50 border-stone-200 focus:border-emerald-600"
                />
              </div>

              {/* LIST ITEM */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredProducts.length === 0 ? (
                  <p className="text-xs text-center text-stone-400 py-8">No crude oil supplies found.</p>
                ) : (
                  filteredProducts.map((product: any) => (
                    <div
                      key={product.id}
                      onClick={() => { 
                        setSelectedProduct(product); 
                        setQuantity(product.minOrderKg || 5);
                        setSuccessMessage(false); 
                      }}
                      className={`p-3.5 border rounded-xl flex gap-4 cursor-pointer transition-all ${
                        selectedProduct?.id === product.id
                          ? "border-emerald-600 bg-emerald-50/20 shadow-sm"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      {/* FOTO DARI MOCK (imageUrl) */}
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-100"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          {/* JUDUL DARI MOCK (title) */}
                          <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{product.title}</h3>
                          {/* HARGA DARI MOCK (pricePerKg) */}
                          <span className="text-xs font-mono font-black text-emerald-700 whitespace-nowrap">
                            {formatIDR(product.pricePerKg)} / kg
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{product.description}</p>
                        
                        {/* DATA PARAMETER ASLI PETANI */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] text-stone-500 font-medium">
                          <span className="flex items-center gap-0.5"><User className="w-3 h-3 text-stone-400" /> ID: {product.farmerId?.replace("farmer-", "")}</span>
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-stone-400" /> {product.region}</span>
                          {product.coa?.paLevel && (
                            <span className="flex items-center gap-0.5 text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                              PA: {product.coa.paLevel}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* SISI KANAN: CONTRACT NOTE SIMULATION */}
          <div className="md:col-span-5">
            <Card className="bg-stone-950 border border-stone-900 shadow-xl rounded-xl p-5 min-h-[480px] flex flex-col justify-between text-stone-200">
              
              {successMessage ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-emerald-400 my-auto animate-fade-in">
                  <CheckCircle2 className="w-14 h-14 mb-4 stroke-[1.5]" />
                  <p className="text-sm font-bold text-stone-100">Procurement Memorandum Drafted!</p>
                  <p className="text-[11px] text-stone-400 max-w-[280px] mt-1.5 leading-relaxed">
                    Nota kesepahaman kontrak grosir digital berhasil dibuat dan diteruskan ke akun kelompok tani terkait.
                  </p>
                </div>
              ) : !selectedProduct ? (
                <div className="flex flex-col items-center justify-center text-center py-24 text-stone-500 my-auto">
                  <FileText className="w-12 h-12 text-stone-800 mb-3 stroke-[1.2]" />
                  <p className="text-xs font-bold text-stone-300">Contract Note Simulation</p>
                  <p className="text-[11px] text-stone-600 max-w-[260px] mt-1 leading-relaxed">
                    Please click on one of the farmer's crude oil supplies on the left to draft a procurement memorandum.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateContract} className="space-y-4 flex flex-col justify-between h-full flex-1">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-850 pb-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" /> B2B SOURCING MEMO
                      </span>
                      <span className="text-[10px] font-mono bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                        {selectedProduct.grade} Grade
                      </span>
                    </div>

                    {/* METADATA FORM SESUAI PROPERTY BARU */}
                    <div className="bg-stone-900 border border-stone-850 p-3.5 rounded-lg space-y-2 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-stone-500">Material:</span><span className="text-stone-200 font-bold truncate max-w-[180px]">{selectedProduct.title}</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Farmer Account:</span><span className="text-stone-200">{selectedProduct.farmerId}</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Region Origin:</span><span className="text-stone-200">{selectedProduct.region}</span></div>
                      <div className="flex justify-between"><span className="text-stone-500">Analysis Method:</span><span className="text-stone-200">{selectedProduct.coa?.method}</span></div>
                    </div>

                    {/* INPUT VOLUMETRIK GROSIR */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wide flex justify-between">
                        <span>Sourcing Volume (kg)</span>
                        <span className="text-amber-400 font-normal italic">Min Order: {selectedProduct.minOrderKg} kg</span>
                      </label>
                      <Input
                        type="number"
                        min={selectedProduct.minOrderKg || 1}
                        max={selectedProduct.stockKg}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="bg-stone-900 border-stone-800 text-stone-200 text-xs font-mono focus:border-emerald-600 focus:ring-emerald-600"
                        required
                      />
                      <div className="text-[10px] text-stone-500 text-right">
                        Available Stock: {selectedProduct.stockKg} kg
                      </div>
                    </div>
                  </div>

                  {/* KALKULASI TOTAL AKHIR */}
                  <div className="pt-4 border-t border-stone-850 space-y-3 mt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" /> Estimated Deal:
                      </span>
                      <span className="text-xl font-mono font-black text-emerald-400">
                        {formatIDR(totalCost)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || quantity < (selectedProduct.minOrderKg || 1)}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 border-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Locking Procurement Rate...
                        </>
                      ) : (
                        "Generate Sourcing Contract Note"
                      )}
                    </Button>
                  </div>

                </form>
              )}

            </Card>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}