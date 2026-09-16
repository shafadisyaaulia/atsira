import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/migrate-region
 * 
 * Route sementara untuk jalankan DDL migration sekali.
 * HAPUS file ini setelah berhasil dijalankan!
 * 
 * Cara pakai:
 * 1. Jalankan dev server: npm run dev
 * 2. Buka browser: http://localhost:3000/api/admin/migrate-region
 * 3. Lihat hasilnya
 * 4. Hapus file ini setelah selesai
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const results: Record<string, any> = {};

  // PostgreSQL DDL via Supabase .rpc() — kita buat function dulu jika belum ada,
  // lalu jalankan ALTER langsung via pg
  const migrations = [
    {
      name: "field_stories",
      sql: `DO $$ BEGIN ALTER TABLE public.field_stories ALTER COLUMN region TYPE text USING region::text; EXCEPTION WHEN others THEN NULL; END $$`,
    },
    {
      name: "market_price_updates",
      sql: `DO $$ BEGIN ALTER TABLE public.market_price_updates ALTER COLUMN region TYPE text USING region::text; EXCEPTION WHEN others THEN NULL; END $$`,
    },
    {
      name: "field_activity_logs",
      sql: `DO $$ BEGIN ALTER TABLE public.field_activity_logs ALTER COLUMN region TYPE text USING region::text; EXCEPTION WHEN others THEN NULL; END $$`,
    },
  ];

  for (const m of migrations) {
    // Supabase service role dapat akses raw SQL via pg-meta sidecar internal
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      }
    );

    // Gunakan supabase.rpc sebagai alternatif — tapi DDL butuh superuser.
    // Coba via direct query dengan supabase-js workaround:
    try {
      await supabase.from("_migrations_temp").select("*").limit(0).maybeSingle();
    } catch { /* ignore */ }

    results[m.name] = "DDL requires Supabase SQL Editor or CLI";
  }

  return NextResponse.json({
    message: "Supabase JS client tidak support DDL ALTER TABLE langsung. Gunakan SQL di bawah di Supabase Dashboard > SQL Editor:",
    sql: [
      "ALTER TABLE public.field_stories ALTER COLUMN region TYPE text USING region::text;",
      "ALTER TABLE public.market_price_updates ALTER COLUMN region TYPE text USING region::text;",
      "ALTER TABLE public.field_activity_logs ALTER COLUMN region TYPE text USING region::text;",
    ],
    note: "Kolom region saat ini masih ENUM. Aplikasi akan tetap BISA menampilkan data lama, tapi insert baru AKAN GAGAL jika nilai region tidak cocok dengan enum. Segera jalankan SQL di atas.",
  });
}
