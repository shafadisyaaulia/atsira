import { ProductDetailClient } from "@/components/shared/ProductDetailClient";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS } from "@/lib/mock/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const idFromUrl = resolvedParams.id;

  // Pembersihan ID URL dari spasi atau encoding aneh
  const decodedId = decodeURIComponent(idFromUrl).trim().toLowerCase();

  // Cari data produk di ALL_PRODUCTS yang id-nya COCOK PERSIS dengan URL
  const matchedProduct = ALL_PRODUCTS.find((p: any) => {
    return String(p.id).toLowerCase() === decodedId;
  });

  // Proteksi jika data tidak ada di database produk
  if (!matchedProduct) {
    notFound();
  }

  // AMAN DARI TYPE ERROR: Menggunakan type assertion (as any) untuk properti dinamis
  const isArcVerified = 
    (matchedProduct as any).badges?.includes("USK Verified") || 
    (matchedProduct as any).verifiedBy === "arc" ||
    String(matchedProduct.id).includes("gayowood") || 
    String(matchedProduct.id).includes("usk");

  const defaultMethod = isArcVerified 
    ? "Laboratorium Resmi GC-MS (ARC-USK)" 
    : "NIRS-PLS (Atsira QualitySense)";

  // Rekonstruksi objek produk agar ramah dibaca oleh ProductDetailClient
  const cleanProduct = {
    ...matchedProduct,
    productId: matchedProduct.id, 
    verifiedBy: isArcVerified ? "arc" : "atsira",
    // Sinkronisasi data CoA dinamis (Menghilangkan properti densitas)
    coa: {
      paLevel: (matchedProduct as any).coa?.paLevel || (matchedProduct as any).coaSnapshot?.paLevel || 34.2,
      acidNumber: (matchedProduct as any).coa?.acidNumber || (matchedProduct as any).coaSnapshot?.acidNumber || 3.48,
      color: (matchedProduct as any).coa?.color || (matchedProduct as any).coaSnapshot?.color || "Coklat Muda",
      viscosity: (matchedProduct as any).coa?.viscosity || (matchedProduct as any).coaSnapshot?.viscosity || "Sedang",
      method: (matchedProduct as any).coa?.method || (matchedProduct as any).coaSnapshot?.method || defaultMethod
    }
  };

  return <ProductDetailClient product={cleanProduct} />;
}