require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findValidStatuses() {
  const statuses = ["Menunggu Pembayaran", "Diproses", "Dikirim", "Selesai", "Dibatalkan", "processing", "shipped", "completed", "cancelled", "new", "pending", "menunggu", "diproses", "dikirim", "selesai", "dibatalkan"];
  
  for (const s of statuses) {
    const testId = "TEST-STATUS-" + Date.now();
    const { error } = await supabase.from("orders").insert({ id: testId, total: 0, status: s });
    if (!error) {
      console.log("✅ VALID:", s);
      await supabase.from("orders").delete().eq("id", testId);
    } else if (error.message && error.message.includes("enum")) {
      console.log("❌ INVALID:", s);
    } else {
      console.log("⚠️ OTHER ERROR for status '" + s + "':", error.message.substring(0,80));
    }
  }
}
findValidStatuses();
