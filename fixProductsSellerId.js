require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixProducts() {
  const { data: petaniUsers } = await supabase.from("profiles").select("id").in("role", ["petani","umkm","seller"]);
  const petaniId = petaniUsers?.[0]?.id || null;

  if (petaniId) {
    const { error } = await supabase.from("products").update({ seller_id: petaniId }).is("seller_id", null);
    console.log("Updated products seller_id:", error ? error.message : "SUCCESS");
  } else {
    console.log("No petani user found");
  }
}
fixProducts();
