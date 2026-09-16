const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/page.tsx', 'utf8');

// Force replace the handleAjukan function
const oldFunc = `  const handleAjukan = () => {
    addRequest({
      nodeName: user?.name || "Petani Nilam",
      region: "Aceh",
      farmerId: user?.id || "petani-1"
    });
    alert("Berhasil mengajukan sertifikasi! Sampel sekarang berada di antrean ARC.");
  };`;

const newFunc = `  const handleAjukan = () => {
    window.location.href = "/dashboard/seller/produk";
  };`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  console.log("Replaced handleAjukan");
} else {
  console.log("Pattern not found. Looking for partial match...");
  const idx = content.indexOf('addRequest({');
  console.log("addRequest found at:", idx);
  // Force replace the entire function area
  content = content.replace(
    /const handleAjukan = \(\) => \{[\s\S]*?alert\("Berhasil mengajukan[^"]*"\);[\s\S]*?\};/,
    `const handleAjukan = () => {\n    window.location.href = "/dashboard/seller/produk";\n  };`
  );
  console.log("Used regex replace");
}

fs.writeFileSync('app/dashboard/seller/page.tsx', content, 'utf8');
