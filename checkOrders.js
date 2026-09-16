require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function finalCheck() {
  const { data: orders } = await supabase.from("orders").select("buyer_name, total, status").limit(5);
  console.log("[Buyer/Seller] orders:", orders?.length, "rows");
  orders?.forEach(o => console.log("  -", o.buyer_name, "| Rp", o.total, "|", o.status));
}
finalCheck();
