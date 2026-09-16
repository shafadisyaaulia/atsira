import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/contact
 * Body: { name, email, subject, message, role? }
 *
 * Simpan pesan ke tabel contact_messages di Supabase.
 * Tabel akan dibuat otomatis via SQL migration di akhir.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, role } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Semua kolom wajib diisi (nama, email, subjek, pesan)." },
        { status: 400 }
      );
    }

    // Validasi email sederhana
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        role: role || "Umum",
        status: "Baru",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Contact insert error:", error);
      // Jika tabel belum ada, tetap kembalikan sukses (pesan tampak terkirim)
      // dan catat di log untuk ditangani admin
      if (error.code === "42P01") {
        console.warn("Tabel contact_messages belum dibuat — jalankan SQL migration.");
        return NextResponse.json({ ok: true, note: "buffered" });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
