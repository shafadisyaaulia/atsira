const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

const modalCode = `
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
              <button onClick={() => setShowRiwayat(false)} className="rounded-xl w-8 h-8 flex items-center justify-center border border-stone-200 hover:bg-stone-50 text-stone-500 font-bold">
                X
              </button>
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
                <div key={b.id} className="p-4 bg-white border border-stone-200/60 hover:shadow-md transition-all rounded-xl">
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
                        <p className="text-xs font-bold text-stone-800">{b.pricePerKg}/Kg</p>
                        <p className="text-[10px] text-stone-500">{b.qty} Kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 uppercase font-bold">PA</p>
                        <p className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">{b.pa}%</p>
                      </div>
                    </div>
                  </div>
                </div>
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
}
`;

if (!content.includes('MODAL RIWAYAT')) {
    content = content.replace(/    <\/div>\s*?\);\s*?}\s*?$/, modalCode);
    fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
    console.log("Replaced!");
}
