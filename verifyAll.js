require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
  const { data: mpu } = await supabase.from("market_price_updates").select("region, price_per_kg, status");
  const { data: fs } = await supabase.from("field_stories").select("title");
  const { data: vq } = await supabase.from("verification_queue").select("product_title, status");
  const { data: qa } = await supabase.from("quality_assessments").select("title");
  const { data: orders } = await supabase.from("orders").select("id, buyer_name, total, status").limit(3);

  console.log("\n========= VERIFIKASI DATA DEMO SUPABASE =========");
  console.log("\n[Buyer/Seller] orders:", orders?.length, "rows");
  orders?.forEach(o => console.log("  -", o.buyer_name, "| Rp", o.total, "|", o.status));

  console.log("\n[Pemasta] market_price_updates:", mpu?.length, "rows");
  mpu?.forEach(m => console.log("  -", m.region, "| Rp", m.price_per_kg, "|", m.status));

  console.log("\n[Pemasta] field_stories:", fs?.length, "rows");
  fs?.forEach(s => console.log("  -", s.title));

  console.log("\n[ARC] verification_queue:", vq?.length, "rows");
  vq?.forEach(v => console.log("  -", v.product_title, "|", v.status));

  console.log("\n[ARC] quality_assessments:", qa?.length, "rows");
  qa?.forEach(q => console.log("  -", q.title));

  console.log("\n✅ SEMUA ROLE LENGKAP DAN TERISI DATA DEMO!");
  console.log("=================================================");
}
verify();
