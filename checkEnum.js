require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkEnum() {
  // Cek valid enum values dari order_status
  const { data, error } = await supabase.rpc("check_enum", {}).single().catch(() => ({}));
  // Coba insert dengan berbagai nilai status untuk temukan yang valid
  const statuses = ["Menunggu Pembayaran", "Diproses", "Dikirim", "Selesai", "Dibatalkan", "processing", "shipped", "completed", "cancelled", "new", "pending"];
  for (const s of statuses) {
    const { error: e } = await supabase.from("orders").insert({
      id: "TEST-" + s.toLowerCase().replace(/\s/g,"-"),
      buyer_id: null, seller_id: null, total: 0, status: s
    });
    if (!e) {
      console.log("VALID STATUS:", s);
      await supabase.from("orders").delete().eq("id", "TEST-" + s.toLowerCase().replace(/\s/g,"-"));
    } else if (e.message.includes("enum")) {
      console.log("INVALID:", s);
    }
  }
}
checkEnum();
