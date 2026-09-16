const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf8');

// Update logic ketika COD
content = content.replace(
  /if \(result.token\) \{/,
  `if (payment === "cod" || result.ok && !result.token && !result.redirectUrl) {
          router.push(\`/checkout/success?orderId=\${encodeURIComponent(result.orderId)}\`);
          return;
        }

        if (result.token) {`
);

// Perbaiki disabled radio option mapping
content = content.replace(
  /className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"/,
  `className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" disabled={opt.disabled}`
);

content = content.replace(
  /<label htmlFor=\{opt.id\} className="text-sm font-medium text-stone-700 cursor-pointer">/,
  `<label htmlFor={opt.id} className={\`text-sm font-medium \${opt.disabled ? "text-stone-400" : "text-stone-700 cursor-pointer"}\`}>`
);

fs.writeFileSync('app/checkout/page.tsx', content, 'utf8');
