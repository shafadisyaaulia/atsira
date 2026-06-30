"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, Sparkles, Loader2, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, Badge, SectionEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label } from "@/components/ui/Input";
import { formatIDR } from "@/lib/mock";
import { runNilamAnalyzer } from "@/lib/analyzer";
import type { AnalyzerInput, AnalyzerResult } from "@/lib/types";

type Stage = "form" | "processing" | "result";

export default function AnalyzerPage() {
  const [stage, setStage] = useState<Stage>("form");
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<AnalyzerInput>({
    color: "Coklat Muda",
    viscosity: "Sedang",
    aromaDescription: "",
    region: "Gayo, Aceh Tengah",
    distillationMethod: "Penyulingan Uap",
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("processing");
    const res = await runNilamAnalyzer(form);
    setTimeout(() => {
      setResult(res);
      setStage("result");
    }, 3000);
  }

  function reset() {
    setStage("form");
    setResult(null);
    setImagePreview(null);
  }

  return (
    <PageShell>
      <section className="bg-primary py-14 text-inverse-on-surface">
        <div className="container-app">
          <SectionEyebrow className="text-secondary-fixed">Fitur Utama</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg mb-3">Nilam Analyzer AI</h1>
          <p className="text-inverse-on-surface/75 max-w-2xl">
            Analisis kualitas minyak nilam Anda hanya dengan foto dan data sederhana — tanpa perlu uji
            laboratorium GC-MS yang mahal. Didukung model NIRS-PLS hasil riset ARC-USK (r = 0,93).
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-app max-w-3xl">
          {stage === "form" && (
            <Card className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Unggah Foto Minyak Nilam</Label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-sand-gray rounded-md py-10 flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors bg-bone-wash"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Pratinjau" className="h-32 rounded object-cover" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-outline" />
                        <p className="text-sm text-on-surface-variant">Klik untuk unggah foto, atau seret file di sini</p>
                      </>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="color">Warna Minyak</Label>
                    <Select id="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value as AnalyzerInput["color"] })}>
                      <option>Jernih</option>
                      <option>Kuning Pucat</option>
                      <option>Coklat Muda</option>
                      <option>Coklat Tua</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="viscosity">Kekentalan</Label>
                    <Select id="viscosity" value={form.viscosity} onChange={(e) => setForm({ ...form, viscosity: e.target.value as AnalyzerInput["viscosity"] })}>
                      <option>Rendah</option>
                      <option>Sedang</option>
                      <option>Tinggi</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Asal Daerah</Label>
                    <Input id="region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="method">Metode Penyulingan</Label>
                    <Select id="method" value={form.distillationMethod} onChange={(e) => setForm({ ...form, distillationMethod: e.target.value })}>
                      <option>Penyulingan Uap</option>
                      <option>Penyulingan Air</option>
                      <option>Steam-Water Combined</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="aroma">Deskripsi Aroma</Label>
                  <Textarea
                    id="aroma"
                    placeholder="Contoh: earthy kuat, sedikit manis, woody di akhir..."
                    value={form.aromaDescription}
                    onChange={(e) => setForm({ ...form, aromaDescription: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Sparkles className="w-5 h-5" /> Analisis Sekarang
                </Button>
                <p className="text-xs text-center text-outline">
                  Hasil analisis ini bersifat estimasi AI. Untuk sertifikasi resmi, ajukan verifikasi lab ARC-USK di Dasbor Petani Anda.
                </p>
              </form>
            </Card>
          )}

          {stage === "processing" && (
            <Card className="p-12 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary-fixed" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <p className="font-display text-xl font-bold text-primary mb-2">Menganalisis Sampel...</p>
              <p className="text-sm text-on-surface-variant mb-6">
                Model NIRS-PLS sedang memproses data spektral dan deskripsi sensorik Anda.
              </p>
              <div className="w-full max-w-xs space-y-2 text-left text-xs font-mono text-on-surface-variant">
                <ProcessingLine label="Memuat citra spektral" />
                <ProcessingLine label="Mengekstrak fitur warna & viskositas" />
                <ProcessingLine label="Menjalankan model prediksi PA" />
              </div>
            </Card>
          )}

          {stage === "result" && result && (
            <div className="space-y-6">
              <Card className="p-6 lg:p-8 bg-primary text-inverse-on-surface">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="ai">AI Verified</Badge>
                  <span className="text-xs text-inverse-on-surface/60">Keyakinan {result.confidenceScore}%</span>
                </div>
                <p className="text-sm text-inverse-on-surface/70 mb-1">Estimasi Kadar Patchouli Alcohol</p>
                <p className="font-display text-5xl font-bold text-secondary-fixed mb-4">{result.paLevel}%</p>
                <div className="flex gap-3">
                  <Badge variant={result.grade === "Premium" ? "ai" : "neutral"} className="text-sm px-4 py-1.5">
                    Grade {result.grade}
                  </Badge>
                </div>
              </Card>

              <Card className="p-6">
                <p className="text-label-md uppercase text-on-surface-variant mb-4">Detail Hasil Analisis</p>
                <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-sm">
                  <Spec label="Bilangan Asam" value={`${result.acidNumber}`} />
                  <Spec label="Densitas" value={`${result.density} g/mL`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-on-surface">Rekomendasi Harga Jual</p>
                </div>
                <p className="font-display text-2xl font-bold text-primary mb-6">
                  {formatIDR(result.recommendedPriceMin)} – {formatIDR(result.recommendedPriceMax)} <span className="text-sm font-body font-normal text-outline">/kg</span>
                </p>

                {result.improvementTips.length > 0 && (
                  <div className="bg-surface-container-low rounded-md p-4 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-clay-earth" />
                      <p className="text-sm font-semibold text-on-surface">Saran Perbaikan Kualitas</p>
                    </div>
                    <ul className="text-sm text-on-surface-variant space-y-1 list-disc list-inside">
                      {result.improvementTips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button href="/login" size="lg" className="flex-1">
                  <CheckCircle2 className="w-5 h-5" /> Masuk untuk Listing ke Marketplace
                </Button>
                <Button variant="secondary" size="lg" onClick={reset}>
                  Analisis Lagi
                </Button>
              </div>
              <p className="text-xs text-center text-outline">
                Ini halaman demo publik. Masuk sebagai Petani untuk mengakses Nilam Analyzer penuh dan listing langsung ke marketplace.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function ProcessingLine({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-outline mb-0.5">{label}</p>
      <p className="text-on-surface font-semibold">{value}</p>
    </div>
  );
}
