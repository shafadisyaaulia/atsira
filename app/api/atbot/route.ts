import { NextResponse } from "next/server";

/**
 * POST /api/atbot
 * Body: { messages: { role: "user" | "assistant", content: string }[] }
 *
 * Mengirimkan riwayat percakapan ke Groq API (model: llama3-70b-8192)
 * dan mengembalikan balasan Nila — asisten virtual ATSIRA.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Kamu adalah AtBot 🌿, asisten virtual ATSIRA — platform agribisnis minyak nilam Indonesia.

Kepribadianmu:
- Ramah, hangat, dan suportif
- Berbicara dalam Bahasa Indonesia yang santai tapi tetap profesional
- Fokus pada topik nilam, petani, UMKM, dan platform ATSIRA
- Jawaban ringkas (maks 3-4 kalimat), kecuali diminta penjelasan panjang

Pengetahuanmu mencakup:
- Budidaya nilam: usia panen ideal (6-8 bulan), proses layu, penyulingan uap vs air
- Standar mutu: kadar Patchouli Alcohol (PA%), SNI 06-2385-2006
  - Grade A (Super/Ekspor): PA ≥ 32%
  - Grade B (Lokal Top): PA 30-31.9%
  - Grade C (Standard): PA < 30%
- Platform ATSIRA: cara listing produk, cara pakai QualitySense, cara cek harga pasar
- Harga: bervariasi tergantung grade dan wilayah, Pemasta yang menentukan harga referensi terbaru

Jika pertanyaan di luar topik nilam/ATSIRA, tetap bantu tapi arahkan kembali ke konteks pertanian nilam.
Jangan membahas politik, agama, atau topik sensitif.
Selalu akhiri dengan tawaran bantuan lanjutan jika relevan.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages tidak valid" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      // Fallback jika Groq key belum diisi — kembalikan pesan informatif
      return NextResponse.json({
        reply: "Maaf, saya sedang dalam mode offline. Silakan hubungi tim ATSIRA untuk bantuan lebih lanjut! 🌿",
      });
    }

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          // Kirim maks 10 pesan terakhir untuk hemat token
          ...messages.slice(-10).map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API error:", err);
      return NextResponse.json({
        reply: "Saya sedang mengalami gangguan koneksi. Coba lagi sebentar ya! 🌿",
      });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Maaf, saya tidak bisa menjawab saat ini.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AtBot error:", error);
    return NextResponse.json({
      reply: "Terjadi kesalahan. Silakan coba lagi! 🌿",
    });
  }
}
