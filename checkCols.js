require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixSeeds() {
  // Check actual columns in market_price_updates
  const { data: mpu } = await supabase.from("market_price_updates").select("*").limit(1);
  console.log("market_price_updates sample row:", JSON.stringify(mpu));

  const { data: vq } = await supabase.from("verification_queue").select("*").limit(1);
  console.log("verification_queue sample row:", JSON.stringify(vq));
}
fixSeeds();
