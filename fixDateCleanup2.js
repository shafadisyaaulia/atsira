const fs = require("fs");
let mock = fs.readFileSync("lib/mock/index.ts", "utf8");
mock = mock.replace(/return "[^"]*";/g, 'return "-";');
mock = mock.replace(/return new Intl\.NumberFormat\("id-ID"/, 'return "-_DO_NOT_REPLACE"; return new Intl.NumberFormat("id-ID"');
mock = mock.replace(/return "-";\s*return new Intl\.NumberFormat/, 'return new Intl.NumberFormat');
fs.writeFileSync("lib/mock/index.ts", mock, "utf8");
console.log("Fixed return string");
