const fs = require("fs");
let content = fs.readFileSync("app/dashboard/buyer/page.tsx", "utf8");

const splitIndex = content.indexOf("return (");
const bottomHalf = content.substring(splitIndex);

const topHalf = `"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import { 
  TrendingUp, 
  Package, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BuyerDashboardPage() {
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
        const expense = orders
          .filter(o => o.status !== "Dibatalkan" && o.status !== "cancelled")
          .reduce((acc, curr) => acc + Number(curr.total || 0), 0);
        setTotalPengadaan(expense);

        const validOrders = orders.filter(o => o.status !== "Dibatalkan" && o.status !== "cancelled");
        setTotalKontrak(validOrders.length);

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

  const stats = [
    {
      label: "Total Pengadaan (Tahun Ini)",
      value: formatIDR(totalPengadaan),
      change: "Sepanjang waktu",
      isPositive: true,
      icon: Wallet,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50/60",
    },
    {
      label: "Kontrak Berjalan",
      value: \`\${totalKontrak} Transaksi\`,
      change: "Berhasil dibuat",
      isPositive: true,
      icon: Package,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/60",
    },
    {
      label: "Volume Total Atsiri",
      value: \`\${totalVolume} Kg\`,
      change: "Minyak Mentah (Raw)",
      isPositive: true,
      icon: Layers,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/60",
    }
  ];

  `;

fs.writeFileSync("app/dashboard/buyer/page.tsx", topHalf + bottomHalf, "utf8");
console.log("Fixed buyer top half");
