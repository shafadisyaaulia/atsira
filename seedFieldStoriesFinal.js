require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedFieldStories() {
  const r = await supabase.from("field_stories").insert([
    {
      slug: "rembug-petani-nilam-aceh-selatan-2026",
      title: "Rembug Petani Nilam Aceh Selatan 2026",
      category: "Kegiatan Komunitas",
      excerpt: "Komunitas petani nilam di Aceh Selatan menggelar rembug tahunan untuk membahas strategi peningkatan mutu dan harga jual minyak atsiri di pasar global.",
      content: ["Komunitas petani nilam di Aceh Selatan menggelar rembug tahunan yang dihadiri lebih dari 50 petani dari berbagai kecamatan.", "Diskusi berfokus pada penerapan sistem QualitySense AI dari ATSIRA untuk menjaga standar kadar PA di atas 30%."],
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
      content: ["Musim panen raya nilam di Gayo Lues mencatat rekor baru dengan 200 kg minyak berkualitas tinggi dalam satu siklus produksi.", "Kadar PA 35.1% jauh melampaui standar ekspor minimum 30%, membuka peluang pasar premium di Eropa dan Amerika."],
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
      content: ["Inovasi pada kondensor alat suling tradisional berhasil mempersingkat proses dari 8 jam menjadi hanya 4.8 jam per batch.", "Kadar PA tetap terjaga di kisaran 31-32% meski efisiensi waktu meningkat drastis."],
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
      content: ["Data ATSIRA menunjukkan kenaikan harga minyak nilam 12% di Q3 2026 yang didorong meningkatnya permintaan parfum global.", "Harga rata-rata nasional kini Rp 550.000/kg, dengan premium untuk PA di atas 33% mencapai Rp 580.000/kg."],
      author: "Tim Pemasta ATSIRA",
      author_role: "Pemasta Node",
      region: "Aceh",
      published_at: "2026-08-20",
      read_minutes: 3,
      featured: false
    },
  ]);
  console.log("field_stories:", r.error ? "ERROR: " + r.error.message : "OK - 4 cerita");

  // VERIFIKASI AKHIR SEMUA TABEL
  console.log("\n══════════════════════════════════════");
  console.log("  VERIFIKASI FINAL SEMUA DATA DEMO");
  console.log("══════════════════════════════════════");
  
  const [ord, mpu, vq, fs, qa, prod] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("market_price_updates").select("*", { count: "exact", head: true }),
    supabase.from("verification_queue").select("*", { count: "exact", head: true }),
    supabase.from("field_stories").select("*", { count: "exact", head: true }),
    supabase.from("quality_assessments").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);

  console.log("✅ orders (Buyer & Seller)      :", ord.count, "baris");
  console.log("✅ products (Produk etalase)    :", prod.count, "baris");
  console.log("✅ market_price_updates (Pemasta):", mpu.count, "baris");
  console.log("✅ field_stories (Story Hub)    :", fs.count, "baris");
  console.log("✅ verification_queue (ARC)     :", vq.count, "baris");
  console.log("✅ quality_assessments (ARC)    :", qa.count, "baris");
  console.log("══════════════════════════════════════");
  console.log("  SEMUA ROLE SUDAH PUNYA DATA! 🎉");
  console.log("══════════════════════════════════════");
}

seedFieldStories();
