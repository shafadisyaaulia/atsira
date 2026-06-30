import Link from "next/link";
import { CheckCircle2, ShieldCheck, Package } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const orderId = `ATR-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <PageShell>
      <div className="container-app py-20 max-w-lg">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#dceee0] flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-[#1a4d2e]" />
          </div>
          <h1 className="font-display text-headline-md text-primary mb-2">Pembayaran Berhasil</h1>
          <p className="text-on-surface-variant mb-6">Pesanan #{orderId} sedang diproses.</p>

          <div className="bg-surface-container-low rounded-md p-5 mb-6 text-left">
            <div className="flex items-start gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-on-surface">Dana Anda Aman di Escrow ATSIRA</p>
                <p className="text-xs text-on-surface-variant">
                  Pembayaran Anda ditahan dengan aman oleh sistem escrow dan baru akan dicairkan ke
                  penjual setelah barang Anda terima.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-on-surface">Estimasi Tiba</p>
                <p className="text-xs text-on-surface-variant">3 - 5 hari kerja. Anda akan menerima notifikasi pelacakan.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/dashboard/buyer" className="flex-1">
              Lihat Status Pesanan
            </Button>
            <Button href="/marketplace" variant="secondary" className="flex-1">
              Lanjut Belanja
            </Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
