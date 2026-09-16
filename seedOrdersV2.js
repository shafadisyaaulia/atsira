require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedOrders() {
  const { data: buyers } = await supabase.from("profiles").select("id, email").eq("role", "buyer");
  const { data: sellers } = await supabase.from("profiles").select("id, email").in("role", ["petani","umkm","seller"]);

  console.log("Buyers:", buyers?.map(u => u.email));
  console.log("Sellers:", sellers?.map(u => u.email));

  for (const seller of (sellers || [])) {
    for (const buyer of (buyers || [])) {
      const prefix = seller.id.substring(0,4) + buyer.id.substring(0,4);
      const { error: e1 } = await supabase.from("orders").insert([
        { id: "TRX-9821-" + prefix, buyer_id: buyer.id, seller_id: seller.id, buyer_name: "Atsiri Mandiri Utama", order_type: "b2b", total: 13500000, status: "pending", payment_method: "va_bca" },
        { id: "TRX-9754-" + prefix, buyer_id: buyer.id, seller_id: seller.id, buyer_name: "Rania Fragrance Jakarta", order_type: "retail", total: 5350000, status: "completed", payment_method: "qris" },
        { id: "TRX-9611-" + prefix, buyer_id: buyer.id, seller_id: seller.id, buyer_name: "Koperasi Nilam Aceh Barat", order_type: "b2b", total: 6000000, status: "completed", payment_method: "cod" },
      ]);
      if (e1) console.log("Insert error seller-buyer:", e1.message);
      else console.log("OK: seller", seller.email, "-> buyer", buyer.email);
    }
  }

  const { data: check } = await supabase.from("orders").select("id").limit(1);
  console.log("\nCheck after insert:", check);
}
seedOrders();
