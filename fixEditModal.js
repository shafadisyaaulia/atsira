const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/produk/page.tsx', 'utf8');

const editModalFunc = `
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormPrice(String(product.price));
    setFormStock(String(product.stock));
  };

  const handleSaveEdit`;

content = content.replace("const handleSaveEdit", editModalFunc);
fs.writeFileSync('app/dashboard/seller/produk/page.tsx', content, 'utf8');
