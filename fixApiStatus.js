const fs = require('fs');

const fixStatus = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /const statusMap: Record<string, string> = \{[\s\S]*?\};\s*query = query\.eq\("status", statusMap\[status\] \|\| status\);/m,
    `query = query.eq("status", status);`
  );
  fs.writeFileSync(file, content, 'utf8');
}

fixStatus('app/api/buyer/orders/route.ts');
fixStatus('app/api/seller/orders/route.ts');
