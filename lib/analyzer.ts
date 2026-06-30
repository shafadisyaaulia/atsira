import type { AnalyzerInput, AnalyzerResult } from "@/lib/types";

/**
 * ============================================================================
 * FASE 2 TODO — Ganti implementasi mock di bawah dengan panggilan Gemini API:
 *
 * import { GoogleGenerativeAI } from "@google/generative-ai";
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
 * const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 *
 * Kirim foto (base64) + input form sebagai prompt terstruktur, minta model
 * mengembalikan JSON: { paLevel, grade, acidNumber, density, confidenceScore,
 * recommendedPriceMin, recommendedPriceMax, improvementTips }.
 *
 * Idealnya panggilan ini terjadi di Route Handler (app/api/analyzer/route.ts)
 * supaya API key tidak pernah dikirim ke client. Function ini lalu memanggil
 * fetch("/api/analyzer", { method: "POST", body: ... }) dari sisi client.
 * ============================================================================
 */

function estimatePaFromInputs(input: AnalyzerInput): number {
  // Heuristik sederhana untuk demo — mensimulasikan model NIRS-PLS.
  let base = 30;
  if (input.color === "Coklat Muda") base += 3;
  if (input.color === "Coklat Tua") base += 1.5;
  if (input.color === "Jernih") base -= 4;
  if (input.viscosity === "Sedang") base += 1.2;
  if (input.viscosity === "Tinggi") base += 0.5;
  if (input.distillationMethod === "Penyulingan Uap") base += 1.5;
  if (input.region.toLowerCase().includes("gayo")) base += 1.5; // dataran tinggi -> rendemen lebih baik
  const jitter = (Math.random() - 0.5) * 1.2;
  return Math.round((base + jitter) * 10) / 10;
}

function gradeFromPa(pa: number): AnalyzerResult["grade"] {
  if (pa >= 32) return "Premium";
  if (pa >= 28) return "Standard";
  if (pa >= 20) return "Economy";
  return "Reject";
}

export async function runNilamAnalyzer(input: AnalyzerInput): Promise<AnalyzerResult> {
  // Jika region & karakteristik cocok persis dengan profil Pak Syukur, kembalikan
  // angka terkunci 34.2% agar konsisten dengan cerita demo di seluruh platform.
  const isGayoProfile =
    input.region.toLowerCase().includes("gayo") &&
    input.color === "Coklat Muda" &&
    input.distillationMethod === "Penyulingan Uap";

  const paLevel = isGayoProfile ? 34.2 : estimatePaFromInputs(input);
  const grade = gradeFromPa(paLevel);

  const priceMap: Record<string, [number, number]> = {
    Premium: [1250000, 1480000],
    Standard: [950000, 1180000],
    Economy: [650000, 900000],
    Reject: [300000, 500000],
  };
  const [min, max] = priceMap[grade];

  const tips: string[] = [];
  if (grade !== "Premium") {
    tips.push("Pertimbangkan memanen daun di usia 6-8 bulan untuk kadar PA lebih tinggi.");
    tips.push("Gunakan metode penyulingan uap dengan tekanan rendah selama 8 jam.");
  }
  if (input.viscosity === "Rendah") {
    tips.push("Kekentalan rendah dapat mengindikasikan kadar air tinggi — periksa proses layu sebelum penyulingan.");
  }

  return {
    paLevel,
    grade,
    acidNumber: Math.round((3.2 + Math.random() * 1.5) * 100) / 100,
    density: Math.round((0.94 + Math.random() * 0.04) * 1000) / 1000,
    confidenceScore: isGayoProfile ? 96.3 : Math.round((85 + Math.random() * 10) * 10) / 10,
    recommendedPriceMin: min,
    recommendedPriceMax: max,
    improvementTips: tips,
    analyzedAt: new Date().toISOString(),
  };
}
