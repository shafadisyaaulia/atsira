const fs = require("fs");
let content = fs.readFileSync("app/dashboard/peneliti/page.tsx", "utf8");

content = content.replace(
  'const [queue, setQueue] = useState(VERIFICATION_QUEUE);',
  `const [queue, setQueue] = useState<any[]>([]);
  useEffect(() => {
    const fetchQueue = async () => {
      const supabase = createSupabaseBrowserClient();
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
  }, []);`
);

content = content.replace(/statusColors\[item\.status\]/g, `STATUS_BADGE[item.status as VerificationQueueItem["status"]]`);
content = content.replace(/statusColors\[item\.status as keyof typeof statusColors\]/g, `STATUS_BADGE[item.status as VerificationQueueItem["status"]]`);
content = content.replace(/STATUS_BADGE\[item\.status as VerificationQueueItem\["status"\] as keyof typeof statusColors\]/g, `STATUS_BADGE[item.status as VerificationQueueItem["status"]]`);

fs.writeFileSync("app/dashboard/peneliti/page.tsx", content, "utf8");
console.log("Fixed VerificationQueueSection");
