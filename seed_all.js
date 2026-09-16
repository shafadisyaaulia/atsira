require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAllOldUsers() {
  // Hapus semua pesanan dulu supaya tidak double
  await supabase.from("order_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("orders").delete().neq("id", "none");

  const { data: buyers } = await supabase.from("profiles").select("id").eq("role", "buyer");
  const { data: sellers } = await supabase.from("profiles").select("id").in("role", ["petani", "umkm", "seller"]);

  // Bikin data ke semua seller
  for (const seller of (sellers || [])) {
    const sellerId = seller.id;
    const buyerId = buyers && buyers.length > 0 ? buyers[0].id : "mock-buyer";
    
    const sellerOrders = [
      { id: "TRX-9821-" + sellerId.substring(0,5), buyer_id: buyerId, seller_id: sellerId, buyer_name: "Atsiri Mandiri Utama", order_type: "b2b", total: 13500000, status: "pending", payment_method: "va_bca" },
      { id: "TRX-9754-" + sellerId.substring(0,5), buyer_id: buyerId, seller_id: sellerId, buyer_name: "Rania Fragrance Jakarta", order_type: "retail", total: 5350000, status: "completed", payment_method: "qris" },
      { id: "TRX-9611-" + sellerId.substring(0,5), buyer_id: buyerId, seller_id: sellerId, buyer_name: "Koperasi Nilam Aceh Barat", order_type: "b2b", total: 6000000, status: "completed", payment_method: "cod" }
    ];
    await supabase.from("orders").insert(sellerOrders);
  }

  // Bikin data ke semua buyer
  for (const buyer of (buyers || [])) {
    const buyerId = buyer.id;
    const sellerId = sellers && sellers.length > 0 ? sellers[0].id : "mock-seller";
    
    const buyerOrders = [
      { id: "BUYER-TRX-1-" + buyerId.substring(0,5), buyer_id: buyerId, seller_id: sellerId, buyer_name: "Pabrik Parfum Internasional", order_type: "b2b", total: 200000000, status: "completed", payment_method: "va_mandiri" },
      { id: "BUYER-TRX-2-" + buyerId.substring(0,5), buyer_id: buyerId, seller_id: sellerId, buyer_name: "Pabrik Sabun Nasional", order_type: "b2b", total: 150000000, status: "completed", payment_method: "qris" },
      { id: "BUYER-TRX-3-" + buyerId.substring(0,5), buyer_id: buyerId, seller_id: sellerId, buyer_name: "Eksportir Eropa", order_type: "b2b", total: 77500000, status: "pending", payment_method: "va_bca" }
    ];
    await supabase.from("orders").insert(buyerOrders);
    
    // Insert order_items
    const { data: bOrders } = await supabase.from("orders").select("id").eq("buyer_id", buyerId).limit(3).order("created_at", {ascending: false});
    if (bOrders && bOrders.length > 0) {
      await supabase.from("order_items").insert({
        order_id: bOrders[0].id, product_id: null, title: "Minyak Nilam Massal (B2B)", qty: 750, unit: "kg", price: 570000
      });
    }
  }

  console.log("SUKSES: Semua user lama kini punya data transaksi historis!");
}
seedAllOldUsers();
