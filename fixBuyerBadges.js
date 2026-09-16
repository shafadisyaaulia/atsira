const fs = require('fs');
let content = fs.readFileSync('app/dashboard/buyer/pesanan/page.tsx', 'utf8');

// Fix isUnpaid and add isCOD
content = content.replace(
  /const isUnpaid = activeDetailOrder\.status\.toLowerCase\(\)\.includes\("menunggu"\);/g,
  `const isUnpaid = activeDetailOrder.status.toLowerCase() === "pending" || activeDetailOrder.status.toLowerCase().includes("menunggu");
    const isCOD = activeDetailOrder.paymentMethod === "cod";`
);

content = content.replace(
  /const isUnpaid = order\.status\.toLowerCase\(\)\.includes\("menunggu"\);/g,
  `const isUnpaid = order.status.toLowerCase() === "pending" || order.status.toLowerCase().includes("menunggu");
                const isCOD = order.paymentMethod === "cod";`
);

// Render badge status updates
content = content.replace(
  /if \(s\.includes\("menunggu"\)\) \{/,
  `if (s === "pending" || s.includes("menunggu")) {`
);
content = content.replace(
  /if \(s\.includes\("proses"\) \|\| s\.includes\("diproses"\)\) \{/,
  `if (s === "processing" || s.includes("proses") || s.includes("diproses")) {`
);
content = content.replace(
  /if \(s\.includes\("kirim"\) \|\| s\.includes\("dikirim"\)\) \{/,
  `if (s === "shipped" || s.includes("kirim") || s.includes("dikirim")) {`
);
content = content.replace(
  /if \(s\.includes\("selesai"\) \|\| s\.includes\("diterima"\)\) \{/,
  `if (s === "completed" || s.includes("selesai") || s.includes("diterima")) {`
);

// Hide Bayar button if COD (Detail Page)
content = content.replace(
  /\{isUnpaid \? \(/,
  `{isUnpaid && !isCOD ? (`
);
// Replace null with COD message if unpaid and COD
content = content.replace(
  /<\span>Bayar Tagihan Sekarang<\/span>\s*<\/button>\s*\)\s*:\s*null\}/,
  `<span>Bayar Tagihan Sekarang</span>
                  </button>
                ) : isUnpaid && isCOD ? (
                  <div className="flex-1 bg-stone-100 text-stone-500 font-bold py-3 px-4 rounded-xl text-xs border border-stone-200 flex items-center justify-center gap-2 order-1 sm:order-2 h-11">
                    <span>Menunggu Konfirmasi COD</span>
                  </div>
                ) : null}`
);

// Hide Bayar button if COD (List Item)
content = content.replace(
  /\{isUnpaid && \(/,
  `{isUnpaid && !isCOD && (`
);

fs.writeFileSync('app/dashboard/buyer/pesanan/page.tsx', content, 'utf8');
