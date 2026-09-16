const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/qualitysense/page.tsx', 'utf8');

// Undo the bad button injection if it exists
content = content.replace(/<Button\s+onClick=\{saveToMyProducts\}[^>]+>\s*<CheckCircle2[^>]+>\s*\{isSaving \? "Menyimpan\.\.\." : "Simpan ke My Products \(ATSIRA Verified\)"\}\s*<\/Button>/g, '');

const buttonJSX = `
                  <Button 
                    onClick={saveToMyProducts} 
                    disabled={isSaving}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    {isSaving ? "Menyimpan..." : "Simpan ke My Products (ATSIRA Verified)"}
                  </Button>
`;

content = content.replace(
  `<span>Gunakan patokan harga ini sebagai dasar negosiasi yang kuat. Harga dihitung dari data harga terbaru Pemasta.</span>
                  </div>`,
  `<span>Gunakan patokan harga ini sebagai dasar negosiasi yang kuat. Harga dihitung dari data harga terbaru Pemasta.</span>
                  </div>` + buttonJSX
);

fs.writeFileSync('app/dashboard/seller/qualitysense/page.tsx', content, 'utf8');
