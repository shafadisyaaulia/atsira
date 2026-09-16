const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/page.tsx', 'utf8');

// 1. Fix handleAjukan - redirect ke produk page bukan alert
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

// 2. Hide PriceTrendChart when no data - wrap with conditional 
// The PriceTrendChart already shows "Belum cukup data..." text. 
// We want to hide the whole section (including the col-span div) when < 2 data.
// Add a check for marketPrices.length before rendering it
content = content.replace(
  `          {/* GRAFIK TREN HARGA DARI PEMASTA */}
          <PriceTrendChart />`,
  `          {/* GRAFIK TREN HARGA DARI PEMASTA - Sembunyikan jika data < 2 */}
          {marketPrices.length >= 2 && <PriceTrendChart />}`
);

fs.writeFileSync('app/dashboard/seller/page.tsx', content, 'utf8');
