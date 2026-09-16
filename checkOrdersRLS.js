require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
// Gunakan service role dengan bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
async function check() {
  // Service role seharusnya bypass RLS
  const { data, error } = await supabase.from("orders").select("buyer_name, total, status").limit(5);
  if (error) console.log("ERROR:", error.message);
  else console.log("Orders:", data?.length, "rows", JSON.stringify(data?.slice(0,2)));
}
check();
