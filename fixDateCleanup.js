const fs = require("fs");
let mock = fs.readFileSync("lib/mock/index.ts", "utf8");
mock = mock.replace(/\}\)\.format\(d\);\.format\(new Date\(dateStr\)\);/g, '}).format(d);');
mock = mock.replace(/\?"/g, '-');
fs.writeFileSync("lib/mock/index.ts", mock, "utf8");
console.log("Cleaned up formatDateID");
