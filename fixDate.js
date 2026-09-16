const fs = require("fs");

let mock = fs.readFileSync("lib/mock/index.ts", "utf8");
mock = mock.replace(
  /export function formatDateID[\s\S]*?\}\)/,
  `export function formatDateID(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);`
);
fs.writeFileSync("lib/mock/index.ts", mock, "utf8");
console.log("Fixed formatDateID robustly");
