const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf8');

content = content.replace(
  /const paymentOptions = isInternational\s*\?\s*\[([\s\S]*?)\]\s*:\s*\[([\s\S]*?)\];/,
  `const paymentOptions = isInternational 
      ? [
          { id: "stripe", label: "Credit / Debit Card (Visa/Mastercard via Stripe)" }
        ]
      : [
          { id: "cod", label: "Cash on Delivery (COD) / Bayar di Tempat" },
          { id: "midtrans", label: "Virtual Account / QRIS (Coming Soon)", disabled: true },
          { id: "escrow", label: "ATSIRA Secure Pay / Rekber (Coming Soon)", disabled: true }
        ];`
);

// Ganti default payment
content = content.replace(
  /const \[payment, setPayment\] = useState\("midtrans"\);/,
  `const [payment, setPayment] = useState("cod");`
);
content = content.replace(
  /setPayment\(isInternational \? "stripe" : "midtrans"\);/,
  `setPayment(isInternational ? "stripe" : "cod");`
);
content = content.replace(
  /const selectedPaymentMethod = isInternational \? "stripe" : "midtrans";/,
  `const selectedPaymentMethod = isInternational ? "stripe" : payment;`
);
content = content.replace(
  /paymentMethod: selectedPaymentMethod,/,
  `paymentMethod: payment,`
);

fs.writeFileSync('app/checkout/page.tsx', content, 'utf8');
