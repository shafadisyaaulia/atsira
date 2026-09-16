import type { AnalyzerResult } from "@/lib/types";

/**
 * ============================================================================
 * ATSIRA QualitySense Engine — Base Logic
 *
 * Spesifikasi kalkulasi berdasarkan:
 *   - Dokumen Task Atsira (ARC-USK / Handover)
 *   - SNI 06-2385-2006
 *   - Konfirmasi rekan pengembang (Sept 2026)
 *
 * Input utama:
 *   - paActual   : Kadar Patchouli Alcohol (%) yang diketik Pemasta/Seller
 *   - hargaBase  : Harga referensi terbaru dari tabel market_price_updates Pemasta
 *                  (ambil dari API /api/pemasta/market-prices sebelum memanggil fungsi ini)
 *
 * Formula Harga Rekomendasi:
 *   Harga Rekomendasi = Harga Base × (1 + (PA Actual − 30) / 100)
 *
 * Penentuan Grade (sesuai ARC-USK):
 *   Grade A (Super/Ekspor)  : PA ≥ 32%
 *   Grade B (Lokal Top)     : PA 30–31.9%
 *   Grade C (Standard)      : PA < 30%
 * ============================================================================
 */

const PA_STANDARD = 30; // Nilai acuan dasar PA untuk kalkulasi harga

/**
 * Tentukan grade berdasarkan kadar PA.
 */
function gradeFromPa(pa: number): AnalyzerResult["grade"] {
  if (pa >= 32) return "Grade A";
  if (pa >= 30) return "Grade B";
  return "Grade C";
}

/**
 * Keterangan grade dalam Bahasa Indonesia untuk ditampilkan di UI.
 */
export function gradeLabel(grade: AnalyzerResult["grade"]): string {
  switch (grade) {
    case "Grade A": return "Super / Ekspor";
    case "Grade B": return "Lokal Top";
    case "Grade C": return "Standard";
  }
}

/**
 * Tips perbaikan mutu berdasarkan grade.
 */
function improvementTips(grade: AnalyzerResult["grade"]): string[] {
  if (grade === "Grade A") return [];
  const tips = [
    "Panen daun nilam di usia 6–8 bulan untuk kadar PA lebih optimal.",
    "Gunakan metode penyulingan uap (steam distillation) dengan tekanan rendah, durasi 6–8 jam.",
  ];
  if (grade === "Grade C") {
    tips.push("Pastikan bahan baku tidak terlalu muda (< 4 bulan) karena kadar PA belum terbentuk sempurna.");
    tips.push("Simpan minyak di jerigen plastik bersih atau botol kaca — hindari drum besi yang bisa meningkatkan kadar Fe.");
  }
  return tips;
}

/**
 * Jalankan kalkulasi QualitySense.
 *
 * @param paActual   Kadar PA (%) dari input Pemasta / Seller
 * @param hargaBase  Harga referensi terbaru (Rp/kg) dari market_price_updates Pemasta
 * @returns          AnalyzerResult lengkap
 */
export function runNilamAnalyzer(
  paActual: number,
  hargaBase: number
): AnalyzerResult {
  const grade = gradeFromPa(paActual);

  // Formula rekomendasi harga dari dokumen spesifikasi ARC-USK
  const hargaRekomendasi = Math.round(
    hargaBase * (1 + (paActual - PA_STANDARD) / 100)
  );

  // Tampilkan rentang ±5% sebagai batas negosiasi
  const recommendedPriceMin = Math.round(hargaRekomendasi * 0.95);
  const recommendedPriceMax = Math.round(hargaRekomendasi * 1.05);

  return {
    paLevel: paActual,
    grade,
    // acidNumber & density tidak dikalkulasi (butuh uji lab fisik ARC-USK)
    acidNumber: 0,
    density: 0,
    confidenceScore: 100, // Deterministic — tidak ada probabilistik
    recommendedPriceMin,
    recommendedPriceMax,
    improvementTips: improvementTips(grade),
    analyzedAt: new Date().toISOString(),
  };
}
