const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/page.tsx', 'utf8');

// Hapus banner kuning Pemasta dari atas
content = content.replace(
  /\{isPetani && latestPrice && \([\s\S]*?\}\)/,
  ''
);

// Ganti panel AI dengan yang baru
const oldPanelRegex = /<Card className="p-5 bg-stone-800 text-stone-100 border-t-4 border-amber-500 shadow-md h-full flex flex-col justify-between min-h-\[340px\]">[\s\S]*?<\/Card>/;

const newPanel = `<Card className="p-5 bg-stone-800 text-stone-100 border-t-4 border-amber-500 shadow-md h-full flex flex-col justify-between min-h-[340px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> KECERDASAN ATBOT AI
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black">
                    AKTIF
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="text-stone-300">
                    Sistem Anda telah terhubung penuh dengan modul <strong className="text-white font-black">QualitySense v2.9</strong>.
                  </p>
                  
                  {isPetani && latestPrice ? (
                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30 space-y-2 animate-pulse">
                      <div className="flex gap-2 items-start text-[11px]">
                        <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-400 mb-1">Perubahan Harga Pemasta!</p>
                          <p className="text-stone-300 text-[10px] leading-relaxed">
                            Harga base nilam per <strong>{latestPrice.date}</strong> dari {latestPrice.region} telah diperbarui ke 
                            <strong className="text-white bg-stone-700 px-1 py-0.5 rounded ml-1">Rp {Number(latestPrice.pricePerKg).toLocaleString("id-ID")}/Kg</strong>.
                          </p>
                          <p className="text-amber-200/70 text-[9px] mt-1.5 italic">
                            Segera sesuaikan etalase minyak mentah Anda agar tidak merugi.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-stone-900 p-3 rounded-lg border border-stone-700 space-y-2">
                      <div className="flex gap-2 items-start text-[11px]">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-300">Harga Stabil</p>
                          <p className="text-stone-400 text-[10px]">Belum ada update harga terbaru dari Pemasta di region Anda.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-stone-900 p-3 rounded-lg border border-stone-700 space-y-2">
                    <div className="flex gap-2 items-start text-[11px]">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-300">Skrining Visual AI</p>
                        <p className="text-stone-400 text-[10px]">Tips peningkatan mutu fisik akan diberikan secara personal tiap Anda menguji sampel.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-700">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => window.location.href = "/dashboard/seller/qualitysense"} 
                    className="bg-stone-700 hover:bg-stone-600 text-white font-bold text-[11px] py-2 rounded shadow-sm"
                  >
                    Uji Kualitas (AI)
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/dashboard/seller/produk"} 
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[11px] py-2 rounded shadow-sm relative"
                  >
                    {isPetani && latestPrice && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    )}
                    {isPetani && latestPrice && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    )}
                    Update Harga
                  </Button>
                </div>
              </div>
            </Card>`;

content = content.replace(oldPanelRegex, newPanel);
fs.writeFileSync('app/dashboard/seller/page.tsx', content, 'utf8');
