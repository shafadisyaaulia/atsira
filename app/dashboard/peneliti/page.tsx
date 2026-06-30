"use client";

import { useState } from "react";
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Database,
  PenSquare,
  Download,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { VERIFICATION_QUEUE, MAGAZINE_ARTICLES, formatDateID } from "@/lib/mock";
import type { VerificationQueueItem } from "@/lib/types";

const STATUS_BADGE: Record<VerificationQueueItem["status"], "warning" | "ai" | "success" | "neutral"> = {
  Menunggu: "warning",
  "Dalam Proses": "ai",
  Lulus: "success",
  Ditolak: "neutral",
};

export default function DashboardPenelitiPage() {
  return (
    <DashboardShell role="peneliti">
      <div className="space-y-10">
        <h1 className="font-display text-headline-md text-primary">Dasbor Peneliti ARC-USK</h1>
        <div id="queue">
          <VerificationQueueSection />
        </div>
        <div id="research">
          <ResearchPortal />
        </div>
        <ContentCreator />
      </div>
    </DashboardShell>
  );
}

function VerificationQueueSection() {
  const [queue, setQueue] = useState(VERIFICATION_QUEUE);

  function updateStatus(id: string, status: VerificationQueueItem["status"]) {
    setQueue((q) => q.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <FlaskConical className="w-5 h-5 text-primary" />
        <h2 className="font-display text-headline-md text-primary">Antrean Verifikasi Sampel</h2>
      </div>
      <div className="space-y-3">
        {queue.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <img src={item.sampleImageUrl} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-on-surface">{item.farmerName}</p>
                <Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge>
              </div>
              <p className="text-xs text-outline">
                {item.region} · Estimasi AI: PA {item.aiPaLevel}% ({item.aiGrade}) · Diajukan{" "}
                {formatDateID(item.submittedAt)}
              </p>
            </div>
            {item.status === "Menunggu" || item.status === "Dalam Proses" ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStatus(item.id, "Lulus")}>
                  <CheckCircle2 className="w-4 h-4" /> Lulus
                </Button>
                <Button size="sm" variant="secondary" onClick={() => updateStatus(item.id, "Ditolak")}>
                  <XCircle className="w-4 h-4" /> Tolak
                </Button>
              </div>
            ) : (
              <p className="text-xs text-outline flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Selesai diproses
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ResearchPortal() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Database className="w-5 h-5 text-primary" />
        <h2 className="font-display text-headline-md text-primary">Portal Data Riset</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sampel Teranalisis", value: "5.412" },
          { label: "Rata-rata Kadar PA Regional", value: "31,8%" },
          { label: "Akurasi Model NIRS-PLS", value: "r = 0,93" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs uppercase text-outline mb-2">{stat.label}</p>
            <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5 mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-on-surface">Dataset Ekosistem Nilam Teragregasi (Anonim)</p>
          <p className="text-xs text-outline">Update terakhir: {formatDateID("2026-06-27")}</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4" /> Unduh CSV
        </Button>
      </Card>
    </div>
  );
}

function ContentCreator() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <PenSquare className="w-5 h-5 text-primary" />
        <h2 className="font-display text-headline-md text-primary">Dasbor Kreator Konten</h2>
      </div>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <Card className="p-6">
          <p className="font-semibold text-on-surface mb-4">Tulis Artikel Baru untuk ATSIRA Magazine</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setTimeout(() => setSubmitted(false), 2500);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="art-title">Judul Artikel</Label>
              <Input id="art-title" placeholder="Contoh: Temuan Baru Seputar Kadar PA Nilam Gayo" required />
            </div>
            <div>
              <Label htmlFor="art-cat">Kategori</Label>
              <Select id="art-cat" defaultValue="Riset ARC-USK">
                <option>Riset ARC-USK</option>
                <option>Tips Budidaya</option>
                <option>Panduan Bisnis Parfum</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="art-body">Isi Artikel</Label>
              <Textarea id="art-body" placeholder="Tulis isi artikel atau jurnal Anda di sini..." className="min-h-[140px]" />
            </div>
            <Button type="submit" className="w-full">
              {submitted ? "Artikel Terkirim untuk Ditinjau!" : "Publikasikan ke Magazine"}
            </Button>
          </form>
        </Card>

        <div>
          <p className="font-semibold text-on-surface mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Artikel Anda yang Sudah Terbit
          </p>
          <div className="space-y-3">
            {MAGAZINE_ARTICLES.filter((a) => a.category === "Riset ARC-USK").map((a) => (
              <Card key={a.slug} className="p-4 flex gap-4">
                <img src={a.imageUrl} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-on-surface line-clamp-1">{a.title}</p>
                  <p className="text-xs text-outline">{formatDateID(a.publishedAt)} · {a.readMinutes} menit baca</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
