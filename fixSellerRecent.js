const fs = require("fs");
let content = fs.readFileSync("app/dashboard/seller/page.tsx", "utf8");

content = content.replace(/\{RECENT_ORDERS\.map\(\(order\) => \(/g, 
`{recentOrders.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">Belum ada pesanan terbaru.</div>
              ) : recentOrders.map((order) => (`);

fs.writeFileSync("app/dashboard/seller/page.tsx", content, "utf8");
console.log("Fixed seller recent orders map");
