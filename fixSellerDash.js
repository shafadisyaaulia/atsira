const fs = require("fs");
let content = fs.readFileSync("app/dashboard/seller/page.tsx", "utf8");

// 1. Remove mock STATS_DATA & RECENT_ORDERS
content = content.replace(/const STATS_DATA = \[[\s\S]*?\];\n/, "");
content = content.replace(/const RECENT_ORDERS = \[[\s\S]*?\];\n/, "");

// 2. Add supabase client and state
if (!content.includes("createSupabaseBrowserClient")) {
  content = content.replace(
    'import { useState } from "react";',
    'import { useState, useEffect } from "react";\nimport { createSupabaseBrowserClient } from "@/lib/supabase/client";'
  );
} else {
  content = content.replace(
    'import { useState } from "react";',
    'import { useState, useEffect } from "react";'
  );
}

const oldExport = `export default function SellerDashboardPage() {
  const [timeRange, setTimeRange] = useState("30-days");
  const { user } = useAuthStore();
  const isPetani = user?.role === "petani";`;

const newExport = `export default function SellerDashboardPage() {
  const supabase = createSupabaseBrowserClient();
  const [timeRange, setTimeRange] = useState("30-days");
  const { user } = useAuthStore();
  const isPetani = user?.role === "petani";
  
  // REAL DATA STATES
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalProduk, setTotalProduk] = useState(0);
  const [pesananBaru, setPesananBaru] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchDashboardData = async () => {
      // Fetch Products
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user.id);
      
      setTotalProduk(products?.length || 0);

      // Fetch Orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
        
      if (orders) {
        // Hitung pendapatan (hanya status Selesai atau setidaknya diproses, bukan dibatalkan)
        const income = orders
          .filter(o => o.status !== "Dibatalkan" && o.status !== "cancelled")
          .reduce((acc, curr) => acc + Number(curr.total || 0), 0);
        setTotalPendapatan(income);
        
        // Hitung pesanan baru
        const newOrds = orders.filter(o => o.status === "pending" || o.status === "Menunggu Konfirmasi" || o.status === "Menunggu Pembayaran");
        setPesananBaru(newOrds.length);
        
        // 3 pesanan terbaru
        setRecentOrders(orders.slice(0, 3));
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const STATS_DATA = [
    {
      title: "Total Pendapatan (Sepanjang Waktu)",
      value: totalPendapatan,
      isPositive: true,
      subtext: "Berdasarkan pesanan berhasil",
      icon: Wallet,
      iconColor: "bg-amber-100 text-amber-700",
    },
    {
      title: "Produk Live di Etalase",
      value: totalProduk,
      isPositive: true,
      subtext: "Produk yang Anda jual",
      icon: Package,
      iconColor: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Pesanan Masuk Baru",
      value: pesananBaru,
      isPositive: pesananBaru === 0,
      subtext: pesananBaru > 0 ? "Memerlukan pengiriman segera" : "Semua pesanan sudah diproses",
      icon: Clock,
      iconColor: "bg-orange-100 text-orange-700",
    },
  ];`;

content = content.replace(oldExport, newExport);

// 3. Fix Recent Orders Map
const oldRecentOrdersMap = `{RECENT_ORDERS.map((order, idx) => (`;
const newRecentOrdersMap = `{recentOrders.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">Belum ada pesanan terbaru.</div>
              ) : recentOrders.map((order, idx) => (`;

content = content.replace(oldRecentOrdersMap, newRecentOrdersMap);

// 4. Update the properties inside map
content = content.replace(/order\.customer/g, `order.buyer_name || "Pembeli"`);
content = content.replace(/order\.product/g, `order.id`);
content = content.replace(/order\.amount/g, `Number(order.total || 0)`);
content = content.replace(/order\.statusColor/g, `(order.status === "pending" || order.status === "Menunggu Pembayaran" ? "text-amber-700 border-amber-200 bg-amber-50" : order.status === "completed" || order.status === "Selesai" ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-blue-700 border-blue-200 bg-blue-50")`);
content = content.replace(/order\.date/g, `new Date(order.created_at).toLocaleDateString("id-ID", {day: 'numeric', month: 'short', year: 'numeric'})`);

content = content.replace(/<div className="flex items-center gap-3">[\s\S]*?<\/div>(\s*<div className="text-right">)/g, (match, p1) => {
  return `<div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-stone-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{order.buyer_name || "Pembeli"}</p>
                        <p className="text-[11px] text-stone-500">Order ID: {order.id.substring(0,8)}...</p>
                      </div>
                    </div>${p1}`;
});

fs.writeFileSync("app/dashboard/seller/page.tsx", content, "utf8");
console.log("Seller Dashboard updated to real data.");
