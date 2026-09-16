const fs = require("fs");
let content = fs.readFileSync("app/dashboard/peneliti/page.tsx", "utf8");

// Remove VERIFICATION_QUEUE usage
content = content.replace(/VERIFICATION_QUEUE\.filter/g, `queue.filter`);
content = content.replace(/VERIFICATION_QUEUE\.reduce/g, `queue.reduce`);

// Fix implicitly any types
content = content.replace(/\(q\) =>/g, `(q: any) =>`);
content = content.replace(/\(item\) =>/g, `(item: any) =>`);
content = content.replace(/statusColors\[item.status\]/g, `statusColors[item.status as keyof typeof statusColors]`);

fs.writeFileSync("app/dashboard/peneliti/page.tsx", content, "utf8");
console.log("Fixed peneliti TS errors");
