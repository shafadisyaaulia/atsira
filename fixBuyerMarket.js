const fs = require('fs');
let content = fs.readFileSync('app/dashboard/buyer/market/page.tsx', 'utf8');

// Ensure seller_id is mapped in fetchProducts
content = content.replace(
  /category: item\.category,/,
  `category: item.category, seller_id: item.seller_id,`
);

// Add seller to addItem payloads
content = content.replace(
  /category: product\.isRaw \? "raw-oil" : "finished-product",/g,
  `category: product.isRaw ? "raw-oil" : "finished-product", seller: product.seller_id,`
);

fs.writeFileSync('app/dashboard/buyer/market/page.tsx', content, 'utf8');
