const fs = require("fs");

// Fix 1: buyer/market - remove duplicate seller_id
let market = fs.readFileSync("app/dashboard/buyer/market/page.tsx", "utf8");

// Remove the "seller_id: item.seller_id" duplicate (second occurrence)
const lines = market.split("\n");
let firstSellerId = false;
const fixed = lines.filter(line => {
  if (line.includes("seller_id: item.seller_id,") && line.includes("category:")) {
    // This is the merged line "category: item.category, seller_id: item.seller_id," - fix it
    return true; // keep but we'll replace below
  }
  return true;
}).join("\n");

market = fixed
  .replace("category: item.category, seller_id: item.seller_id,", "category: item.category,")
  .replace(/,\n\s*seller_id: item\.seller_id,(\n\s*seller:)/, ",$1");

// Fix 2: remove 'seller' from addItem calls
market = market.replace(/category: product\.isRaw \? "raw-oil" : "finished-product", seller: product\.seller_id,/g, `category: product.isRaw ? "raw-oil" : "finished-product",`);

fs.writeFileSync("app/dashboard/buyer/market/page.tsx", market, "utf8");

// Fix 3: seller/pengadaan - replace RAW_OIL_LISTINGS.filter
let pengadaan = fs.readFileSync("app/dashboard/seller/pengadaan/page.tsx", "utf8");
pengadaan = pengadaan.replace(
  "const filteredProducts = (RAW_OIL_LISTINGS || []).filter((p: any) => {",
  "const filteredProducts = (productsList || []).filter((p: any) => {"
);
fs.writeFileSync("app/dashboard/seller/pengadaan/page.tsx", pengadaan, "utf8");

console.log("DONE");
