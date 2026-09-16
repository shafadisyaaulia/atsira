const fs = require("fs");
let content = fs.readFileSync("app/dashboard/peneliti/page.tsx", "utf8");
content = content.replace(/STATUS_BADGE\[item.status as VerificationQueueItem\["status"\]\]/g, `(STATUS_BADGE as any)[item.status]`);
content = content.replace(/STATUS_BADGE\[item.status\]/g, `(STATUS_BADGE as any)[item.status]`);
fs.writeFileSync("app/dashboard/peneliti/page.tsx", content, "utf8");
console.log("Fixed status badge type");
