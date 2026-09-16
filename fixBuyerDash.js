const fs = require("fs");
let content = fs.readFileSync("app/dashboard/buyer/page.tsx", "utf8");

// Add Imports
content = content.replace(
  'import { useState } from "react";',
  'import { useState, useEffect } from "react";\nimport { createSupabaseBrowserClient } from "@/lib/supabase/client";\nimport { useAuthStore } from "@/lib/store";'
);

const oldExport = `export default function BuyerDashboardPage() {
  // Mock data ringkasan pengadaan buyer
  const stats = [`;

const newExport = `export default function BuyerDashboardPage() {
  const supabase = createSupabaseBrowserClient();
  const { user } = useAuthStore();
  const [totalPengadaan, setTotalPengadaan] = useState(0);
  const [totalKontrak, setTotalKontrak] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const fetchBuyerStats = async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("buyer_id", user.id);

      if (orders) {
        // Total Pengeluaran
        const expense = orders
          .filter(o => o.status !== "Dibatalkan" && o.status !== "cancelled")
          .reduce((acc, curr) => acc + Number(curr.total || 0), 0);
        setTotalPengadaan(expense);

        // Total Kontrak (Orders that are not cancelled)
        const validOrders = orders.filter(o => o.status !== "Dibatalkan" && o.status !== "cancelled");
        setTotalKontrak(validOrders.length);

        // Total Volume (Sum of qty of items)
        let volume = 0;
        validOrders.forEach(o => {
          if (o.order_items) {
            o.order_items.forEach((item: any) => {
              if (item.unit === "kg") volume += Number(item.qty || 0);
            });
          }
        });
        setTotalVolume(volume);
      }
    };
    fetchBuyerStats();
  }, [user]);

  const formatIDR = (num: number) => new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(num);

  const stats = [`;

content = content.replace(oldExport, newExport);

// Replace hardcoded values in stats
content = content.replace(/value: "Rp 427\.500\.000"/, 'value: formatIDR(totalPengadaan)');
content = content.replace(/value: "3 Kontrak"/, 'value: `${totalKontrak} Transaksi`');
content = content.replace(/value: "750 Kg"/, 'value: `${totalVolume} Kg`');
content = content.replace(/change: "\+12\.5%"/, 'change: "Sepanjang waktu"');
content = content.replace(/change: "2 Mitra Tani"/, 'change: "Berhasil dibuat"');
content = content.replace(/change: "\+150 Kg bulan ini"/, 'change: "Minyak Mentah (Raw)"');

fs.writeFileSync("app/dashboard/buyer/page.tsx", content, "utf8");
console.log("Buyer Dashboard updated to real data.");
