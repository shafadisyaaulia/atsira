require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkBaseTables() {
  const { data: raw } = await supabase.from("raw_oil_listings").select("*").limit(1);
  const { data: fin } = await supabase.from("finished_products").select("*").limit(1);
  console.log("raw_oil_listings cols:", raw && raw.length ? Object.keys(raw[0]) : "empty");
  console.log("finished_products cols:", fin && fin.length ? Object.keys(fin[0]) : "empty");
}
checkBaseTables();
