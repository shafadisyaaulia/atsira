"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Leaf, Users, Banknote, CloudRain, Building2, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, SectionEyebrow } from "@/components/ui/Card";
import { IMPACT_METRICS } from "@/lib/mock";

const ICONS = [Leaf, Users, Banknote, CloudRain, Building2, MapPin];

const MONTHLY_GROWTH = [
  { month: "Jan", petani: 1200, umkm: 28 },
  { month: "Feb", petani: 1850, umkm: 41 },
  { month: "Mar", petani: 2640, umkm: 58 },
  { month: "Apr", petani: 3520, umkm: 79 },
  { month: "Mei", petani: 4380, umkm: 97 },
  { month: "Jun", petani: 5412, umkm: 118 },
];

const REGION_SHARE = [
  { name: "Gayo", value: 38 },
  { name: "Aceh Barat", value: 27 },
  { name: "Aceh Jaya", value: 18 },
  { name: "Lainnya", value: 17 },
];

const PIE_COLORS = ["#173124", "#D4A017", "#A65D46", "#c2c8c2"];

export default function TrackerPage() {
  return (
    <PageShell>
      <section className="bg-primary py-14 text-inverse-on-surface">
        <div className="container-app">
          <SectionEyebrow className="text-secondary-fixed">Akuntabilitas Publik</SectionEyebrow>
          <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg mb-3">ATSIRA Impact Tracker</h1>
          <p className="text-inverse-on-surface/75 max-w-2xl">
            Bukan hanya laporan — ini adalah argumen untuk investor, pemerintah, dan lembaga internasional
            yang ingin mendukung revitalisasi ekosistem nilam Aceh.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-app">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {IMPACT_METRICS.map((m, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Card key={m.label} className="p-6">
                  <div className="w-10 h-10 rounded-md bg-primary-fixed flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-on-primary-fixed-variant" />
                  </div>
                  <p className="text-sm text-on-surface-variant mb-1">{m.label}</p>
                  <p className="font-display text-3xl font-bold text-primary mb-1">{m.value}</p>
                  {m.change && <p className="text-xs text-[#1a7a3e] font-semibold">↗ {m.change}</p>}
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <Card className="p-6">
              <p className="font-semibold text-on-surface mb-1">Pertumbuhan Petani & UMKM Bergabung</p>
              <p className="text-xs text-outline mb-6">6 bulan terakhir</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MONTHLY_GROWTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e2dd" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#727973" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#727973" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e2dd", fontSize: 12 }} />
                  <Bar dataKey="petani" name="Petani" fill="#173124" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="umkm" name="UMKM" fill="#D4A017" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <p className="font-semibold text-on-surface mb-1">Distribusi Wilayah Petani</p>
              <p className="text-xs text-outline mb-6">Persentase dari total mitra</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={REGION_SHARE} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {REGION_SHARE.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e2dd", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {REGION_SHARE.map((r, i) => (
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      {r.name}
                    </span>
                    <span className="font-semibold text-on-surface">{r.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-8 mt-6 bg-primary-fixed/20 border-primary-fixed">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-display text-3xl font-bold text-primary">SDG 12</p>
                <p className="text-xs text-on-surface-variant mt-1">Konsumsi & Produksi Bertanggung Jawab</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-primary">SDG 17</p>
                <p className="text-xs text-on-surface-variant mt-1">Kemitraan untuk Tujuan Bersama</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-primary">SDG 11</p>
                <p className="text-xs text-on-surface-variant mt-1">Kota & Komunitas Berkelanjutan</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
