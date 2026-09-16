const fs = require('fs');

let content = fs.readFileSync('app/dashboard/seller/page.tsx', 'utf8');

// Use auth store check for petani
content = content.replace(
  `const { user } = useAuthStore();`,
  `const { user } = useAuthStore();
  const isPetani = user?.role === "petani";`
);

// Show Pemasta notification only if isPetani
content = content.replace(
  `{latestPrice && (`,
  `{isPetani && latestPrice && (`
);

// Make 'Ajukan Pengujian Lab' link to produk page
content = content.replace(
  `const handleAjukan = () => {
    addRequest({
      nodeName: user?.name || "Petani Nilam",
      region: "Aceh",
      farmerId: user?.id || "petani-1"
    });
    alert("Berhasil mengajukan sertifikasi! Sampel sekarang berada di antrean ARC.");
  };`,
  `const handleAjukan = () => {
    window.location.href = "/dashboard/seller/produk";
  };`
);

fs.writeFileSync('app/dashboard/seller/page.tsx', content, 'utf8');
