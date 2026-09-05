import { ProductDetailClient } from "@/components/shared/ProductDetailClient";
import { notFound } from "next/navigation";
import { getMarketplaceProductById } from "@/lib/data/marketplace";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const idFromUrl = resolvedParams.id;
  const decodedId = decodeURIComponent(idFromUrl).trim();

  const matchedProduct = await getMarketplaceProductById(decodedId);

  if (!matchedProduct) {
    notFound();
  }

  const defaultMethod = matchedProduct.coa?.method || "NIRS-PLS (Atsira QualitySense)";

  const cleanProduct = {
    ...matchedProduct,
    productId: matchedProduct.id,
    verifiedBy: matchedProduct.badges?.includes("USK Verified") ? "arc" : "atsira",
    coa: {
      paLevel: matchedProduct.coa?.paLevel ?? 34.2,
      acidNumber: matchedProduct.coa?.acidNumber ?? 3.48,
      color: matchedProduct.coa?.color ?? "Coklat Muda",
      viscosity: matchedProduct.coa?.viscosity ?? "Sedang",
      method: matchedProduct.coa?.method ?? defaultMethod,
    },
  };

  return <ProductDetailClient product={cleanProduct} />;
}