require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPemastaAndArc() {
  console.log("Seeding data untuk Pemasta dan ARC...");

  // Get pemasta user IDs
  const { data: pemastaUsers } = await supabase.from("profiles").select("id, email").eq("role", "pemasta");
  // Get peneliti/arc user IDs
  const { data: penelitiUsers } = await supabase.from("profiles").select("id, email").in("role", ["peneliti", "arc"]);
  // Get petani users for queue
  const { data: petaniUsers } = await supabase.from("profiles").select("id, email").in("role", ["petani", "umkm", "seller"]);

  console.log("Pemasta users:", pemastaUsers?.map(u => u.email));
  console.log("Peneliti users:", penelitiUsers?.map(u => u.email));

  // 1. SEED market_price_updates (untuk Pemasta)
  await supabase.from("market_price_updates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  const pemastaId = pemastaUsers?.[0]?.id || null;
  const marketPrices = [
    { pemasta_id: pemastaId, batch_id: "BCH-ABCD1", region: "Aceh Selatan", report_date: "2026-09-10", quantity_kg: 120, pa_level: 33.4, price_per_kg: 550000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified" },
    { pemasta_id: pemastaId, batch_id: "BCH-EFGH2", region: "Aceh Besar", report_date: "2026-09-05", quantity_kg: 80, pa_level: 31.8, price_per_kg: 520000, method: "Uap (Steam)", leaf_age: "5 Bulan", status: "Verified" },
    { pemasta_id: pemastaId, batch_id: "BCH-IJKL3", region: "Gayo Lues", report_date: "2026-08-28", quantity_kg: 200, pa_level: 35.1, price_per_kg: 580000, method: "Uap (Steam)", leaf_age: "7 Bulan", status: "Unverified" },
    { pemasta_id: pemastaId, batch_id: "BCH-MNOP4", region: "Aceh Tengah", report_date: "2026-08-20", quantity_kg: 150, pa_level: 32.7, price_per_kg: 545000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified" },
  ];

  const mpu = await supabase.from("market_price_updates").insert(marketPrices.map(p => ({
    pemasta_id: p.pemasta_id,
    region: p.region,
    price_per_kg: p.price_per_kg,
    notes: `Batch ${p.batch_id} | ${p.quantity_kg} Kg | PA ${p.pa_level}% | ${p.method} | ${p.leaf_age}`,
    created_at: new Date(p.report_date).toISOString()
  })));
  console.log("market_price_updates:", mpu.error ? mpu.error.message : "OK");

  // 2. SEED field_stories (untuk Pemasta - Nilam Story Hub)
  await supabase.from("field_stories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const stories = [
    { slug: "rembug-petani-aceh-selatan-2026", title: "Rembug Petani Nilam Aceh Selatan 2026", category: "Kegiatan Komunitas", excerpt: "Komunitas petani nilam di Aceh Selatan menggelar rembug tahunan untuk membahas strategi peningkatan mutu dan harga jual minyak atsiri di pasar global.", author: "Tim Pemasta ATSIRA", author_role: "Pemasta Node", region: "Aceh Selatan", published_at: "2026-09-10", read_minutes: 4, featured: true },
    { slug: "panen-raya-nilam-gayo-lues", title: "Panen Raya Nilam di Gayo Lues Capai 200 Kg Batch", category: "Laporan Panen", excerpt: "Petani binaan ATSIRA di Gayo Lues berhasil memanen 200 kilogram minyak nilam murni dengan kadar PA 35% — melampaui standar ekspor internasional.", author: "Syukur Pemasta", author_role: "Pemasta Node", region: "Gayo Lues", published_at: "2026-09-05", read_minutes: 3, featured: false },
    { slug: "inovasi-alat-suling-tradisional", title: "Inovasi Alat Suling: Efisiensi Meningkat 40%", category: "Inovasi Teknologi", excerpt: "Kelompok tani nilam di Aceh Besar berhasil memodifikasi alat penyulingan tradisional sehingga waktu produksi berkurang 40% tanpa mengorbankan kualitas.", author: "Kelompok Tani Maju", author_role: "Mitra Pemasta", region: "Aceh Besar", published_at: "2026-08-28", read_minutes: 5, featured: false },
    { slug: "harga-minyak-nilam-naik-signifikan", title: "Harga Minyak Nilam Naik Signifikan di Q3 2026", category: "Analisis Harga", excerpt: "Tren kenaikan harga minyak nilam dunia memberikan angin segar bagi petani lokal. Data menunjukkan kenaikan 12% dari Q2 ke Q3 2026.", author: "Tim Pemasta ATSIRA", author_role: "Pemasta Node", region: "Aceh", published_at: "2026-08-20", read_minutes: 3, featured: false },
  ];

  const fsResult = await supabase.from("field_stories").insert(stories);
  console.log("field_stories:", fsResult.error ? fsResult.error.message : "OK");

  // 3. SEED verification_queue (untuk ARC/Peneliti)
  await supabase.from("verification_queue").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const petaniId = petaniUsers?.[0]?.id || null;
  const verificationQueue = [
    { farmer_id: petaniId, product_title: "Syukur Agro Farm", sample_volume: 5, status: "Dalam Proses", notes: "Aceh Selatan" },
    { farmer_id: petaniId, product_title: "Koperasi Nilam Lhoong", sample_volume: 10, status: "Menunggu", notes: "Aceh Besar" },
    { farmer_id: petaniId, product_title: "Petani Mandiri Gayo", sample_volume: 3, status: "Lulus", notes: "Gayo Lues" },
    { farmer_id: petaniId, product_title: "Atsiri Farm Bireuen", sample_volume: 7, status: "Menunggu", notes: "Bireuen" },
    { farmer_id: petaniId, product_title: "Mitra Tani Aceh Tengah", sample_volume: 4, status: "Ditolak", notes: "Aceh Tengah" },
  ];

  const vqResult = await supabase.from("verification_queue").insert(verificationQueue);
  console.log("verification_queue:", vqResult.error ? vqResult.error.message : "OK");

  console.log("\nSELESAI! Semua data demo untuk Pemasta dan ARC telah berhasil ditanam.");
}

seedPemastaAndArc();
