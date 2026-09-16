const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/page.tsx', 'utf8');

content = content.replace(
  'Sistem Anda telah terhubung penuh dengan modul **QualitySense v2.9**.',
  'Sistem Anda telah terhubung penuh dengan modul <strong className="text-white font-black">QualitySense v2.9</strong>.'
);

fs.writeFileSync('app/dashboard/seller/page.tsx', content, 'utf8');
