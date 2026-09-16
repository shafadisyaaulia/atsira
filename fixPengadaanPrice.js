const fs = require("fs");
let pengadaan = fs.readFileSync("app/dashboard/seller/pengadaan/page.tsx", "utf8");
pengadaan = pengadaan.replace(/product\.pricePerKg/g, "product.price");
fs.writeFileSync("app/dashboard/seller/pengadaan/page.tsx", pengadaan, "utf8");
console.log("Fixed B2B Sourcing price mapping");
