require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function updateStoryImages() {
  const images = [
    "/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png",
    "/stories/action_photography_of_a_workshop_optimalisasi_rendemen_suling_in_aceh_jaya._an.png",
    "/stories/high_tech_laboratory_photography_at_arc_usk._a_researcher_in_a_white_lab_coat.png",
    "/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png"
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
updateStoryImages();
