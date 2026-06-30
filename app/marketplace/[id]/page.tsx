import { notFound } from "next/navigation";
import { getProductById } from "@/lib/mock/products";
import { ProductDetailClient } from "@/components/shared/ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
