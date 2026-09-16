const fs = require('fs');
let content = fs.readFileSync('app/api/checkout/route.ts', 'utf8');

// Update status jika COD -> 'MENUNGGU KONFIRMASI'
content = content.replace(
  /status: "Menunggu Pembayaran",/,
  `status: paymentMethod === "cod" ? "MENUNGGU KONFIRMASI" : "Menunggu Pembayaran",`
);

// Bypass Midtrans jika COD
content = content.replace(
  /\/\/ 4\. JALUR MIDTRANS \(DOMESTIK\)/,
  `// 4. JALUR COD
    if (paymentMethod === "cod") {
      return NextResponse.json({
        ok: true,
        orderId,
      });
    }

    // 5. JALUR MIDTRANS (DOMESTIK)`
);

fs.writeFileSync('app/api/checkout/route.ts', content, 'utf8');
