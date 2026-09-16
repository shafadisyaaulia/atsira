require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRawInView() {
  const { data } = await supabase.from("products").select("*").eq("is_raw", true).limit(1);
  console.log(JSON.stringify(data[0], null, 2));
}
checkRawInView();
