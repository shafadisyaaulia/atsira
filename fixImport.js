const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/page.tsx', 'utf8');

content = content.replace(
  'import { CoAPDFButton } from "@/components/shared/CoAPDFButton";',
  'import CoAPDFButton from "@/components/shared/CoAPDFButton";'
);

fs.writeFileSync('app/dashboard/seller/page.tsx', content, 'utf8');
