"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search, MapPin, Calendar, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FINISHED_PRODUCTS, formatDateID } from "@/lib/mock";

const STAGE_ICON = { Kebun: MapPin, Penyulingan: ShieldCheck, Pengujian: CheckCircle2, Distribusi: MapPin, Botol: QrCode };

function TraceabilityContent() {
  const params = useSearchParams();
  const [batchId, setBatchId] = useState(params.get("batch") || "");
  const [searched, setSearched] = useState<typeof FINISHED_PRODUCTS[0] | null>(
    params.get("batch") ? FINISHED_PRODUCTS.find((p) => p.qrBatchId === params.get("batch")) ?? null : null
  );
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const found = FINISHED_PRODUCTS.find((p) => p.qrBatchId.toLowerCase() === batchId.toLowerCase().trim());
    setSearched(found ?? null);
    setNotFoundFlag(!found);
  }

  return (
    <PageShell>
      <section className="bg-primary py-14 text-inverse-on-surface">
        <div className="container-app">
          <SectionEyebrow className="text-secondary-fixed">Verifikasi Produk</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg mb-6">Telusuri Jejak Nilam Anda</h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <Input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Masukkan ID Batch, contoh: ATR-2024-NLM"
                className="pl-12 bg-surface-container-lowest"
              />
            </div>
            <Button type="submit" variant="gold" size="lg">
              Lacak Sekarang
            </Button>
          </form>
          <p className="text-xs text-inverse-on-surface/60 mt-3">
            Coba: ATR-2024-NLM, ATR-2024-GWM, ATR-2024-DIF, ATR-2024-SBN, ATR-2024-LLN, atau ATR-2024-ECR
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-app max-w-3xl">
          {notFoundFlag && (
            <Card className="p-8 text-center">
              <p className="text-on-surface-variant">
                ID Batch tidak ditemukan. Periksa kembali kode pada label atau kemasan produk Anda.
              </p>
            </Card>
          )}

          {searched && (
            <>
              <Card className="p-6 mb-8 flex flex-col sm:flex-row gap-5 items-start">
                <img src={searched.imageUrl} alt={searched.title} className="w-28 h-28 rounded-md object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-display text-xl font-bold text-primary">{searched.title}</p>
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                    </Badge>
                  </div>
                  <p className="text-sm font-mono text-outline mb-3">Batch ID: {searched.qrBatchId}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-outline">Kadar PA</p>
                      <p className="font-mono font-semibold text-clay-earth">{searched.coaSnapshot.paLevel}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-outline">Grade</p>
                      <p className="font-semibold text-on-surface">
                        {searched.coaSnapshot.paLevel >= 32 ? "Premium" : "Standard"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <p className="font-display text-headline-md text-primary mb-6">Perjalanan Produk</p>
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-outline-variant hidden sm:block" />
                <div className="space-y-5">
                  {searched.traceability.map((stage) => {
                    const Icon = STAGE_ICON[stage.stage] ?? MapPin;
                    return (
                      <div key={stage.stage} className="flex gap-4 relative">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary text-on-primary items-center justify-center flex-shrink-0 z-10">
                          <Icon className="w-5 h-5" />
                        </div>
                        <Card className="p-5 flex-1">
                          <p className="text-xs uppercase tracking-wide text-clay-earth font-semibold mb-1">{stage.stage}</p>
                          <p className="font-semibold text-on-surface mb-1">{stage.title}</p>
                          <p className="text-sm text-on-surface-variant mb-2">{stage.description}</p>
                          <p className="text-xs text-outline flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {formatDateID(stage.date)}
                            {stage.location && ` · ${stage.location}`}
                          </p>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Card className="p-5 mt-8 bg-surface-container-low">
                <p className="text-xs text-outline mb-1">Dicatat secara permanen di ledger ATSIRA</p>
                <p className="font-mono text-xs text-on-surface break-all">
                  0x8a7e9c1f2d3b4a5e6f7d8c9b0a1f2e3d4c5b6a7e8f9d0c1b2a3e4f5d6c7b8a9e
                </p>
              </Card>
            </>
          )}

          {!searched && !notFoundFlag && (
            <Card className="p-10 text-center text-on-surface-variant">
              <QrCode className="w-10 h-10 mx-auto mb-4 text-outline" />
              <p>Masukkan ID Batch produk Anda di atas untuk melihat seluruh riwayat perjalanannya.</p>
            </Card>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default function TraceabilityPage() {
  return (
    <Suspense>
      <TraceabilityContent />
    </Suspense>
  );
}
