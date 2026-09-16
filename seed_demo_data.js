require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log("Memulai proses seeding (menanam) data mock ke user lama...");

  // 1. Cari user dengan role 'buyer'
  const { data: buyers } = await supabase.from("profiles").select("id").eq("role", "buyer").limit(1);
  const buyerId = buyers && buyers.length > 0 ? buyers[0].id : null;

  // 2. Cari user dengan role 'petani', 'umkm', atau 'seller'
  const { data: sellers } = await supabase.from("profiles").select("id").in("role", ["petani", "umkm", "seller"]).limit(1);
  const sellerId = sellers && sellers.length > 0 ? sellers[0].id : null;

  if (!buyerId && !sellerId) {
    console.log("Tidak ditemukan user lama di database. Seeding dibatalkan.");
    return;
  }

  const mockSellerId = sellerId || "seller-demo-123";
  const mockBuyerId = buyerId || "buyer-demo-123";

  // === SEED UNTUK SELLER (PETANI/UMKM) ===
  if (sellerId) {
    console.log(`Menambahkan data pesanan untuk Seller ID: ${sellerId}...`);
    // Insert pesanan sesuai mock lama (Rp 24.850.000 total)
    // 13.500.000 + 1.725.000 + 6.000.000 = 21.225.000 (Kurang lebih mendekati)
    // Kita buat pesanan yang totalnya persis sama.
    
    const sellerOrders = [
      {
        id: "TRX-9821-" + Date.now(),
        buyer_id: mockBuyerId,
        seller_id: sellerId,
        buyer_name: "Atsiri Mandiri Utama",
        order_type: "b2b",
        total: 13500000,
        status: "pending",
        payment_method: "va_bca"
      },
      {
        id: "TRX-9754-" + Date.now(),
        buyer_id: mockBuyerId,
        seller_id: sellerId,
        buyer_name: "Rania Fragrance Jakarta",
        order_type: "retail",
        total: 5350000,
        status: "completed",
        payment_method: "qris"
      },
      {
        id: "TRX-9611-" + Date.now(),
        buyer_id: mockBuyerId,
        seller_id: sellerId,
        buyer_name: "Koperasi Nilam Aceh Barat",
        order_type: "b2b",
        total: 6000000,
        status: "completed",
        payment_method: "cod"
      }
    ];

    await supabase.from("orders").insert(sellerOrders);
  }

  // === SEED UNTUK BUYER ===
  if (buyerId) {
    console.log(`Menambahkan data pesanan untuk Buyer ID: ${buyerId}...`);
    // Insert pesanan sesuai mock lama (Total Rp 427.500.000, 750 Kg, 3 Kontrak)
    // Supaya datanya pas, kita buat 3 pesanan besar.
    
    const buyerOrders = [
      {
        id: "BUYER-TRX-1-" + Date.now(),
        buyer_id: buyerId,
        seller_id: mockSellerId,
        buyer_name: "Pabrik Parfum Internasional",
        order_type: "b2b",
        total: 200000000, // 200jt
        status: "completed",
        payment_method: "va_mandiri"
      },
      {
        id: "BUYER-TRX-2-" + Date.now(),
        buyer_id: buyerId,
        seller_id: mockSellerId,
        buyer_name: "Pabrik Sabun Nasional",
        order_type: "b2b",
        total: 150000000, // 150jt
        status: "completed",
        payment_method: "qris"
      },
      {
        id: "BUYER-TRX-3-" + Date.now(),
        buyer_id: buyerId,
        seller_id: mockSellerId,
        buyer_name: "Eksportir Eropa",
        order_type: "b2b",
        total: 77500000, // 77.5jt
        status: "pending",
        payment_method: "va_bca"
      }
    ];

    await supabase.from("orders").insert(buyerOrders);
    
    // Insert order_items supaya total volume jadi 750 Kg
    const { data: bOrders } = await supabase.from("orders").select("id").eq("buyer_id", buyerId).limit(3).order("created_at", {ascending: false});
    if (bOrders && bOrders.length > 0) {
      await supabase.from("order_items").insert({
        order_id: bOrders[0].id,
        product_id: null,
        title: "Minyak Nilam Massal (B2B)",
        qty: 750,
        unit: "kg",
        price: 570000
      });
    }
  }

  console.log("SELESAI! Data historis untuk user lama telah berhasil ditanam ke Supabase.");
}

seedData();
