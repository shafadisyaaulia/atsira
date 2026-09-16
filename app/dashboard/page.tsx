import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = profile?.role || "buyer";
  
  if (role === "seller" || role === "umkm" || role === "petani") {
    redirect("/dashboard/seller");
  } else if (role === "peneliti" || role === "arc") {
    redirect("/dashboard/arc");
  } else {
    redirect(`/dashboard/${role}`);
  }
}
