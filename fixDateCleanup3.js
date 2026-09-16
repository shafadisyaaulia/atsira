const fs = require("fs");
let mock = fs.readFileSync("lib/mock/index.ts", "utf8");
mock = mock.replace(/export function formatDateID\(dateStr: string \| undefined \| null\): string \{\n  if \(!dateStr\) return "-";\n  const d = new Date\(dateStr\);\n  if \(isNaN\(d\.getTime\(\)\)\) return "-";/g, `export function formatDateID(dateStr: string | undefined | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";`);
fs.writeFileSync("lib/mock/index.ts", mock, "utf8");
console.log("Fixed return string 2");
