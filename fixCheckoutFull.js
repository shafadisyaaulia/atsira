const fs = require("fs");
let content = fs.readFileSync("app/checkout/page.tsx", "utf8");

// 1. Add new states
content = content.replace(
  `  const [processing, setProcessing] = useState(false);`,
  `  const [processing, setProcessing] = useState(false);
  const [payStep, setPayStep] = useState("form"); // form | va_code | verifying
  const [vaCode, setVaCode] = useState("");`
);

// 2. Restore full payment options
const oldOptions = `const paymentOptions = isInternational 
      ? [
          { id: "stripe", label: "Credit / Debit Card (Visa/Mastercard via Stripe)" }
        ]
      : [
          { id: "midtrans", label: "Virtual Account (BCA, Mandiri, BSI) / QRIS Domestik" }
        ];`;

const newOptions = `const paymentOptions = isInternational
      ? [
          { id: "stripe", label: "Credit / Debit Card (Visa/Mastercard via Stripe)" }
        ]
      : [
          { id: "cod",        label: "Cash on Delivery (COD) / Bayar di Tempat" },
          { id: "qris",       label: "QRIS (Semua E-Wallet & Mobile Banking)" },
          { id: "va_bca",     label: "Virtual Account BCA" },
          { id: "va_mandiri", label: "Virtual Account Mandiri" },
          { id: "va_bsi",     label: "Virtual Account BSI (Syariah)" },
          { id: "escrow",     label: "ATSIRA Secure Pay / Rekber (Coming Soon)", disabled: true }
        ];`;

content = content.replace(oldOptions, newOptions);

// 3. Reset default payment to cod
content = content.replace(
  `setPayment(isInternational ? "stripe" : "midtrans");`,
  `setPayment(isInternational ? "stripe" : "cod");`
);
content = content.replace(
  `const [payment, setPayment] = useState("midtrans");`,
  `const [payment, setPayment] = useState("cod");`
);

// 4. Inject VA code step at start of handlePay
const oldHandlePayStart = `  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setProcessing(true);`;

const newHandlePayStart = `  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    // STEP: Virtual Account -> tampilkan kode VA dulu
    if ((payment === "va_bca" || payment === "va_mandiri" || payment === "va_bsi") && payStep === "form") {
      const prefix = payment === "va_bca" ? "8277" : payment === "va_mandiri" ? "8913" : "8081";
      setVaCode(prefix + Math.floor(10000000 + Math.random() * 90000000).toString());
      setPayStep("va_code");
      return;
    }

    setPayStep("verifying");
    setProcessing(true);`;

content = content.replace(oldHandlePayStart, newHandlePayStart);

// 5. Bypass Snap for simulated methods
const oldMidtransComment = `      // 2. MIDTRANS SNAP POPUP
      if (result.token) {`;

const newMidtransComment = `      // 2. SIMULASI: COD, QRIS, VA -> loading 1.8 detik lalu redirect sukses
      if (payment === "cod" || payment === "qris" || payment.startsWith("va_")) {
        setTimeout(() => {
          setProcessing(false);
          router.push(\`/checkout/success?orderId=\${encodeURIComponent(result.orderId)}\`);
        }, 1800);
        return;
      }

      // 3. MIDTRANS SNAP POPUP (Stripe)
      if (result.token) {`;

content = content.replace(oldMidtransComment, newMidtransComment);

// 6. Fix disabled payment options
content = content.replace(
  `key={p.id}
                      onClick={() => setPayment(p.id)}`,
  `key={p.id}
                      disabled={(p as any).disabled}
                      onClick={() => !(p as any).disabled && setPayment(p.id)}`
);
content = content.replace(
  `payment === p.id 
                          ? "border-primary bg-emerald-50/40 shadow-xs ring-1 ring-primary" 
                          : "border-surface-container-high hover:bg-surface-container-low"`,
  `(p as any).disabled
                          ? "border-stone-100 bg-stone-50 opacity-40 cursor-not-allowed"
                          : payment === p.id
                            ? "border-primary bg-emerald-50/40 shadow-xs ring-1 ring-primary"
                            : "border-surface-container-high hover:bg-surface-container-low"`
);

// 7. Inject overlay modals before main return PageShell
const mainReturn = `  return (
    <PageShell>
      {/* Script Midtrans Snap Sandbox */}`;

const withOverlays = `  return (
    <PageShell>

      {/* OVERLAY: Kode Virtual Account */}
      {payStep === "va_code" && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                {payment === "va_bca" ? "Virtual Account BCA" : payment === "va_mandiri" ? "Virtual Account Mandiri" : "Virtual Account BSI"}
              </p>
              <p className="text-2xl font-mono font-black text-stone-900 tracking-widest bg-stone-100 px-4 py-3 rounded-xl mt-2 border border-stone-200">{vaCode}</p>
              <p className="text-xs text-stone-500 mt-2">Berlaku selama 24 jam · Total: <strong className="text-emerald-700">{formatIDR(total)}</strong></p>
            </div>
            <div className="text-left bg-stone-50 rounded-xl p-4 border border-stone-200">
              <p className="text-xs font-bold text-stone-700 mb-2">Cara Pembayaran:</p>
              <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Buka aplikasi mobile banking {payment === "va_bca" ? "BCA Mobile" : payment === "va_mandiri" ? "Livin by Mandiri" : "BSI Mobile"}</li>
                <li>Pilih menu <strong>Transfer &rarr; Virtual Account</strong></li>
                <li>Masukkan nomor kode di atas</li>
                <li>Bayar tepat <strong>{formatIDR(total)}</strong> dan konfirmasi</li>
              </ol>
            </div>
            <button type="button" onClick={handlePay}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 rounded-xl text-sm transition-colors shadow-md">
              ✅ Saya Sudah Bayar — Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY: Verifikasi Pembayaran */}
      {payStep === "verifying" && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-10 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto animate-pulse">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-black text-stone-900 text-lg">Memverifikasi Pembayaran</h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {payment === "qris" ? "Memindai konfirmasi QRIS dari server bank..." :
                 payment === "cod" ? "Mencatat pesanan COD ke dalam sistem..." :
                 "Memverifikasi transfer Virtual Account masuk..."}
              </p>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-[growbar_1.8s_ease-in-out_forwards]" style={{width:"0%",animation:"width 1.8s linear forwards"}}></div>
            </div>
            <p className="text-[10px] text-stone-400 font-medium">Harap tunggu, jangan tutup halaman ini...</p>
          </div>
        </div>
      )}

      {/* Script Midtrans Snap Sandbox */}`;

content = content.replace(mainReturn, withOverlays);

fs.writeFileSync("app/checkout/page.tsx", content, "utf8");
console.log("DONE - All changes applied");
