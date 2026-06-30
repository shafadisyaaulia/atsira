"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Globe2, Calculator } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PageShell } from "@/components/layout/PageShell";
import { Card, SectionEyebrow } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PRICE_HISTORY, GLOBAL_REFERENCE_PRICES, formatIDR } from "@/lib/mock";

const RANGE_OPTIONS = [
  { label: "1 Bulan", months: 1 },
  { label: "3 Bulan", months: 3 },
  { label: "6 Bulan", months: 6 },
  { label: "12 Bulan", months: 12 },
];

export default function PriceDashboardPage() {
  const [range, setRange] = useState(6);
  const data = PRICE_HISTORY.slice(-range);
  const latest = PRICE_HISTORY[PRICE_HISTORY.length - 1];
  const prev = PRICE_HISTORY[PRICE_HISTORY.length - 2];

  // Profitability calculator state
  const [productionCost, setProductionCost] = useState(525000);
  const [liters, setLiters] = useState(10);
  const [grade, setGrade] = useState<"premium" | "standard" | "economy">("premium");

  const sellPrice = latest[grade];
  const revenue = sellPrice * liters;
  const cost = productionCost * liters;
  const profit = revenue - cost;
  const margin = ((profit / revenue) * 100).toFixed(1);

  return (
    <PageShell>
      <section className="bg-primary-fixed/30 py-12 border-b border-surface-container-high">
        <div className="container-app">
          <SectionEyebrow>Keterbukaan Informasi</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-primary mb-3">
            Dasbor Intelijen Harga
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Senjata informasi yang selama ini hanya dimiliki pembeli — sekarang diberikan gratis untuk
            petani agar tidak lagi dikuasai permainan tengkulak.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-app">
          {/* Live ticker */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <PriceCard label="Grade Premium" value={latest.premium} prevValue={prev.premium} highlight />
            <PriceCard label="Grade Standard" value={latest.standard} prevValue={prev.standard} />
            <PriceCard label="Grade Economy" value={latest.economy} prevValue={prev.economy} />
          </div>

          {/* Trend chart */}
          <Card className="p-6 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="font-semibold text-on-surface mb-1">Grafik Pergerakan Harga Historis</p>
                <p className="text-xs text-outline">Harga per kg, dalam Rupiah</p>
              </div>
              <div className="flex gap-1 bg-surface-container-low rounded-full p-1">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.months}
                    onClick={() => setRange(opt.months)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      range === opt.months ? "bg-primary text-on-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e2dd" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#727973" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#727973" }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                  formatter={(value: number) => formatIDR(value)}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e4e2dd", fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="premium" name="Premium" stroke="#173124" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="standard" name="Standard" stroke="#D4A017" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="economy" name="Economy" stroke="#A65D46" strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Global reference */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Globe2 className="w-5 h-5 text-primary" />
                <p className="font-semibold text-on-surface">Harga Referensi Global</p>
              </div>
              <div className="space-y-4">
                <RefRow label="Aceh (ATSIRA)" price={GLOBAL_REFERENCE_PRICES.acehLocal.pricePerKg} note="Harga lokal saat ini" />
                <RefRow label="Singapura" price={GLOBAL_REFERENCE_PRICES.singapore.pricePerKg} note={GLOBAL_REFERENCE_PRICES.singapore.unit} />
                <RefRow label="Grasse, Prancis" price={GLOBAL_REFERENCE_PRICES.grasse.pricePerKg} note={GLOBAL_REFERENCE_PRICES.grasse.unit} />
              </div>
              <p className="text-xs text-outline mt-5">
                Gunakan data ini untuk bernegosiasi dengan lebih percaya diri — Anda tahu berapa harga yang
                semestinya.
              </p>
            </Card>

            {/* Profitability calculator */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calculator className="w-5 h-5 text-primary" />
                <p className="font-semibold text-on-surface">Kalkulator Profitabilitas</p>
              </div>
              <div className="space-y-4 mb-5">
                <div>
                  <Label htmlFor="cost">Biaya Produksi (per liter)</Label>
                  <Input id="cost" type="number" value={productionCost} onChange={(e) => setProductionCost(Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="liters">Jumlah Liter</Label>
                    <Input id="liters" type="number" value={liters} onChange={(e) => setLiters(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select id="grade" value={grade} onChange={(e) => setGrade(e.target.value as typeof grade)}>
                      <option value="premium">Premium</option>
                      <option value="standard">Standard</option>
                      <option value="economy">Economy</option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-md p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Estimasi Pendapatan</span>
                  <span className="font-semibold">{formatIDR(revenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Total Biaya Produksi</span>
                  <span className="font-semibold">{formatIDR(cost)}</span>
                </div>
                <div className="border-t border-outline-variant pt-2 flex justify-between">
                  <span className="font-semibold text-on-surface">Keuntungan Bersih</span>
                  <span className={`font-display text-lg font-bold ${profit >= 0 ? "text-[#1a7a3e]" : "text-error"}`}>
                    {formatIDR(profit)}
                  </span>
                </div>
                <p className="text-xs text-outline">Margin keuntungan: {margin}%</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function PriceCard({ label, value, prevValue, highlight }: { label: string; value: number; prevValue: number; highlight?: boolean }) {
  const change = (((value - prevValue) / prevValue) * 100).toFixed(1);
  const isUp = value >= prevValue;
  return (
    <Card className={`p-5 ${highlight ? "ring-1 ring-primary" : ""}`}>
      <p className="text-xs uppercase tracking-wide text-outline mb-2">{label}</p>
      <p className="font-display text-2xl font-bold text-primary mb-1">{formatIDR(value)}</p>
      <p className={`text-xs font-semibold flex items-center gap-1 ${isUp ? "text-[#1a7a3e]" : "text-error"}`}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {change}% dari bulan lalu
      </p>
    </Card>
  );
}

function RefRow({ label, price, note }: { label: string; price: number; note: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-on-surface">{label}</p>
        <p className="text-xs text-outline">{note}</p>
      </div>
      <p className="font-mono font-semibold text-primary">{formatIDR(price)}</p>
    </div>
  );
}
