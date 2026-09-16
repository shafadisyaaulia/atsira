const fs = require("fs");
let content = fs.readFileSync("app/checkout/page.tsx", "utf8");

// Fix disabled radio button rendering di paymentOptions map
content = content.replace(
  `{paymentOptions.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPayment(p.id)}`,
  `{paymentOptions.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      disabled={(p as any).disabled}
                      onClick={() => !(p as any).disabled && setPayment(p.id)}`
);

// Tambahkan kelas disabled pada button
content = content.replace(
  `className={\`w-full text-left flex items-center justify-between p-4 rounded-xl border transition-all \${
                        payment === p.id 
                          ? "border-primary bg-emerald-50/40 shadow-xs ring-1 ring-primary" 
                          : "border-surface-container-high hover:bg-surface-container-low"
                      }\`}`,
  `className={\`w-full text-left flex items-center justify-between p-4 rounded-xl border transition-all \${
                        (p as any).disabled
                          ? "border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed"
                          : payment === p.id 
                            ? "border-primary bg-emerald-50/40 shadow-xs ring-1 ring-primary" 
                            : "border-surface-container-high hover:bg-surface-container-low"
                      }\`}`
);

fs.writeFileSync("app/checkout/page.tsx", content, "utf8");
console.log("DONE");
