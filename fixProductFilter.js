const fs = require("fs");
let content = fs.readFileSync("app/dashboard/seller/produk/page.tsx", "utf8");

content = content.replace(
  /\.from\("products"\)\s*\.select\("\*"\)\s*\.order\("created_at"/,
  `.from("products")\n      .select("*")\n      .eq("seller_id", user?.id || "00000000-0000-0000-0000-000000000000")\n      .order("created_at"`
);

fs.writeFileSync("app/dashboard/seller/produk/page.tsx", content, "utf8");
console.log("Fixed product fetch filtering by seller_id");
