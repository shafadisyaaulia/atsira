const fs = require("fs");
let page = fs.readFileSync("app/dashboard/arc/page.tsx", "utf8");

// Add Supabase import
page = page.replace(
  `import { Input } from "@/components/ui/Input";`,
  `import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect } from "react";`
);

// Add states and fetch logic inside ArcDashboard
page = page.replace(
  `export default function ArcDashboard() {
  const [activeMenu, setActiveMenu] = useState<"verifikasi" | "riset-hub">("verifikasi");
  const [showRisetModal, setShowRisetModal] = useState(false);
  const [risetForm, setRisetForm] = useState({ title: "", category: "Teknologi Suling", avgPA: "" });`,
  `export default function ArcDashboard() {
  const [activeMenu, setActiveMenu] = useState<"verifikasi" | "riset-hub">("verifikasi");
  const [showRisetModal, setShowRisetModal] = useState(false);
  const [risetForm, setRisetForm] = useState({ title: "", category: "Teknologi Suling", avgPA: "" });
  
  const [labQueue, setLabQueue] = useState<any[]>(MOCK_LAB_QUEUE);
  const [researchLogs, setResearchLogs] = useState<any[]>(MOCK_RESEARCH_LOGS);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch queue
      const { data: vq } = await supabase.from("verification_queue").select("*").order("created_at", { ascending: false });
      if (vq) {
        setLabQueue(vq.map((item: any) => ({
          id: item.id.substring(0,8),
          rawId: item.id,
          nodeName: item.product_title,
          region: item.notes || "Aceh",
          variety: "Nilam Tapaktuan",
          volume: item.sample_volume + " Kg",
          submittedAt: new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          aiPredictionPA: 32.4, // Mock AI
          status: item.status
        })));
      }
      
      // Fetch research
      const { data: qa } = await supabase.from("quality_assessments").select("*").order("published_at", { ascending: false });
      if (qa) {
        setResearchLogs(qa.map((item: any) => ({
          id: item.id.substring(0,8),
          title: item.title,
          author: "Tim Riset ARC",
          date: new Date(item.published_at || item.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
          category: item.category,
          avgPA: "33.5%"
        })));
      }
    }
    fetchData();
  }, [supabase]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Update local state optimistically
    setLabQueue(prev => prev.map(item => item.rawId === id ? { ...item, status: newStatus } : item));
    // Update DB
    await supabase.from("verification_queue").update({ status: newStatus }).eq("id", id);
  };
`
);

// Replace mapping usage
page = page.replace(/MOCK_LAB_QUEUE\.map/g, "labQueue.map");
page = page.replace(/MOCK_RESEARCH_LOGS\.map/g, "researchLogs.map");

// Update buttons in mapping
page = page.replace(
  `<Button size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-xs rounded-xl shadow-md">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Verifikasi Lulus
                      </Button>
                      <Button size="sm" variant="secondary" className="text-red-700 bg-red-50 hover:bg-red-100 text-xs rounded-xl">
                        <XCircle className="w-4 h-4 mr-1" /> Tolak
                      </Button>`,
  `<Button size="sm" onClick={() => handleUpdateStatus(req.rawId, "Lulus")} className="bg-emerald-800 hover:bg-emerald-900 text-xs rounded-xl shadow-md">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Verifikasi Lulus
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateStatus(req.rawId, "Ditolak")} variant="secondary" className="text-red-700 bg-red-50 hover:bg-red-100 text-xs rounded-xl">
                        <XCircle className="w-4 h-4 mr-1" /> Tolak
                      </Button>`
);

// Fix the create riset function
page = page.replace(
  `const handleCreateRiset = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Fitur simpan riset sedang diintegrasikan!");
    setShowRisetModal(false);
  };`,
  `const handleCreateRiset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      title: risetForm.title,
      category: risetForm.category,
      published_at: new Date().toISOString()
    };
    const { data } = await supabase.from("quality_assessments").insert(newDoc).select().single();
    if (data) {
      setResearchLogs([{
        id: data.id.substring(0,8),
        title: data.title,
        author: "Tim Riset ARC",
        date: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
        category: data.category,
        avgPA: risetForm.avgPA + "%"
      }, ...researchLogs]);
    }
    setShowRisetModal(false);
  };`
);

fs.writeFileSync("app/dashboard/arc/page.tsx", page, "utf8");
console.log("Hooked up ARC page to Supabase");
