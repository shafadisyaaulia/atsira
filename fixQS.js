const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/qualitysense/page.tsx', 'utf8');

// Add useAuthStore and supabase client
if (!content.includes('import { useAuthStore }')) {
  content = content.replace(
    `import { Input, Label } from "@/components/ui/Input";`,
    `import { Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";`
  );
}

// Add state for saving
content = content.replace(
  `const [formData, setFormData] = useState`,
  `const supabase = createSupabaseBrowserClient();
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState`
);

// Add save function
const saveFunction = `
  async function saveToMyProducts() {
    if (!user) { alert("Login diperlukan"); return; }
    if (!scanResult) return;
    setIsSaving(true);
    
    const shortId = "BCH-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    const { error } = await supabase.from("products").insert([
      {
        title: "Minyak Nilam Mentah - " + scanResult.grade,
        price: scanResult.recommendedPriceMin,
        stock: 10,
        unit: "kg",
        category: "Minyak Mentah (Crude Oil)",
        image_url: image || "/images/products/minyak nilam.png",
        is_raw: true,
        seller_id: user.id,
        qr_batch_id: shortId,
        is_verified: true
      }
    ]);

    setIsSaving(false);
    if (error) {
      alert("Gagal menyimpan ke My Products: " + error.message);
    } else {
      alert("Berhasil disimpan! Label atSira Verified telah ditambahkan.");
      window.location.href = "/dashboard/seller/produk";
    }
  }
`;

content = content.replace(`function resetScanner()`, saveFunction + `\n  function resetScanner()`);

// Add button
const buttonJSX = `
                  <Button 
                    onClick={saveToMyProducts} 
                    disabled={isSaving}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    {isSaving ? "Menyimpan..." : "Simpan ke My Products (atSira Verified)"}
                  </Button>
`;

content = content.replace(
  `</Card>`,
  buttonJSX + `\n                </Card>`
);

// It replaces the first </Card> it finds, which is the left panel! We want to place it in the right panel under the result.
// Let's be more precise.
