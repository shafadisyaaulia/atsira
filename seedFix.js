require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedAll() {
  // Get users
  const { data: pemastaUsers } = await supabase.from("profiles").select("id").eq("role", "pemasta");
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani", "umkm", "seller"]);

  const pemastaId = pemastaUsers?.[0]?.id || null;
  const petaniId = petaniUsers?.[0]?.id || null;

  // 1. SEED market_price_updates (pakai kolom yang benar: pemasta_id, region, price_per_kg, notes, created_at)
  await supabase.from("market_price_updates").delete().gte("price_per_kg", 0);

  const r1 = await supabase.from("market_price_updates").insert([
    { pemasta_id: pemastaId, region: "Aceh Selatan", price_per_kg: 550000, notes: "BCH-ABCD1 | 120 Kg | PA 33.4% | Uap (Steam) | 6 Bulan", created_at: "2026-09-10T08:00:00Z" },
    { pemasta_id: pemastaId, region: "Aceh Besar", price_per_kg: 520000, notes: "BCH-EFGH2 | 80 Kg | PA 31.8% | Uap (Steam) | 5 Bulan", created_at: "2026-09-05T08:00:00Z" },
    { pemasta_id: pemastaId, region: "Gayo Lues", price_per_kg: 580000, notes: "BCH-IJKL3 | 200 Kg | PA 35.1% | Uap (Steam) | 7 Bulan", created_at: "2026-08-28T08:00:00Z" },
    { pemasta_id: pemastaId, region: "Aceh Tengah", price_per_kg: 545000, notes: "BCH-MNOP4 | 150 Kg | PA 32.7% | Uap (Steam) | 6 Bulan", created_at: "2026-08-20T08:00:00Z" },
  ]);
  console.log("market_price_updates:", r1.error ? r1.error.message : "OK (4 rows)");

  // 2. SEED verification_queue (pakai kolom: farmer_id, product_title, sample_volume, status, notes, created_at)
  await supabase.from("verification_queue").delete().gte("sample_volume", 0);

  const r2 = await supabase.from("verification_queue").insert([
    { farmer_id: petaniId, product_title: "Syukur Agro Farm", sample_volume: 5, status: "Dalam Proses", notes: "Aceh Selatan", created_at: "2026-09-14T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Koperasi Nilam Lhoong", sample_volume: 10, status: "Menunggu Sampel", notes: "Aceh Besar", created_at: "2026-09-12T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Petani Mandiri Gayo", sample_volume: 3, status: "Lulus", notes: "Gayo Lues", created_at: "2026-09-08T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Atsiri Farm Bireuen", sample_volume: 7, status: "Menunggu Sampel", notes: "Bireuen", created_at: "2026-09-05T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Mitra Tani Aceh Tengah", sample_volume: 4, status: "Ditolak", notes: "Aceh Tengah", created_at: "2026-09-01T08:00:00Z" },
  ]);
  console.log("verification_queue:", r2.error ? r2.error.message : "OK (5 rows)");

  // Check field_stories yang sudah berhasil tadi
  const { data: fs } = await supabase.from("field_stories").select("id, title");
  console.log("field_stories (existing):", fs?.map(f => f.title));

  console.log("\nDONE!");
}
seedAll();
