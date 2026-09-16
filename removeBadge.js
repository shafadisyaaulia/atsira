const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

// Hapus badge {b.status} dan {latest.status}
content = content.replace(
  /<span className="text-\[10px\] px-2 py-0\.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">\{b\.status\}<\/span>/g,
  ""
);
content = content.replace(
  /<span className="ml-auto text-\[10px\] bg-emerald-700\/40 px-2 py-0\.5 rounded-full">\{latest\.status\}<\/span>/g,
  ""
);

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Badge status removed');
