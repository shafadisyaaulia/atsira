require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  // field_stories count dengan cara berbeda
  const { data, error } = await supabase.from("field_stories").select("id, title");
  console.log("field_stories error:", error?.message || "none");
  console.log("field_stories data:", data?.map(f => f.title));
}
check();
