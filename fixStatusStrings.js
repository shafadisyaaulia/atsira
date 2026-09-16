const fs = require("fs");

// Fix API buyer/orders - status mapping
let buyerApi = fs.readFileSync("app/api/buyer/orders/route.ts", "utf8");
buyerApi = buyerApi.replace(
  /\.eq\("status", "pending"\)/g, '.eq("status", "Menunggu Pembayaran")'
).replace(
  /\.eq\("status", "completed"\)/g, '.eq("status", "Selesai")'
);
fs.writeFileSync("app/api/buyer/orders/route.ts", buyerApi, "utf8");

// Fix API seller/orders - status mapping  
let sellerApi = fs.readFileSync("app/api/seller/orders/route.ts", "utf8");
sellerApi = sellerApi.replace(
  /\.eq\("status", "pending"\)/g, '.eq("status", "Menunggu Pembayaran")'
).replace(
  /status: "pending"/g, 'status: "Menunggu Pembayaran"'
).replace(
  /status: "processing"/g, 'status: "Diproses"'
).replace(
  /status: "shipped"/g, 'status: "Dikirim"'
).replace(
  /status: "completed"/g, 'status: "Selesai"'
).replace(
  /status: "cancelled"/g, 'status: "Dibatalkan"'
);
fs.writeFileSync("app/api/seller/orders/route.ts", sellerApi, "utf8");

// Fix checkout API - status saat insert order baru
let checkoutApi = fs.readFileSync("app/api/checkout/route.ts", "utf8");
checkoutApi = checkoutApi.replace(
  /status: "pending"/g, 'status: "Menunggu Pembayaran"'
).replace(
  /status: "processing"/g, 'status: "Diproses"'
);
fs.writeFileSync("app/api/checkout/route.ts", checkoutApi, "utf8");

// Fix buyer/pesanan status badge display
let pesananPage = fs.readFileSync("app/dashboard/buyer/pesanan/page.tsx", "utf8");
pesananPage = pesananPage.replace(
  /o\.status === "pending"/g, 'o.status === "Menunggu Pembayaran"'
).replace(
  /o\.status === "completed"/g, 'o.status === "Selesai"'
).replace(
  /o\.status === "shipped"/g, 'o.status === "Dikirim"'
).replace(
  /o\.status === "processing"/g, 'o.status === "Diproses"'
).replace(
  /o\.status === "cancelled"/g, 'o.status === "Dibatalkan"'
);
fs.writeFileSync("app/dashboard/buyer/pesanan/page.tsx", pesananPage, "utf8");

// Fix buyer dompet status check
let dompet = fs.readFileSync("app/dashboard/buyer/dompet/page.tsx", "utf8");
dompet = dompet.replace(
  /o\.status === "pending" \|\| o\.status === "Menunggu Pembayaran"/g, 'o.status === "Menunggu Pembayaran"'
).replace(
  /o\.status !== "pending" && o\.status !== "Menunggu Pembayaran"/g, 'o.status !== "Menunggu Pembayaran"'
).replace(
  /order\.status === "pending" \|\| order\.status === "Menunggu Pembayaran"/g, 'order.status === "Menunggu Pembayaran"'
);
fs.writeFileSync("app/dashboard/buyer/dompet/page.tsx", dompet, "utf8");

// Fix seller dashboard stats
let sellerDash = fs.readFileSync("app/dashboard/seller/page.tsx", "utf8");
sellerDash = sellerDash.replace(
  /o\.status === "pending" \|\| o\.status === "Menunggu Konfirmasi" \|\| o\.status === "Menunggu Pembayaran"/g,
  'o.status === "Menunggu Pembayaran"'
).replace(
  /o\.status !== "Dibatalkan" && o\.status !== "cancelled"/g,
  'o.status !== "Dibatalkan"'
);
fs.writeFileSync("app/dashboard/seller/page.tsx", sellerDash, "utf8");

// Fix buyer dashboard stats
let buyerDash = fs.readFileSync("app/dashboard/buyer/page.tsx", "utf8");
buyerDash = buyerDash.replace(
  /o\.status !== "Dibatalkan" && o\.status !== "cancelled"/g,
  'o.status !== "Dibatalkan"'
);
fs.writeFileSync("app/dashboard/buyer/page.tsx", buyerDash, "utf8");

console.log("DONE - All status strings normalized to Indonesian enum values");
