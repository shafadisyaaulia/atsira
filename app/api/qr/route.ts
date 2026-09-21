import { NextResponse } from "next/server";
import QRCode from "qrcode";

/**
 * GET /api/qr?data=<url_or_code>&label=<label>
 *
 * Generate QR code sebagai PNG (base64 data URL).
 * QR mengarah ke halaman traceability atSira dengan batch ID.
 *
 * Contoh: /api/qr?data=PAT-2026-001&label=Nilam+Grade+A
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawData = searchParams.get("data") || "";
  const label = searchParams.get("label") || "";

  if (!rawData) {
    return NextResponse.json({ error: "Parameter 'data' wajib diisi" }, { status: 400 });
  }

  // Bangun URL traceability lengkap — pastikan QR bisa di-scan dari mana saja
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://atsira.id";
  const traceUrl = `${appUrl}/traceability?batch=${encodeURIComponent(rawData)}`;

  try {
    // Generate QR sebagai PNG data URL
    const qrDataUrl = await QRCode.toDataURL(traceUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1a3a2a",   // Warna gelap: hijau tua atSira
        light: "#ffffff",
      },
      errorCorrectionLevel: "H", // High — tahan terhadap kerusakan label
    });

    return NextResponse.json({
      ok: true,
      qrDataUrl,
      traceUrl,
      label,
      batchId: rawData,
    });
  } catch (err: any) {
    console.error("QR generation error:", err);
    return NextResponse.json({ error: "Gagal generate QR code" }, { status: 500 });
  }
}
