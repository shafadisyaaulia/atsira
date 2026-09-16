const fs = require("fs");
let content = fs.readFileSync("app/dashboard/peneliti/page.tsx", "utf8");

content = content.replace(
  'import { VERIFICATION_QUEUE, formatDateID } from "@/lib/mock";',
  'import { formatDateID } from "@/lib/mock";\nimport { createSupabaseBrowserClient } from "@/lib/supabase/client";'
);

content = content.replace(
  'export default function PenelitiDashboard() {',
  'export default function PenelitiDashboard() {\n  const supabase = createSupabaseBrowserClient();'
);

content = content.replace(
  '  const [queue, setQueue] = useState<VerificationQueueItem[]>(VERIFICATION_QUEUE);',
  '  const [queue, setQueue] = useState<VerificationQueueItem[]>([]);'
);

content = content.replace(
  '  // --- UI & Interactions ---',
  `  useEffect(() => {
    const fetchQueue = async () => {
      const { data } = await supabase.from("verification_queue").select("*").order("created_at", {ascending: false});
      if (data) {
        setQueue(data.map((item: any) => ({
          id: item.id,
          farmer_name: item.product_title,
          farm_region: item.notes || "Aceh",
          submit_date: new Date(item.created_at).toISOString().split("T")[0],
          status: item.status,
          sample_volume: item.sample_volume,
          method: "NIRS-PLS",
        })));
      }
    };
    fetchQueue();
  }, []);

  // --- UI & Interactions ---`
);

fs.writeFileSync("app/dashboard/peneliti/page.tsx", content, "utf8");
console.log("Rewrote peneliti dashboard to fetch from supabase");
