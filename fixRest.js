const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

// 1. handleCreateBatch
const handleRegex = /const handleCreateBatch = \(e: React\.FormEvent\) => \{[\s\S]*?setShowBatchModal\(false\);\s*\};/m;
const newHandle = `const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.qty || !batchForm.pa || !batchForm.pricePerKg || !batchForm.date || !batchForm.region) return;
    setBatchSubmitting(true);
    try {
      const volume = Number(batchForm.qty);
      const hargaKustom = Number(batchForm.pricePerKg);
      const batchId = \`BCH-\${Math.floor(100 + Math.random() * 900)}\`;
      const res = await fetch("/api/pemasta/market-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId, region: batchForm.region, reportDate: batchForm.date, quantityKg: volume, paLevel: Number(batchForm.pa), pricePerKg: hargaKustom, method: batchForm.method, leafAge: batchForm.leafAge }),
      });
      if (!res.ok) throw new Error();
      const formattedDate = new Date(batchForm.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
      setBatches([{ id: batchId, date: formattedDate, qty: volume, pa: Number(batchForm.pa), region: batchForm.region, method: batchForm.method, leafAge: batchForm.leafAge, pricePerKg: hargaKustom, estimatedValue: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(volume * hargaKustom) }, ...batches]);
      setBatchForm({ qty: "", pa: "", region: "", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan" });
      setShowBatchModal(false);
    } catch {
      alert("Gagal menyimpan ke server");
    } finally {
      setBatchSubmitting(false);
    }
  };`;
content = content.replace(handleRegex, newHandle);

// 2. RegionCascade
const regionRegex = /<div>\s*<label className="text-\[11px\] font-bold text-stone-700 block mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" \/> Wilayah Sentra Lahan<\/label>\s*<select className="w-full text-xs border border-stone-200 rounded-xl p-2\.5 bg-white" value=\{batchForm\.region\} onChange=\{\(e\) => setBatchForm\(\{.*?\}\)\}>\s*<option value="Aceh Selatan">Aceh Selatan<\/option>\s*<option value="Aceh Jaya">Aceh Jaya<\/option>\s*<option value="Aceh Barat Daya">Aceh Barat Daya<\/option>\s*<\/select>\s*<\/div>/m;
const newRegion = `<div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Wilayah Sentra Lahan</label>
                    <RegionCascade value={batchForm.region} onChange={(region) => setBatchForm(prev => ({ ...prev, region }))} />
                  </div>`;
content = content.replace(regionRegex, newRegion);

// 3. Sidebar Style (replace the current sidebar bottom)
const sidebarRegex = /<div className="border-t border-stone-100 pt-4 space-y-3">[\s\S]*?<LogOut className="w-3\.5 h-3\.5" \/> Sign Out\s*<\/button>\s*<\/div>/m;
const newSidebar = `<div className="border-t border-surface-container-high pt-4 space-y-2 bg-stone-50/50 -mx-5 px-5 pb-5 rounded-b-3xl">
          <Link href="/dashboard/community">
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-2 rounded-xl bg-emerald-100/50 hover:bg-emerald-100 border border-emerald-200/50 text-emerald-800 text-xs font-bold transition-colors shadow-sm">
              <Users className="w-3.5 h-3.5" /> atSira Connect
            </button>
          </Link>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-surface-container-high shadow-sm">
            <div className="w-9 h-9 bg-surface-container-highest rounded-full flex items-center justify-center font-bold text-stone-700 text-sm">KP</div>
            <div>
              <p className="text-xs font-bold text-stone-900">Kelompok Suling Jaya</p>
              <p className="text-[10px] text-stone-400">Petani Mitra ARC</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm w-full">
              <Globe className="w-3.5 h-3.5 text-amber-700" /> <span>{lang === "ID" ? "ID" : "EN"}</span>
            </button>
            <button onClick={() => { logout(); router.push('/login'); }} className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100/50 hover:border-red-200 shadow-sm">
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>`;
content = content.replace(sidebarRegex, newSidebar);

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Fixed functionality and sidebar style');
