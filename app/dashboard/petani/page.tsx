"use client";

import { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Wallet,
  TrendingUp,
  Sprout,
  Bell,
  FlaskConical,
  Upload,
  Sparkles,
  CheckCircle2,
  Loader2,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, Badge, SectionEyebrow as SectionLabel } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label } from "@/components/ui/Input";
import { PRICE_HISTORY, GLOBAL_REFERENCE_PRICES, formatIDR, formatDateID } from "@/lib/mock";
import { CURRENT_FARMER } from "@/lib/mock/farmers";
import { runNilamAnalyzer } from "@/lib/analyzer";
import type { AnalyzerInput, AnalyzerResult } from "@/lib/types";

type AnalyzerStage = "form" | "processing" | "result";

export default function DashboardPetaniPage() {
  return (
    <DashboardShell role="petani">
      <div className="space-y-10">
        <FinancialSummary />
        <div id="price">
          <PriceIntelligencePanel />
        </div>
        <div id="analyzer">
          <AnalyzerSection />
        </div>
        <div id="farm">
          <FarmManagement />
        </div>
        <PriceAlertAndLab />
      </div>
    </DashboardShell>
  );
}

function FinancialSummary() {
  return (
    <div>
      <h1 className="font-display text-headline-md text-primary mb-5">Ringkasan Finansial</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-primary" />
            <p className="text-xs uppercase text-outline">Total Saldo</p>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{formatIDR(31250000)}</p>
          <p className="text-xs text-[#1a7a3e] mt-1">Tertahan di escrow: {formatIDR(0)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs uppercase text-outline">Penjualan Bulan Ini</p>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{formatIDR(32100000)}</p>
          <p className="text-xs text-[#1a7a3e] mt-1">↗ +18,2% dari bulan lalu</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sprout className="w-4 h-4 text-primary" />
            <p className="text-xs uppercase text-outline">Total Panen</p>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{CURRENT_FARMER.totalHarvests} kali</p>
          <p className="text-xs text-outline mt-1">Sejak {formatDateID(CURRENT_FARMER.joinedAt)}</p>
        </Card>
      </div>
    </div>
  );
}

function PriceIntelligencePanel() {
  const latest = PRICE_HISTORY[PRICE_HISTORY.length - 1];
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-headline-md text-primary">Panel Intelijen Harga</h2>
        <Badge variant="ai">Premium {formatIDR(latest.premium)}/kg</Badge>
      </div>
      <Card className="p-6">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={PRICE_HISTORY.slice(-6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e2dd" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#727973" }} />
            <YAxis tick={{ fontSize: 11, fill: "#727973" }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
            <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="premium" stroke="#173124" strokeWidth={2.5} dot={false} name="Premium" />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-surface-container-high">
          <div className="flex items-center justify-between bg-surface-container-low rounded-md p-3">
            <span className="text-sm text-on-surface-variant">Singapura</span>
            <span className="font-mono font-semibold text-primary">{formatIDR(GLOBAL_REFERENCE_PRICES.singapore.pricePerKg)}</span>
          </div>
          <div className="flex items-center justify-between bg-surface-container-low rounded-md p-3">
            <span className="text-sm text-on-surface-variant">Grasse, Prancis</span>
            <span className="font-mono font-semibold text-primary">{formatIDR(GLOBAL_REFERENCE_PRICES.grasse.pricePerKg)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AnalyzerSection() {
  const [stage, setStage] = useState<AnalyzerStage>("form");
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [listed, setListed] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<AnalyzerInput>({
    color: "Coklat Muda",
    viscosity: "Sedang",
    aromaDescription: "Earthy kuat, sedikit manis, woody di akhir",
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-clay-earth" />
        <h2 className="font-display text-headline-md text-primary">Nilam Analyzer AI</h2>
        <Badge variant="ai">Fitur Utama</Badge>
      </div>

      <Card className="p-6">
        {stage === "form" && (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-6">
            <div>
              <SectionLabel>Foto Sampel Minyak</SectionLabel>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-sand-gray rounded-md py-12 flex flex-col items-center justify-center gap-3 hover:border-primary bg-bone-wash"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-32 rounded object-cover" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-outline" />
                    <p className="text-sm text-on-surface-variant">Unggah foto minyak nilam Anda</p>
                  </>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="p-color">Warna</Label>
                  <Select id="p-color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value as AnalyzerInput["color"] })}>
                    <option>Jernih</option>
                    <option>Kuning Pucat</option>
                    <option>Coklat Muda</option>
                    <option>Coklat Tua</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="p-visc">Kekentalan</Label>
                  <Select id="p-visc" value={form.viscosity} onChange={(e) => setForm({ ...form, viscosity: e.target.value as AnalyzerInput["viscosity"] })}>
                    <option>Rendah</option>
                    <option>Sedang</option>
                    <option>Tinggi</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="p-region">Asal Daerah</Label>
                <Input id="p-region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p-method">Metode Penyulingan</Label>
                <Select id="p-method" value={form.distillationMethod} onChange={(e) => setForm({ ...form, distillationMethod: e.target.value })}>
                  <option>Penyulingan Uap</option>
                  <option>Penyulingan Air</option>
                  <option>Steam-Water Combined</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-aroma">Deskripsi Aroma</Label>
                <Textarea id="p-aroma" value={form.aromaDescription} onChange={(e) => setForm({ ...form, aromaDescription: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Sparkles className="w-5 h-5" /> Analisis Sekarang
              </Button>
            </div>
          </form>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-primary-fixed" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
              <Loader2 className="absolute inset-0 m-auto w-7 h-7 text-primary" />
            </div>
            <p className="font-semibold text-primary">Menjalankan model NIRS-PLS...</p>
          </div>
        )}

        {stage === "result" && result && (
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="bg-primary rounded-md p-6 text-inverse-on-surface">
              <Badge variant="ai" className="mb-4">
                AI Verified
              </Badge>
              <p className="text-sm text-inverse-on-surface/70 mb-1">Kadar Patchouli Alcohol</p>
              <p className="font-display text-4xl font-bold text-secondary-fixed mb-3">{result.paLevel}%</p>
              <Badge variant={result.grade === "Premium" ? "ai" : "neutral"}>Grade {result.grade}</Badge>
              <div className="mt-5 pt-5 border-t border-white/15">
                <p className="text-xs text-inverse-on-surface/70 mb-1">Rekomendasi Harga Jual</p>
                <p className="font-display text-lg font-bold text-white">
                  {formatIDR(result.recommendedPriceMin)} – {formatIDR(result.recommendedPriceMax)}/kg
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-on-surface mb-3">Certificate of Analysis (CoA) Digital</p>
              <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-sm">
                <Spec label="Bilangan Asam" value={`${result.acidNumber}`} />
                <Spec label="Densitas" value={`${result.density} g/mL`} />
                <Spec label="Keyakinan AI" value={`${result.confidenceScore}%`} />
                <Spec label="Dianalisis" value={formatDateID(result.analyzedAt)} />
              </div>
              {!listed ? (
                <Button onClick={() => setListed(true)} size="lg" className="mt-auto">
                  <ArrowUpRight className="w-5 h-5" /> Jual Langsung ke UMKM
                </Button>
              ) : (
                <div className="mt-auto flex items-center gap-2 bg-[#dceee0] text-[#1a4d2e] rounded-md p-4 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Berhasil terdaftar di katalog bahan baku UMKM dengan badge AI Verified!
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setStage("form");
                  setListed(false);
                }}
              >
                Analisis sampel baru
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function FarmManagement() {
  return (
    <div>
      <h2 className="font-display text-headline-md text-primary mb-5">Manajemen Kebun & Suling</h2>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="font-semibold text-on-surface">Data Kebun</p>
          </div>
          <div className="space-y-3 text-sm">
            <Row label="Lokasi" value={CURRENT_FARMER.location} />
            <Row label="Koordinat GPS" value={`${CURRENT_FARMER.gpsCoords.lat}, ${CURRENT_FARMER.gpsCoords.lng}`} mono />
            <Row label="Luas Lahan" value={`${CURRENT_FARMER.farmSizeHa} Ha`} />
            <Row label="Tanggal Bergabung" value={formatDateID(CURRENT_FARMER.joinedAt)} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-4 h-4 text-primary" />
            <p className="font-semibold text-on-surface">Log Penyulingan Terakhir</p>
          </div>
          <div className="space-y-3 text-sm">
            <Row label="Metode" value="Penyulingan Uap" />
            <Row label="Durasi" value="8 jam" />
            <Row label="Rendemen" value="2,8%" />
            <Row label="Untuk QR Code" value="ATR-2024-NLM" mono />
          </div>
        </Card>
      </div>
    </div>
  );
}

function PriceAlertAndLab() {
  const [alertSet, setAlertSet] = useState(false);
  const [labRequested, setLabRequested] = useState(false);
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <p className="font-semibold text-on-surface">Pengelola Notifikasi Harga</p>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          Dapatkan notifikasi otomatis saat harga mencapai target Anda.
        </p>
        <div className="flex gap-2 mb-4">
          <Select defaultValue="Premium" className="flex-shrink-0 w-32">
            <option>Premium</option>
            <option>Standard</option>
          </Select>
          <Input defaultValue="2000000" type="number" />
        </div>
        <Button onClick={() => setAlertSet(true)} variant="secondary" className="w-full">
          {alertSet ? "Notifikasi Aktif ✓" : "Aktifkan Notifikasi Rp 2 Juta/kg"}
        </Button>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-4 h-4 text-primary" />
          <p className="font-semibold text-on-surface">Pengajuan Lab Premium</p>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          Ajukan verifikasi fisik ke laboratorium ARC-USK untuk mendapatkan badge "USK Verified" dan akses
          ke pasar premium.
        </p>
        <Button onClick={() => setLabRequested(true)} disabled={labRequested} className="w-full">
          {labRequested ? "Pengajuan Terkirim — Menunggu Antrean" : "Ajukan Verifikasi Lab"}
        </Button>
      </Card>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-outline">{label}</p>
      <p className="text-on-surface font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-on-surface-variant">{label}</span>
      <span className={mono ? "font-mono text-xs text-primary" : "font-medium text-on-surface"}>{value}</span>
    </div>
  );
}
