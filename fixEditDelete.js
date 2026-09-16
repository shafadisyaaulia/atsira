const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/produk/page.tsx', 'utf8');

content = content.replace(
  /const targetTable = editingProduct\.isRaw \? "raw_oil_listings" : "finished_products";\s*const updateData = editingProduct\.isRaw\s*\?\s*\{\s*title: formTitle, price_per_kg: Number\(formPrice\), stock_kg: Number\(formStock\)\s*\}\s*:\s*\{\s*title: formTitle, price: Number\(formPrice\), stock: Number\(formStock\)\s*\};\s*const \{ error \} = await supabase\s*\.from\(targetTable\)\s*\.update\(updateData\)\s*\.eq\("id", editingProduct\.id\);/,
  `const { error } = await supabase
        .from("products")
        .update({ title: formTitle, price: Number(formPrice), stock: Number(formStock) })
        .eq("id", editingProduct.id);`
);

content = content.replace(
  /const targetTable = deletingProduct\.isRaw \? "raw_oil_listings" : "finished_products";\s*const \{ error \} = await supabase\s*\.from\(targetTable\)\s*\.delete\(\)\s*\.eq\("id", deletingProduct\.id\);/,
  `const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingProduct.id);`
);

fs.writeFileSync('app/dashboard/seller/produk/page.tsx', content, 'utf8');
