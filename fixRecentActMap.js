const fs = require("fs");
let content = fs.readFileSync("app/dashboard/buyer/page.tsx", "utf8");

content = content.replace(
  /\{recentActivities\.map\(\(act, i\) => \(/g,
  `{recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs">Belum ada aktivitas terbaru.</div>
                ) : recentActivities.map((act, i) => (`
);

fs.writeFileSync("app/dashboard/buyer/page.tsx", content, "utf8");
console.log("Fixed recentActivities mapping");
