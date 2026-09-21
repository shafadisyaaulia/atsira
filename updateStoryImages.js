require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function updateImages() {
  const images = [
    "/images/products/minyak nilam 1.png",
    "/images/products/minyak nilam 2.png",
    "/images/products/minyak nilam 3.png",
    "/images/products/minyak nilam 4.png"
  ];
  
  const { data: stories } = await supabase.from("field_stories").select("id").order("created_at");
  if (stories && stories.length > 0) {
    for (let i = 0; i < stories.length; i++) {
      const img = images[i % images.length];
      await supabase.from("field_stories").update({ image_url: img }).eq("id", stories[i].id);
      console.log(`Updated ${stories[i].id} with ${img}`);
    }
  }
}
updateImages();
