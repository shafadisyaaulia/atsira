require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedOrders() {
  const { data: buyers } = await supabase.from("profiles").select("id, email").eq("role", "buyer");
  const { data: sellers } = await supabase.from("profiles").select("id, email").in("role", ["petani","umkm","seller"]);
  const { data: buyerOnly } = await supabase.from("profiles").select("id").eq("role", "buyer").limit(1);
  const { data: sellerOnly } = await supabase.from("profiles").select("id").in("role", ["petani","umkm","seller"]).limit(1);
  
  const buyerId1 = buyerOnly?.[0]?.id;
  const sellerId1 = sellerOnly?.[0]?.id;

  // Seed untuk setiap seller (Petani/UMKM) - pesanan masuk
  for (const seller of (sellers || [])) {
    const bId = buyers?.[0]?.id || buyerId1;
    const pfx = seller.id.substring(0,5);
    const { error } = await supabase.from("orders").insert([
      { id: "TRX-9821-" + pfx, buyer_id: bId, seller_id: seller.id, buyer_name: "Atsiri Mandiri Utama", order_type: "b2b", total: 13500000, status: "Menunggu Pembayaran", payment_method: "va_bca" },
      { id: "TRX-9754-" + pfx, buyer_id: bId, seller_id: seller.id, buyer_name: "Rania Fragrance Jakarta", order_type: "retail", total: 5350000, status: "Selesai", payment_method: "qris" },
      { id: "TRX-9611-" + pfx, buyer_id: bId, seller_id: seller.id, buyer_name: "Koperasi Nilam Aceh Barat", order_type: "b2b", total: 6000000, status: "Selesai", payment_method: "cod" },
    ]);
    if (error) console.log("Error seller", seller.email, ":", error.message);
    else console.log("✅ Orders untuk seller:", seller.email);
  }

  // Seed untuk setiap buyer - riwayat pembelian besar
  for (const buyer of (buyers || [])) {
    const sId = sellers?.[0]?.id || sellerId1;
    const pfx = buyer.id.substring(0,5);
    const { error } = await supabase.from("orders").insert([
      { id: "BUY-TRX1-" + pfx, buyer_id: buyer.id, seller_id: sId, buyer_name: buyer.email.split("@")[0], order_type: "b2b", total: 200000000, status: "Selesai", payment_method: "va_mandiri" },
      { id: "BUY-TRX2-" + pfx, buyer_id: buyer.id, seller_id: sId, buyer_name: buyer.email.split("@")[0], order_type: "b2b", total: 150000000, status: "Selesai", payment_method: "qris" },
      { id: "BUY-TRX3-" + pfx, buyer_id: buyer.id, seller_id: sId, buyer_name: buyer.email.split("@")[0], order_type: "b2b", total: 77500000, status: "Menunggu Pembayaran", payment_method: "va_bca" },
    ]);
    if (error) console.log("Error buyer", buyer.email, ":", error.message);
    else console.log("✅ Orders untuk buyer:", buyer.email);
  }

  const { data: total } = await supabase.from("orders").select("id", { count: "exact" });
  console.log("\n✅ TOTAL orders di database:", total?.length);
}
seedOrders();
