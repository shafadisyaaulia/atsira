import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runNilamAnalyzer } from "@/lib/analyzer";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paActual = Number(body?.paActual);
    const { visualStyle, storageDuration, containerType } = body;

    if (!paActual || isNaN(paActual) || paActual <= 0 || paActual > 100) {
      return NextResponse.json(
        { error: "paActual tidak valid. Masukkan nilai antara 1-100." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase config missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Ambil harga referensi terbaru dari Pemasta
    const { data: priceData, error: priceError } = await supabase
      .from("market_price_updates")
      .select("price_per_kg, pa_level, region, report_date")
      .order("report_date", { ascending: false })
      .limit(1)
      .single();

    const DEFAULT_HARGA_BASE = 1_000_000;
    const hargaBase = priceError || !priceData ? DEFAULT_HARGA_BASE : Number(priceData.price_per_kg);

    // Jalankan kalkulasi base
    const result = runNilamAnalyzer(paActual, hargaBase);
    
    // Gunakan AI Gemini untuk melengkapi tips perbaikan mutu
    try {
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
          Kamu adalah AI spesialis minyak nilam (Patchouli Oil) atSira.
          Seorang petani baru saja mengetes minyak nilamnya dengan parameter fisik berikut:
          - Kadar PA (Patchouli Alcohol): ${paActual}% (Grade: ${result.grade})
          - Warna/Kondisi: ${visualStyle === "clear-yellow" ? "Bening/Kuning Cerah" : "Keruh/Cokelat Tua/Ada Endapan"}
          - Lama Simpan: ${storageDuration === "new" ? "Baru disuling" : "Sudah lama disimpan (>6 bulan)"}
          - Wadah: ${containerType === "plastic-glass" ? "Jerigen Plastik/Kaca" : "Drum Besi/Wadah Logam"}
          
          Berikan 2-3 tips atau evaluasi singkat dan praktis tentang kualitas minyak ini dan apa yang harus dilakukan petani (jika ada masalah).
          Balas DALAM BENTUK ARRAY STRING JSON SAJA (jangan ada format markdown atau teks pengantar), contoh:
          ["Gunakan wadah kaca agar tidak kontaminasi besi.", "Minyak sudah sangat baik, segera jual."]
        `;
        
        const aiResponse = await model.generateContent(prompt);
        let text = aiResponse.response.text().trim();
        if (text.startsWith("```json")) text = text.replace(/```json/g, "");
        if (text.startsWith("```")) text = text.replace(/```/g, "");
        
        const parsedTips = JSON.parse(text);
        if (Array.isArray(parsedTips)) {
          result.improvementTips = parsedTips;
        }
      }
    } catch (aiErr) {
      console.error("Gemini AI tips error:", aiErr);
      // Fallback ke tips bawaan yang sudah di set di runNilamAnalyzer jika gagal
    }

    return NextResponse.json({
      ok: true,
      result,
      hargaBaseUsed: hargaBase,
      dataSource: priceError || !priceData ? "default_fallback" : `market_price_updates (${priceData.region}, ${priceData.report_date})`,
    });
  } catch (error: any) {
    console.error("Analyzer error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
