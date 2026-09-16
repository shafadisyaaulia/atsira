require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixBaseTables() {
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani","umkm","seller"]);
  const petaniId = petaniUsers?.[0]?.id || null;

  if (petaniId) {
    const rawRes = await supabase.from("raw_oil_listings").update({ farmer_id: petaniId }).is("farmer_id", null);
    console.log("raw_oil_listings updated:", rawRes.error ? rawRes.error.message : "SUCCESS");
    
    const finRes = await supabase.from("finished_products").update({ umkm_id: petaniId }).is("umkm_id", null);
    console.log("finished_products updated:", finRes.error ? finRes.error.message : "SUCCESS");
  }
}
fixBaseTables();
