require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
// Gunakan REST API langsung untuk bypass schema cache
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: "public" }, global: { headers: { "Accept-Profile": "public", "Content-Profile": "public" } } }
);

async function checkRealCols() {
  // Coba insert paling minimal untuk cek kolom apa yang tersedia
  const t1 = await supabase.from("market_price_updates").insert({ region: "Test", price_per_kg: 1 }).select();
  if (t1.error) {
    console.log("market_price_updates insert error:", t1.error.message);
  } else {
    console.log("market_price_updates cols:", Object.keys(t1.data?.[0] || {}));
    // Hapus test row
    if (t1.data?.[0]?.id) await supabase.from("market_price_updates").delete().eq("id", t1.data[0].id);
  }

  const t2 = await supabase.from("verification_queue").insert({ product_title: "Test", status: "Menunggu Sampel" }).select();
  if (t2.error) {
    console.log("verification_queue insert error:", t2.error.message);
  } else {
    console.log("verification_queue cols:", Object.keys(t2.data?.[0] || {}));
    if (t2.data?.[0]?.id) await supabase.from("verification_queue").delete().eq("id", t2.data[0].id);
  }
}
checkRealCols();
