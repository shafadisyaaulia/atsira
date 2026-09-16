const fs = require("fs");
let content = fs.readFileSync("app/dashboard/buyer/page.tsx", "utf8");

content = content.replace(/export default function BuyerDashboardPage\(\) \{\n\s*\/\/ Mock data ringkasan pengadaan buyer\n\s*const stats = \[/, `export default function BuyerDashboardPage() {
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

  const stats = [`);

fs.writeFileSync("app/dashboard/buyer/page.tsx", content, "utf8");
console.log("Fixed buyer dashboard code");
