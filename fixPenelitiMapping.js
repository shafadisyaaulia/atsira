const fs = require("fs");

// Fix 1: Buat formatDateID aman terhadap undefined/null/invalid
let mock = fs.readFileSync("lib/mock/index.ts", "utf8");
mock = mock.replace(
  `export function formatDateID(dateStr: string): string {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));`,
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
console.log("Fixed formatDateID");

// Fix 2: Perbaiki mapping data dari Supabase di VerificationQueueSection
let peneliti = fs.readFileSync("app/dashboard/peneliti/page.tsx", "utf8");

// Mapping yang benar - sesuaikan field dari DB ke field yang dipakai JSX
peneliti = peneliti.replace(
  `setQueue(data.map((item: any) => ({
          id: item.id,
          farmer_name: item.product_title,
          farm_region: item.notes || "Aceh",
          submit_date: new Date(item.created_at).toISOString().split("T")[0],
          status: item.status,
          sample_volume: item.sample_volume,
          method: "NIRS-PLS",
        })));`,
  `setQueue(data.map((item: any) => ({
          id: item.id,
          farmerName: item.product_title,
          region: item.notes || "Aceh",
          submittedAt: item.created_at || null,
          status: item.status,
          sampleVolume: item.sample_volume,
          aiPaLevel: "~32",
          aiGrade: "Grade A",
          sampleImageUrl: "/images/products/minyak nilam.png",
          method: "NIRS-PLS",
        })));`
);

// Pastikan tombol update status pakai field yang benar
peneliti = peneliti.replace(/item\.farmer_name/g, "item.farmerName");
peneliti = peneliti.replace(/item\.farm_region/g, "item.region");
peneliti = peneliti.replace(/item\.submit_date/g, "item.submittedAt");

fs.writeFileSync("app/dashboard/peneliti/page.tsx", peneliti, "utf8");
console.log("Fixed mapping fields in peneliti page");
