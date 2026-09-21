const fs = require("fs");
let content = fs.readFileSync("app/checkout/page.tsx", "utf8");

// 1. Tambah state payStep & vaCode setelah processing
content = content.replace(
  'const [processing, setProcessing] = useState(false);',
  `const [processing, setProcessing] = useState(false);
  const [payStep, setPayStep] = useState("form"); // "form" | "va_code" | "verifying" | "success"
  const [vaCode, setVaCode] = useState("");`
);

// 2. Ganti paymentOptions domestik -- restore semua opsi + tandai coming soon untuk rekber saja
content = content.replace(
  `const paymentOptions = isInternational 
      ? [
          { id: "stripe", label: "Credit / Debit Card (Visa/Mastercard via Stripe)" }
        ]
      : [
          { id: "cod", label: "Cash on Delivery (COD) / Bayar di Tempat" },
          { id: "midtrans", label: "Virtual Account / QRIS (Coming Soon)", disabled: true },
          { id: "escrow", label: "atSira Secure Pay / Rekber (Coming Soon)", disabled: true }
        ];`,
  `const paymentOptions = isInternational 
      ? [
          { id: "stripe", label: "Credit / Debit Card (Visa/Mastercard via Stripe)" }
        ]
      : [
          { id: "cod", label: "Cash on Delivery (COD) / Bayar di Tempat" },
          { id: "qris", label: "QRIS (Semua E-Wallet & Mobile Banking)" },
          { id: "va_bca", label: "Virtual Account BCA" },
          { id: "va_mandiri", label: "Virtual Account Mandiri" },
          { id: "va_bsi", label: "Virtual Account BSI (Syariah)" },
          { id: "escrow", label: "atSira Secure Pay / Rekber (Coming Soon)", disabled: true }
        ];`
);

// 3. Ganti default payment ke "cod"
content = content.replace(
  `setPayment(isInternational ? "stripe" : "midtrans");`,
  `setPayment(isInternational ? "stripe" : "cod");`
);

// 4. Ganti logic handlePay untuk simulasi
const oldHandlePay = `  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setProcessing(true);
    localStorage.setItem("lang", lang);

    try {
      const selectedPaymentMethod = isInternational ? "stripe" : "midtrans";

      const response = await fetch("/api/checkout", {`;

const newHandlePay = `  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    // Jika Virtual Account, tampilkan kode VA dulu sebelum bayar
    if ((payment === "va_bca" || payment === "va_mandiri" || payment === "va_bsi") && payStep === "form") {
      const prefix = payment === "va_bca" ? "8277" : payment === "va_mandiri" ? "8913" : "8081";
      const code = prefix + Math.floor(10000000 + Math.random() * 90000000).toString();
      setVaCode(code);
      setPayStep("va_code");
      return;
    }

    setPayStep("verifying");
    setProcessing(true);
    localStorage.setItem("lang", lang);

    try {
      const selectedPaymentMethod = isInternational ? "stripe" : payment;

      const response = await fetch("/api/checkout", {`;

content = content.replace(oldHandlePay, newHandlePay);

// 5. Bypass Midtrans/Snap untuk semua metode simulasi (qris, va_*, cod), langsung redirect sukses
const oldRedirect = `      // 2. MIDTRANS SNAP POPUP
      if (result.token) {`;
const newRedirect = `      // 2. SIMULASI PEMBAYARAN: COD, QRIS, VA -> langsung sukses
      if (payment === "cod" || payment === "qris" || payment.startsWith("va_")) {
        setTimeout(() => {
          setProcessing(false);
          router.push(\`/checkout/success?orderId=\${encodeURIComponent(result.orderId)}\`);
        }, 1800);
        return;
      }

      // 3. MIDTRANS SNAP POPUP (Stripe / non-simulasi)
      if (result.token) {`;

content = content.replace(oldRedirect, newRedirect);

fs.writeFileSync("app/checkout/page.tsx", content, "utf8");
console.log("DONE - checkout page updated");
