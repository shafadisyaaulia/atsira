require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkView() {
  const res = await supabase.rpc("exec_sql", { query: "SELECT table_type FROM information_schema.tables WHERE table_name = 'products';" });
  console.log("products type:", res.data);
}
checkView();
