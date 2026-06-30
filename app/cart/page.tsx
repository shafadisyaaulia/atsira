"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { formatIDR } from "@/lib/mock";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty } = useCartStore();

  const retailItems = items.filter((i) => i.category === "finished-product");
  const bulkItems = items.filter((i) => i.category === "raw-oil");

  const retailTotal = retailItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const bulkTotal = bulkItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="container-app py-24 text-center">
          <ShoppingBag className="w-12 h-12 text-outline mx-auto mb-4" />
          <p className="font-display text-headline-md text-primary mb-2">Keranjang Anda kosong</p>
          <p className="text-on-surface-variant mb-6">Jelajahi pasar untuk menemukan produk nilam Aceh terbaik.</p>
          <Button href="/marketplace">Jelajahi Pasar</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-app py-10">
        <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-8">Keranjang Belanja</h1>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-8">
            {retailItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="neutral">Retail (B2C)</Badge>
                  <p className="text-sm text-outline">{retailItems.length} produk</p>
                </div>
                <div className="space-y-3">
                  {retailItems.map((item) => (
                    <CartRow key={item.productId} item={item} onRemove={removeItem} onQtyChange={updateQty} />
                  ))}
                </div>
              </div>
            )}

            {bulkItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="ai">Grosir (B2B)</Badge>
                  <p className="text-sm text-outline">{bulkItems.length} produk</p>
                </div>
                <div className="space-y-3">
                  {bulkItems.map((item) => (
                    <CartRow key={item.productId} item={item} onRemove={removeItem} onQtyChange={updateQty} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Card className="p-6 h-fit sticky top-24">
            <p className="font-semibold text-on-surface mb-4">Ringkasan Pesanan</p>
            <div className="space-y-2 mb-4 text-sm">
              {retailTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal Retail</span>
                  <span>{formatIDR(retailTotal)}</span>
                </div>
              )}
              {bulkTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal Grosir</span>
                  <span>{formatIDR(bulkTotal)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-surface-container-high pt-3 mb-5 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary font-display text-lg">{formatIDR(retailTotal + bulkTotal)}</span>
            </div>
            <Button onClick={() => router.push("/checkout")} size="lg" className="w-full">
              Lanjut ke Pembayaran
            </Button>
            <p className="text-xs text-outline text-center mt-3">Belanja Anda dilindungi sistem Escrow ATSIRA</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function CartRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: ReturnType<typeof useCartStore.getState>["items"][0];
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}) {
  return (
    <Card className="p-4 flex gap-4 items-center">
      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Link href={`/marketplace/${item.productId}`} className="font-medium text-on-surface text-sm hover:underline line-clamp-1">
          {item.title}
        </Link>
        <p className="text-xs text-outline">{formatIDR(item.price)} /{item.unit}</p>
      </div>
      <div className="flex items-center gap-2 border border-sand-gray rounded-full px-2 py-1">
        <button onClick={() => onQtyChange(item.productId, item.qty - 1)} className="p-1" aria-label="Kurangi jumlah">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold w-8 text-center">{item.qty}</span>
        <button onClick={() => onQtyChange(item.productId, item.qty + 1)} className="p-1" aria-label="Tambah jumlah">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="font-semibold text-primary text-sm w-24 text-right">{formatIDR(item.price * item.qty)}</p>
      <button onClick={() => onRemove(item.productId)} aria-label="Hapus item">
        <Trash2 className="w-4 h-4 text-outline hover:text-error" />
      </button>
    </Card>
  );
}
