require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function finalSeed() {
  const { data: pemastaUsers } = await supabase.from("profiles").select("id").eq("role", "pemasta");
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani","umkm","seller"]);
  const pemastaId = pemastaUsers?.[0]?.id || null;
  const petaniId = petaniUsers?.[0]?.id || null;

  // market_price_updates - pakai alter_tables_final.sql hasilnya: batch_id NOT NULL? 
  // Coba tanpa batch_id
  const r1 = await supabase.from("market_price_updates").insert([
    { pemasta_id: pemastaId, batch_id: "BCH-ABCD1", region: "Aceh Selatan", quantity_kg: 120, pa_level: 33.4, price_per_kg: 550000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified", created_at: "2026-09-10T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-EFGH2", region: "Aceh Besar", quantity_kg: 80, pa_level: 31.8, price_per_kg: 520000, method: "Uap (Steam)", leaf_age: "5 Bulan", status: "Verified", created_at: "2026-09-05T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-IJKL3", region: "Gayo Lues", quantity_kg: 200, pa_level: 35.1, price_per_kg: 580000, method: "Uap (Steam)", leaf_age: "7 Bulan", status: "Unverified", created_at: "2026-08-28T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-MNOP4", region: "Aceh Tengah", quantity_kg: 150, pa_level: 32.7, price_per_kg: 545000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified", created_at: "2026-08-20T08:00:00Z" },
  ]);
  console.log("market_price_updates:", r1.error ? "ERROR: " + r1.error.message : "OK - 4 log harga");

  // verification_queue - pakai market_price_updates lama yang ada kolom farmer_id, product_title, sample_volume, status
  // Ada kemungkinan ada 2 tabel verification_queue (schema berbeda). Coba raw REST
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/verification_queue?select=*&limit=1`, {
    headers: {
      "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
  const vqData = await res.json();
  console.log("verification_queue REST sample:", JSON.stringify(vqData));

  // Insert verification_queue via REST juga
  const res2 = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/verification_queue`, {
    method: "POST",
    headers: {
      "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify([
      { farmer_id: petaniId, product_title: "Syukur Agro Farm — Batch BCH-ABCD1", sample_volume: 5, status: "Dalam Proses" },
      { farmer_id: petaniId, product_title: "Koperasi Nilam Lhoong — Batch BCH-XYZ7", sample_volume: 10, status: "Menunggu Sampel" },
      { farmer_id: petaniId, product_title: "Petani Mandiri Gayo — Batch BCH-IJKL3", sample_volume: 3, status: "Lulus" },
      { farmer_id: petaniId, product_title: "Atsiri Farm Bireuen — Batch BCH-QRS8", sample_volume: 7, status: "Menunggu Sampel" },
      { farmer_id: petaniId, product_title: "Mitra Tani Aceh Tengah — Batch BCH-MNOP4", sample_volume: 4, status: "Ditolak" },
    ])
  });
  const vqRes = await res2.text();
  console.log("verification_queue insert via REST:", res2.status, vqRes || "OK");

  console.log("\n=== RINGKASAN DATA DEMO ===");
  const { data: mpu } = await supabase.from("market_price_updates").select("id");
  const { data: fs } = await supabase.from("field_stories").select("id");
  const { data: qa } = await supabase.from("quality_assessments").select("id");
  console.log("market_price_updates:", mpu?.length, "rows");
  console.log("field_stories:", fs?.length, "rows");
  console.log("quality_assessments:", qa?.length, "rows");
}
finalSeed();
