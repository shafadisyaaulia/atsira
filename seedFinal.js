require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedAll() {
  const { data: pemastaUsers } = await supabase.from("profiles").select("id").eq("role", "pemasta");
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani","umkm","seller"]);
  const pemastaId = pemastaUsers?.[0]?.id || null;
  const petaniId = petaniUsers?.[0]?.id || null;

  // === 1. market_price_updates ===
  await supabase.from("market_price_updates").delete().gte("price_per_kg", 0);
  const r1 = await supabase.from("market_price_updates").insert([
    { pemasta_id: pemastaId, batch_id: "BCH-ABCD1", region: "Aceh Selatan", quantity_kg: 120, pa_level: 33.4, price_per_kg: 550000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified", notes: "Kualitas premium, siap ekspor", created_at: "2026-09-10T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-EFGH2", region: "Aceh Besar", quantity_kg: 80, pa_level: 31.8, price_per_kg: 520000, method: "Uap (Steam)", leaf_age: "5 Bulan", status: "Verified", notes: "Memenuhi standar SNI", created_at: "2026-09-05T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-IJKL3", region: "Gayo Lues", quantity_kg: 200, pa_level: 35.1, price_per_kg: 580000, method: "Uap (Steam)", leaf_age: "7 Bulan", status: "Unverified", notes: "Menunggu verifikasi lab ARC", created_at: "2026-08-28T08:00:00Z" },
    { pemasta_id: pemastaId, batch_id: "BCH-MNOP4", region: "Aceh Tengah", quantity_kg: 150, pa_level: 32.7, price_per_kg: 545000, method: "Uap (Steam)", leaf_age: "6 Bulan", status: "Verified", notes: "Batch reguler bulanan", created_at: "2026-08-20T08:00:00Z" },
  ]);
  console.log("market_price_updates:", r1.error ? "ERROR: " + r1.error.message : "OK - 4 baris");

  // === 2. field_stories (Nilam Story Hub Pemasta) ===
  await supabase.from("field_stories").delete().neq("slug", "none");
  const r2 = await supabase.from("field_stories").insert([
    {
      slug: "rembug-petani-nilam-aceh-selatan-2026",
      title: "Rembug Petani Nilam Aceh Selatan 2026",
      category: "Kegiatan Komunitas",
      excerpt: "Komunitas petani nilam di Aceh Selatan menggelar rembug tahunan untuk membahas strategi peningkatan mutu dan harga jual minyak atsiri di pasar global.",
      content: ["Komunitas petani nilam di Aceh Selatan menggelar rembug tahunan. Forum ini dihadiri oleh lebih dari 50 petani dari berbagai kecamatan. Diskusi berfokus pada strategi peningkatan mutu minyak atsiri untuk memenuhi standar ekspor internasional.", "Salah satu keputusan penting adalah penerapan sistem kontrol kualitas berbasis teknologi QualitySense AI dari ATSIRA untuk memastikan setiap batch minyak nilam yang diproduksi memenuhi standar kadar PA di atas 30%."],
      author: "Tim Pemasta ATSIRA",
      author_role: "Pemasta Node",
      region: "Aceh Selatan",
      published_at: "2026-09-10",
      read_minutes: 4,
      featured: true
    },
    {
      slug: "panen-raya-nilam-gayo-lues-200kg",
      title: "Panen Raya Nilam di Gayo Lues Capai 200 Kg Batch",
      category: "Laporan Panen",
      excerpt: "Petani binaan ATSIRA di Gayo Lues berhasil memanen 200 kilogram minyak nilam murni dengan kadar PA 35% — melampaui standar ekspor internasional.",
      content: ["Musim panen raya nilam di Kabupaten Gayo Lues mencatat rekor baru. Dengan dukungan sistem penyulingan modern dan pendampingan intensif dari tim ATSIRA, petani berhasil menghasilkan 200 kg minyak nilam berkualitas tinggi dalam satu siklus produksi.", "Kadar patchouli alcohol (PA) yang mencapai 35.1% jauh melampaui standar ekspor minimum sebesar 30%, membuka peluang pasar premium di Eropa dan Amerika."],
      author: "Syukur Pemasta",
      author_role: "Pemasta Node",
      region: "Gayo Lues",
      published_at: "2026-09-05",
      read_minutes: 3,
      featured: false
    },
    {
      slug: "inovasi-alat-suling-efisiensi-40-persen",
      title: "Inovasi Alat Suling: Efisiensi Meningkat 40%",
      category: "Inovasi Teknologi",
      excerpt: "Kelompok tani nilam di Aceh Besar berhasil memodifikasi alat penyulingan tradisional sehingga waktu produksi berkurang 40% tanpa mengorbankan kualitas.",
      content: ["Inovasi sederhana namun berdampak besar hadir dari kelompok tani Aceh Besar. Mereka berhasil memodifikasi desain kondensor pada alat penyulingan tradisional sehingga proses pendinginan uap menjadi lebih efisien.", "Hasilnya luar biasa: waktu penyulingan berkurang dari 8 jam menjadi hanya 4.8 jam per batch, sementara kadar PA tetap terjaga di kisaran 31-32%."],
      author: "Kelompok Tani Maju",
      author_role: "Mitra Pemasta",
      region: "Aceh Besar",
      published_at: "2026-08-28",
      read_minutes: 5,
      featured: false
    },
    {
      slug: "harga-minyak-nilam-naik-q3-2026",
      title: "Harga Minyak Nilam Naik Signifikan di Q3 2026",
      category: "Analisis Harga",
      excerpt: "Tren kenaikan harga minyak nilam dunia memberikan angin segar bagi petani lokal. Data menunjukkan kenaikan 12% dari Q2 ke Q3 2026.",
      content: ["Data terkini dari platform ATSIRA menunjukkan kenaikan harga minyak nilam sebesar 12% di kuartal ketiga 2026 dibandingkan kuartal sebelumnya. Kenaikan ini didorong oleh meningkatnya permintaan dari industri parfum global.", "Harga rata-rata nasional kini berada di kisaran Rp 550.000 per kilogram, dengan premium untuk kualitas PA di atas 33% mencapai Rp 580.000 per kilogram."],
      author: "Tim Pemasta ATSIRA",
      author_role: "Pemasta Node",
      region: "Aceh",
      published_at: "2026-08-20",
      read_minutes: 3,
      featured: false
    },
  ]);
  console.log("field_stories:", r2.error ? "ERROR: " + r2.error.message : "OK - 4 cerita");

  // === 3. verification_queue (ARC/Peneliti) ===
  await supabase.from("verification_queue").delete().neq("product_title", "none");
  const r3 = await supabase.from("verification_queue").insert([
    { farmer_id: petaniId, product_title: "Syukur Agro Farm — Batch BCH-ABCD1", sample_volume: 5, status: "Dalam Proses", notes: "Aceh Selatan", created_at: "2026-09-14T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Koperasi Nilam Lhoong — Batch BCH-XYZ7", sample_volume: 10, status: "Menunggu Sampel", notes: "Aceh Besar", created_at: "2026-09-12T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Petani Mandiri Gayo — Batch BCH-IJKL3", sample_volume: 3, status: "Lulus", notes: "Gayo Lues", created_at: "2026-09-08T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Atsiri Farm Bireuen — Batch BCH-QRS8", sample_volume: 7, status: "Menunggu Sampel", notes: "Bireuen", created_at: "2026-09-05T08:00:00Z" },
    { farmer_id: petaniId, product_title: "Mitra Tani Aceh Tengah — Batch BCH-MNOP4", sample_volume: 4, status: "Ditolak", notes: "Aceh Tengah", created_at: "2026-09-01T08:00:00Z" },
  ]);
  console.log("verification_queue:", r3.error ? "ERROR: " + r3.error.message : "OK - 5 antrean");

  // === 4. quality_assessments (ARC riset panel) ===
  const r4 = await supabase.from("quality_assessments").insert([
    { title: "Analisis Kadar PA Minyak Nilam Aceh 2026", category: "Riset Kimia", excerpt: "Penelitian komprehensif tentang fluktuasi kadar patchouli alcohol pada minyak nilam dari berbagai daerah di Aceh selama 2026.", published_at: "2026-09-01" },
    { title: "Pengaruh Umur Daun terhadap Yield Penyulingan", category: "Agronomi", excerpt: "Studi lapangan tentang korelasi antara umur panen daun nilam dengan hasil minyak dan kadar PA yang dihasilkan.", published_at: "2026-08-15" },
    { title: "Standar SNI Minyak Nilam: Pembaruan 2026", category: "Regulasi", excerpt: "Review dan pembaruan standar SNI untuk minyak nilam Indonesia menyesuaikan tuntutan pasar ekspor global.", published_at: "2026-07-20" },
  ]);
  console.log("quality_assessments:", r4.error ? "ERROR: " + r4.error.message : "OK - 3 artikel riset");

  console.log("\n✅ SEMUA DATA DEMO BERHASIL DITANAM!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Buyer/Seller: orders (sudah ada dari sebelumnya)");
  console.log("Pemasta: 4 log harga pasar + 4 cerita Nilam Story Hub");
  console.log("ARC/Peneliti: 5 antrean verifikasi + 3 artikel riset");
}

seedAll();
