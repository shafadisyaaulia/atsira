"use client";

import { useState } from "react";
import { Download, Loader2, FileCheck2 } from "lucide-react";

export interface CoAData {
  id?: string;
  batch_id?: string;
  product_name?: string;
  farmer_name?: string;
  region?: string;
  pa_level: number;
  acid_number?: number;
  density?: number;
  color?: string;
  viscosity?: string;
  method: string;
  confidence_score?: number;
  grade?: string;
  notes?: string;
  issued_by?: string;
  analyzed_at?: string;
}

interface CoAPDFButtonProps {
  data: CoAData;
  variant?: "button" | "icon";
  className?: string;
}

function getGradeLabel(pa: number): { grade: string; label: string; color: string } {
  if (pa >= 32) return { grade: "Grade A", label: "Super / Ekspor", color: "#16a34a" };
  if (pa >= 30) return { grade: "Grade B", label: "Lokal Top", color: "#d97706" };
  return { grade: "Grade C", label: "Standard", color: "#dc2626" };
}

export async function generateCoAPDF(data: CoAData): Promise<void> {
  // Dynamic import agar tidak bundle ke server
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const gradeInfo = data.grade
    ? { grade: data.grade, label: "", color: "#16a34a" }
    : getGradeLabel(data.pa_level);

  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  const contentW = pageW - margin * 2;

  // ── Background hijau header ──
  doc.setFillColor(22, 101, 52); // emerald-800
  doc.rect(0, 0, pageW, 52, "F");

  // ── Logo area (lingkaran putih kecil kiri) ──
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 10, 26, 10, "F");
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("ARC\nUSK", margin + 10, 24, { align: "center" });

  // ── Judul ──
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF ANALYSIS", margin + 24, 22);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Atsiri Research Center – Universitas Syiah Kuala (ARC-USK)", margin + 24, 29);
  doc.text("Darussalam, Banda Aceh 23111 · arc@usk.ac.id", margin + 24, 35);

  // ── Nomor CoA & tanggal ──
  const dateStr = data.analyzed_at
    ? new Date(data.analyzed_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(`No. CoA: ${(data.id || "—").slice(0, 8).toUpperCase()}`, pageW - margin, 22, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal: ${dateStr}`, pageW - margin, 28, { align: "right" });
  doc.text(`Diterbitkan oleh: ${data.issued_by || "ARC-USK"}`, pageW - margin, 34, { align: "right" });

  // ── Grade badge besar ──
  doc.setFillColor(
    parseInt(gradeInfo.color.slice(1, 3), 16),
    parseInt(gradeInfo.color.slice(3, 5), 16),
    parseInt(gradeInfo.color.slice(5, 7), 16)
  );
  doc.roundedRect(pageW - margin - 32, 38, 32, 11, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(gradeInfo.grade, pageW - margin - 16, 45, { align: "center" });

  // ── Garis pemisah dekoratif ──
  doc.setDrawColor(209, 250, 229); // emerald-100
  doc.setLineWidth(0.5);
  doc.line(margin, 52, pageW - margin, 52);

  let y = 62;

  // ── INFO SAMPEL ──
  doc.setTextColor(31, 41, 55); // gray-800
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMASI SAMPEL", margin, y);
  y += 2;
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 55, y);
  y += 5;

  const sampleRows: [string, string][] = [
    ["Nama Produk", data.product_name || "Minyak Nilam (Patchouli Oil)"],
    ["Batch / ID", data.batch_id || "—"],
    ["Petani / Penyuling", data.farmer_name || "—"],
    ["Asal Daerah", data.region || "—"],
    ["Metode Analisis", data.method],
  ];

  doc.setFontSize(8.5);
  for (const [label, value] of sampleRows) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    doc.text(String(value), margin + 48, y);
    y += 6;
  }

  y += 4;

  // ── HASIL UJI ──
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text("HASIL PENGUJIAN PARAMETER", margin, y);
  y += 2;
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 75, y);
  y += 6;

  // Header tabel
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.rect(margin, y - 4, contentW, 7, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("PARAMETER", margin + 2, y);
  doc.text("NILAI", margin + 80, y);
  doc.text("STANDAR SNI", margin + 110, y);
  doc.text("STATUS", margin + 148, y);
  y += 5;

  // Data baris tabel
  const testRows: [string, string, string, boolean][] = [
    ["Kadar Patchouli Alcohol (PA)", `${data.pa_level.toFixed(2)}%`, "≥ 30% (Grade A: ≥ 32%)", data.pa_level >= 30],
    ["Bilangan Asam (Acid Number)", data.acid_number != null ? `${data.acid_number.toFixed(2)} mg KOH/g` : "—", "≤ 8.0 mg KOH/g", data.acid_number == null || data.acid_number <= 8.0],
    ["Berat Jenis (Density)", data.density != null ? `${data.density.toFixed(3)} g/mL` : "—", "0.950–0.975 g/mL", data.density == null || (data.density >= 0.950 && data.density <= 0.975)],
    ["Warna (Color)", data.color || "—", "Kuning - Coklat Muda", true],
    ["Viskositas (Viscosity)", data.viscosity || "—", "—", true],
  ];

  doc.setFont("helvetica", "normal");
  for (let i = 0; i < testRows.length; i++) {
    const [param, val, std, pass] = testRows[i];
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y - 4, contentW, 7, "F");
    }
    doc.setFontSize(7.5);
    doc.setTextColor(55, 65, 81);
    doc.text(param, margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(
      pa_level_or_other_pass(param, data) ? 22 : 185,
      pa_level_or_other_pass(param, data) ? 101 : 28,
      pa_level_or_other_pass(param, data) ? 52 : 26
    );
    doc.text(val, margin + 80, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(std, margin + 110, y);
    // Status badge
    const badgeColor = pass ? [22, 101, 52] : [185, 28, 28];
    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(margin + 148, y - 4, 22, 5.5, 1.5, 1.5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text(pass ? "LULUS" : "TIDAK LULUS", margin + 159, y - 0.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    y += 7;
  }

  y += 6;

  // ── KESIMPULAN / GRADE ──
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 22, 3, 3, "S");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("KESIMPULAN", margin + 5, y + 7);
  doc.setFontSize(10);
  doc.text(`${gradeInfo.grade}${gradeInfo.label ? " — " + gradeInfo.label : ""}`, margin + 5, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81);
  doc.text(`Kadar PA: ${data.pa_level.toFixed(2)}% · Skor Kepercayaan: ${data.confidence_score != null ? data.confidence_score.toFixed(1) + "%" : "N/A"}`, margin + 5, y + 20);

  // Stamp kanan
  doc.setFillColor(
    parseInt(gradeInfo.color.slice(1, 3), 16),
    parseInt(gradeInfo.color.slice(3, 5), 16),
    parseInt(gradeInfo.color.slice(5, 7), 16)
  );
  doc.circle(pageW - margin - 14, y + 11, 13, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("✓", pageW - margin - 14, y + 13.5, { align: "center" });

  y += 30;

  // ── CATATAN ──
  if (data.notes) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("Catatan:", margin, y);
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(data.notes, contentW);
    doc.text(noteLines, margin, y + 5);
    y += 5 + noteLines.length * 5;
  }

  // ── FOOTER ──
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 22, pageW, 22, "F");
  doc.setTextColor(209, 250, 229);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Sertifikat ini diterbitkan secara digital oleh ARC-USK melalui platform atSira. Berlaku tanpa tanda tangan fisik.",
    pageW / 2,
    pageH - 13,
    { align: "center" }
  );
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("atSira — Platform Ekosistem Nilam Indonesia", pageW / 2, pageH - 6, { align: "center" });

  // ── Simpan PDF ──
  const filename = `CoA-${data.batch_id || (data.id || "atSira").slice(0, 8).toUpperCase()}-${data.pa_level.toFixed(0)}PA.pdf`;
  doc.save(filename);
}

// Helper warna nilai sesuai pass/fail PA
function pa_level_or_other_pass(param: string, data: CoAData): boolean {
  if (param.includes("PA")) return data.pa_level >= 30;
  if (param.includes("Acid") && data.acid_number != null) return data.acid_number <= 8.0;
  if (param.includes("Density") && data.density != null) return data.density >= 0.95 && data.density <= 0.975;
  return true;
}

// ─── Komponen tombol ─────────────────────────────────────────────────────────
export default function CoAPDFButton({ data, variant = "button", className = "" }: CoAPDFButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      await generateCoAPDF(data);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("Gagal generate CoA PDF:", err);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title="Unduh CoA PDF"
        className={`p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 disabled:opacity-50 transition-colors ${className}`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
         done ? <FileCheck2 className="w-4 h-4 text-emerald-600" /> :
         <Download className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-bold transition-colors ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
       done ? <FileCheck2 className="w-4 h-4" /> :
       <Download className="w-4 h-4" />}
      {loading ? "Membuat PDF..." : done ? "PDF Berhasil Diunduh!" : "Unduh CoA PDF"}
    </button>
  );
}
