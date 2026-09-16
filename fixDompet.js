const fs = require("fs");
let content = fs.readFileSync("app/dashboard/buyer/dompet/page.tsx", "utf8");

content = content.replace(
  /\.filter\(\(o\) => o\.status === "Menunggu Pembayaran"\)/g,
  `.filter((o) => o.status === "pending" || o.status === "Menunggu Pembayaran")`
);
content = content.replace(
  /\.filter\(\(o\) => o\.status !== "Menunggu Pembayaran" && o\.status !== "Dibatalkan"\)/g,
  `.filter((o) => o.status !== "pending" && o.status !== "Menunggu Pembayaran" && o.status !== "Dibatalkan")`
);
content = content.replace(
  /order\.status === "Menunggu Pembayaran"/g,
  `order.status === "pending" || order.status === "Menunggu Pembayaran"`
);

fs.writeFileSync("app/dashboard/buyer/dompet/page.tsx", content, "utf8");
