const fs = require('fs');
let content = fs.readFileSync('app/api/checkout/route.ts', 'utf8');

content = content.replace(
  /status: paymentMethod === "cod" \? "MENUNGGU KONFIRMASI" : "Menunggu Pembayaran",/,
  `status: paymentMethod === "cod" ? "pending" : "pending",`
);

fs.writeFileSync('app/api/checkout/route.ts', content, 'utf8');
