const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

// 1. ADD IMPORTS
content = content.replace(
  `import { Input } from "@/components/ui/Input";`,
  `import { Input } from "@/components/ui/Input";\nimport { RegionCascade } from "@/components/ui/RegionCascade";`
);
content = content.replace(
  `BookOpen, FileText, Plus,`,
  `BookOpen, FileText, Plus, TrendingUp,`
);

// 2. ADD STATES
content = content.replace(
  `  const [showBatchModal, setShowBatchModal] = useState(false);`,
  `  const [showBatchModal, setShowBatchModal] = useState(false);\n  const [showRiwayat, setShowRiwayat] = useState(false);\n  const [filterMonth, setFilterMonth] = useState("");\n  const [filterYear, setFilterYear] = useState("");\n  const [batchSubmitting, setBatchSubmitting] = useState(false);`
);

// 3. REPLACE handleCreateBatch
content = content.replace(
  `  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.qty || !batchForm.pa || !batchForm.pricePerKg || !batchForm.date) return;

    const volume = Number(batchForm.qty);
    const hargaKustom = Number(batchForm.pricePerKg);
    const totalNilai = volume * hargaKustom;

    const formattedDate = new Date(batchForm.date).toLocaleDateString("id-ID", {
      weekday: "long", year: "numeric", month: "short", day: "numeric"
    });

    const newBatch = {
      id: \`BCH-\${Math.floor(100 + Math.random() * 900)}\`,
      date: formattedDate,
      qty: volume,
      pa: Number(batchForm.pa),
      status: "Verifikasi AI QualitySense",
      region: batchForm.region,
      method: batchForm.method,
      leafAge: batchForm.leafAge,
      pricePerKg: hargaKustom,
      estimatedValue: formatCurrency(totalNilai)
    };

    setBatches([newBatch, ...batches]);
    setBatchForm({ qty: "", pa: "", region: "Aceh Selatan", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan" });
    setShowBatchModal(false);
  };`,
  `  const handleCreateBatch = async (e: React.FormEvent) => {
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
      setBatches([{ id: batchId, date: formattedDate, qty: volume, pa: Number(batchForm.pa), status: "Verifikasi AI QualitySense", region: batchForm.region, method: batchForm.method, leafAge: batchForm.leafAge, pricePerKg: hargaKustom, estimatedValue: formatCurrency(volume * hargaKustom) }, ...batches]);
      setBatchForm({ qty: "", pa: "", region: "", date: "", pricePerKg: "", method: "Uap (Steam Distressed)", leafAge: "6 Bulan" });
      setShowBatchModal(false);
    } catch {
      alert("Gagal");
    } finally {
      setBatchSubmitting(false);
    }
  };`
);

// 4. ADD BUTTONS TO SIDEBAR
content = content.replace(
  `          {/* PROFIL BOTTOM */}
          <div className="mt-auto border-t border-stone-200/50 p-4">`,
  `          <div className="mt-auto px-4 pb-4 flex flex-col gap-2">
            <Link href="/dashboard/community">
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-100/50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors">
                <Users className="w-4 h-4" /> atSira Connect
              </button>
            </Link>
            <div className="flex gap-2">
              <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold transition-colors">
                <Globe className="w-4 h-4" /> {lang}
              </button>
              <button onClick={() => { logout(); router.push('/login'); }} className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* PROFIL BOTTOM */}
          <div className="border-t border-stone-200/50 p-4">`
);

// 5. REPLACE REGION DROPDOWN WITH CASCADE
content = content.replace(
  `                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Wilayah Sentra Lahan</label>
                    <select className="w-full text-xs border border-stone-200 rounded-xl p-2.5 bg-white" value={batchForm.region} onChange={(e) => setBatchForm({...batchForm, region: e.target.value})}>
                      <option value="Aceh Selatan">Aceh Selatan</option>
                      <option value="Aceh Jaya">Aceh Jaya</option>
                      <option value="Aceh Barat Daya">Aceh Barat Daya</option>
                    </select>
                  </div>`,
  `                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Wilayah Sentra Lahan</label>
                    <RegionCascade value={batchForm.region} onChange={(region) => setBatchForm(prev => ({ ...prev, region }))} />
                  </div>`
);

// 6. REPLACE SUBMIT BUTTON
content = content.replace(
  `<Button type="submit" variant="primary" className="rounded-xl text-xs font-bold shadow-md">Simpan Data & Kirim</Button>`,
  `<Button type="submit" variant="primary" className="rounded-xl text-xs font-bold shadow-md" disabled={batchSubmitting}>{batchSubmitting ? "Menyimpan..." : "Simpan Data & Kirim"}</Button>`
);

// 7. REPLACE DASHBOARD TAB WITH HIGHLIGHT AND RIWAYAT
const oldDashStart = `{/* DASHBOARD TAB */}`;
const oldDashEnd = `{/* NILAM STORY HUB TAB */}`;
const newDash = `{/* DASHBOARD TAB */}
        {activeMenu === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
              <div>
                <h1 className="text-xl font-bold text-stone-900 font-display">Log Histori Harga & Kualitas Suling</h1>
                <p className="text-xs text-stone-500">Rekam seluruh data harga kesepakatan riil lapangan untuk AI QualitySense.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowRiwayat(true)}
                  variant="secondary"
                  className="rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm border border-stone-300"
                >
                  <BookOpen className="w-4 h-4" /> Riwayat
                </Button>
                <Button onClick={() => setShowBatchModal(true)} variant="primary" className="rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm">
                  <Plus className="w-4 h-4" /> Catat Batch & Harga Baru
                </Button>
              </div>
            </div>

            {/* KARTU DATA TERBARU (HIGHLIGHTED) */}
            {batches.length > 0 && (() => {
              const latest = batches[0];
              return (
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-700/60 p-2 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-emerald-200" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Data Terbaru</p>
                        <p className="text-xs font-bold text-white">{latest.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-700/60 border border-emerald-600/40 text-emerald-200 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {latest.date}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-emerald-700/50 pt-4">
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Harga/Kg</p>
                      <p className="text-lg font-black text-white">{formatCurrency(latest.pricePerKg)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Volume</p>
                      <p className="text-lg font-black text-white">{latest.qty} Kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Kadar PA</p>
                      <p className="text-lg font-black text-amber-300">{latest.pa}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-emerald-700/50 text-xs text-emerald-300">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {latest.region}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {latest.method}</span>
                    <span className="ml-auto text-[10px] bg-emerald-700/40 px-2 py-0.5 rounded-full">{latest.status}</span>
                  </div>
                </div>
              );
            })()}

            {/* DATA SEBELUMNYA (3 TERBARU) */}
            {batches.length > 1 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" /> 3 Data Sebelumnya
                </h2>
                <div className="grid gap-3">
                  {batches.slice(1, 4).map((b) => (
                    <Card key={b.id} className="p-4 bg-white border border-stone-200/60 hover:shadow-md transition-all rounded-xl">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-stone-800">{b.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{b.status}</span>
                            <span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {b.date}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                            <span className="flex items-center gap-1 font-semibold text-stone-600"><MapPin className="w-3 h-3" /> {b.region}</span>
                            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {b.method}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] text-stone-400 uppercase font-bold">Harga</p>
                            <p className="text-xs font-bold text-stone-800">{formatCurrency(b.pricePerKg)}/Kg</p>
                            <p className="text-[10px] text-stone-500">{b.qty} Kg</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-stone-400 uppercase font-bold">PA</p>
                            <p className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">{b.pa}%</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {batches.length > 4 && (
                  <button
                    onClick={() => setShowRiwayat(true)}
                    className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-900 py-2.5 border border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl transition-all bg-emerald-50/50 hover:bg-emerald-50"
                  >
                    Lihat semua {batches.length} data riwayat →
                  </button>
                )}
              </div>
            )}

            {batches.length === 0 && !batchLoading && (
              <div className="text-center py-16 text-stone-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-bold text-sm">Belum ada data batch</p>
                <p className="text-xs mt-1">Klik "Catat Batch & Harga Baru" untuk memulai</p>
              </div>
            )}
            {batchLoading && (
              <div className="text-center py-16 text-stone-300 text-xs animate-pulse">Memuat data dari database...</div>
            )}

          </div>
        )}

`;
content = content.replace(content.substring(content.indexOf(oldDashStart), content.indexOf(oldDashEnd)), newDash);

// 8. ADD MODAL AT THE END
const oldEnd = `      )}

    </div>
  );
}`;
const newEnd = `      )}

      {/* MODAL RIWAYAT */}
      {showRiwayat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl space-y-4 border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-100 text-stone-600 rounded-xl"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Riwayat Kesepakatan & Suling</h3>
                  <p className="text-[11px] text-stone-500">Semua data yang pernah diinput.</p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setShowRiwayat(false)} className="rounded-xl w-8 h-8 p-0 flex items-center justify-center">
                X
              </Button>
            </div>
            
            {/* Filter */}
            <div className="flex flex-wrap gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
               <select 
                 className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white"
                 value={filterMonth}
                 onChange={(e) => setFilterMonth(e.target.value)}
               >
                 <option value="">Semua Bulan</option>
                 <option value="Jan">Januari</option>
                 <option value="Feb">Februari</option>
                 <option value="Mar">Maret</option>
                 <option value="Apr">April</option>
                 <option value="Mei">Mei</option>
                 <option value="Jun">Juni</option>
                 <option value="Jul">Juli</option>
                 <option value="Agt">Agustus</option>
                 <option value="Sep">September</option>
                 <option value="Okt">Oktober</option>
                 <option value="Nov">November</option>
                 <option value="Des">Desember</option>
               </select>
               
               <select 
                 className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white"
                 value={filterYear}
                 onChange={(e) => setFilterYear(e.target.value)}
               >
                 <option value="">Semua Tahun</option>
                 <option value="2026">2026</option>
                 <option value="2025">2025</option>
                 <option value="2024">2024</option>
               </select>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {batches
                .filter(b => {
                  if (!filterMonth && !filterYear) return true;
                  const matchMonth = filterMonth ? b.date.includes(filterMonth) : true;
                  const matchYear = filterYear ? b.date.includes(filterYear) : true;
                  return matchMonth && matchYear;
                })
                .map((b) => (
                <Card key={b.id} className="p-4 bg-white border border-stone-200/60 hover:shadow-md transition-all rounded-xl">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-stone-800">{b.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{b.status}</span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {b.date}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                        <span className="flex items-center gap-1 font-semibold text-stone-600"><MapPin className="w-3 h-3" /> {b.region}</span>
                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {b.method}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 uppercase font-bold">Harga</p>
                        <p className="text-xs font-bold text-stone-800">{formatCurrency(b.pricePerKg)}/Kg</p>
                        <p className="text-[10px] text-stone-500">{b.qty} Kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 uppercase font-bold">PA</p>
                        <p className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">{b.pa}%</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {batches.filter(b => {
                  if (!filterMonth && !filterYear) return true;
                  const matchMonth = filterMonth ? b.date.includes(filterMonth) : true;
                  const matchYear = filterYear ? b.date.includes(filterYear) : true;
                  return matchMonth && matchYear;
              }).length === 0 && (
                <div className="text-center py-10 text-stone-400 text-sm">
                  Tidak ada data yang cocok dengan filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}`;
content = content.replace(oldEnd, newEnd);

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Successfully wrote using Node.js!');
