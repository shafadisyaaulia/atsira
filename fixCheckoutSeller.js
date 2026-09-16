const fs = require('fs');
let content = fs.readFileSync('app/api/checkout/route.ts', 'utf8');

content = content.replace(
  /seller_id: null,/,
  `seller_id: items[0]?.seller || items[0]?.sellerId || null,`
);

fs.writeFileSync('app/api/checkout/route.ts', content, 'utf8');
