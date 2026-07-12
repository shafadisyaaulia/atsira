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

  // Rekonstruksi objek produk agar ramah dibaca oleh ProductDetailClient
  // Ini memaksa spesifikasi teknis dan gambar berubah dinamis mengikuti data mock asli!
  const cleanProduct = {
    ...matchedProduct,
    // Jika komponen client butuh mapping properti lama (id vs productId)
    productId: matchedProduct.id, 
    // Sinkronisasi data CoA dinamis agar spesifikasi di kanan bawah otomatis berubah
    coa: matchedProduct.coa || matchedProduct.coaSnapshot || {
      paLevel: 0,
      acidNumber: 0,
      density: 0,
      color: "-",
      viscosity: "-",
      method: "Manual"
    }
  };

  return <ProductDetailClient product={cleanProduct} />;
}