require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function checkEnum() {
  // Try inserting with different status values to see what enum accepts
  const { data, error } = await supabase.rpc("exec_sql", { query: "SELECT unnest(enum_range(NULL::order_status));" });
  console.log("Enum values:", data, error?.message);
}
checkEnum();
