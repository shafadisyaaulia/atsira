require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function checkOrders() {
  const { data, error } = await supabase.from("orders").select("status").limit(5);
  console.log("Order statuses:", data, error?.message);
}
checkOrders();
