require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedMinimal() {
  const { data: pemastaUsers } = await supabase.from("profiles").select("id").eq("role", "pemasta");
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani", "umkm", "seller"]);
  const pemastaId = pemastaUsers?.[0]?.id || null;
  const petaniId = petaniUsers?.[0]?.id || null;

  // market_price_updates - tanpa notes
  const r1 = await supabase.from("market_price_updates").insert([
    { pemasta_id: pemastaId, region: "Aceh Selatan", price_per_kg: 550000, created_at: "2026-09-10T08:00:00Z" },
    { pemasta_id: pemastaId, region: "Aceh Besar", price_per_kg: 520000, created_at: "2026-09-05T08:00:00Z" },
    { pemasta_id: pemastaId, region: "Gayo Lues", price_per_kg: 580000, created_at: "2026-08-28T08:00:00Z" },
    { pemasta_id: pemastaId, region: "Aceh Tengah", price_per_kg: 545000, created_at: "2026-08-20T08:00:00Z" },
  ]);
  console.log("market_price_updates:", r1.error ? r1.error.message : "OK (4 rows)");

  // verification_queue - tanpa notes
  const r2 = await supabase.from("verification_queue").insert([
    { farmer_id: petaniId, product_title: "Syukur Agro Farm", sample_volume: 5, status: "Dalam Proses" },
    { farmer_id: petaniId, product_title: "Koperasi Nilam Lhoong", sample_volume: 10, status: "Menunggu Sampel" },
    { farmer_id: petaniId, product_title: "Petani Mandiri Gayo", sample_volume: 3, status: "Lulus" },
    { farmer_id: petaniId, product_title: "Atsiri Farm Bireuen", sample_volume: 7, status: "Menunggu Sampel" },
    { farmer_id: petaniId, product_title: "Mitra Tani Aceh Tengah", sample_volume: 4, status: "Ditolak" },
  ]);
  console.log("verification_queue:", r2.error ? r2.error.message : "OK (5 rows)");
  
  // Re-check field_stories
  const { data: fs, error: fse } = await supabase.from("field_stories").select("id").limit(1);
  if (fse) {
    console.log("field_stories error:", fse.message);
    // Tabel mungkin namanya berbeda, coba 'stories'
    const { data: st, error: ste } = await supabase.from("stories").select("id").limit(1);
    console.log("stories table:", ste ? ste.message : "EXISTS");
  } else {
    console.log("field_stories EXISTS, rows:", fs?.length);
  }
  
  console.log("\nDONE!");
}
seedMinimal();
