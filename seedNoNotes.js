require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedWithoutNotes() {
  const { data: pemastaUsers } = await supabase.from("profiles").select("id").eq("role", "pemasta");
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani","umkm","seller"]);
  const pemastaId = pemastaUsers?.[0]?.id || null;
  const petaniId = petaniUsers?.[0]?.id || null;

  // market_price_updates tanpa kolom 'notes'
  const r1 = await supabase.from("market_price_updates").insert([
    { pemasta_id: pemastaId, batch_id: "BCH-ABCD1", region: "Aceh Selatan", quantity_kg: 120, pa_level: 33.4, price_per_kg: 550000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified", created_at: "2026-09-10T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-EFGH2", region: "Aceh Besar", quantity_kg: 80, pa_level: 31.8, price_per_kg: 520000, method: "Uap (Steam)", leaf_age: "5 Bulan", status: "Verified", created_at: "2026-09-05T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-IJKL3", region: "Gayo Lues", quantity_kg: 200, pa_level: 35.1, price_per_kg: 580000, method: "Uap (Steam)", leaf_age: "7 Bulan", status: "Unverified", created_at: "2026-08-28T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-MNOP4", region: "Aceh Tengah", quantity_kg: 150, pa_level: 32.7, price_per_kg: 545000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified", created_at: "2026-08-20T08:00:00Z" },
  ]);
  console.log("market_price_updates:", r1.error ? "ERROR: " + r1.error.message : "OK - 4 log harga");

  // verification_queue tanpa kolom 'notes'
  const r2 = await supabase.from("verification_queue").insert([
    { farmer_id: petaniId, product_title: "Syukur Agro Farm — Batch BCH-ABCD1", sample_volume: 5, status: "Dalam Proses", created_at: "2026-09-14T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Koperasi Nilam Lhoong — Batch BCH-XYZ7", sample_volume: 10, status: "Menunggu Sampel", created_at: "2026-09-12T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Petani Mandiri Gayo — Batch BCH-IJKL3", sample_volume: 3, status: "Lulus", created_at: "2026-09-08T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Atsiri Farm Bireuen — Batch BCH-QRS8", sample_volume: 7, status: "Menunggu Sampel", created_at: "2026-09-05T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Mitra Tani Aceh Tengah — Batch BCH-MNOP4", sample_volume: 4, status: "Ditolak", created_at: "2026-09-01T08:00:00Z" },
  ]);
  console.log("verification_queue:", r2.error ? "ERROR: " + r2.error.message : "OK - 5 antrean");

  console.log("\n✅ SELESAI TOTAL!");
}
seedWithoutNotes();
