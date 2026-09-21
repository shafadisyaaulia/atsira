const fs = require("fs");
let content = fs.readFileSync("app/checkout/page.tsx", "utf8");

// Tambahkan import CheckCircle2 dan Loader2 di atas jika belum ada
if (!content.includes("CheckCircle2")) {
  content = content.replace(
    'import { Lock, ShieldCheck, CreditCard, ShoppingBag, Globe, Truck, UserCheck, LogIn } from "lucide-react";',
    'import { Lock, ShieldCheck, CreditCard, ShoppingBag, Globe, Truck, UserCheck, LogIn, CheckCircle2, Loader2, Copy, Building2 } from "lucide-react";'
  );
}

// Inject UI modal VA code + overlay verifying setelah baris "return (" yang terakhir
// Kita inject setelah `<PageShell>` yang terakhir (main form) dan sebelum `<Script ...>`
const injectAfter = `  return (
    <PageShell>
      {/* Script Midtrans Snap Sandbox */}`;

const withInjected = `  return (
    <PageShell>
      
      {/* === OVERLAY: Menampilkan Kode VA === */}
      {payStep === "va_code" && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                {payment === "va_bca" ? "Virtual Account BCA" : payment === "va_mandiri" ? "Virtual Account Mandiri" : "Virtual Account BSI"}
              </p>
              <h2 className="text-2xl font-mono font-black text-stone-900 tracking-widest bg-stone-100 px-4 py-3 rounded-xl mt-2 border border-stone-200">
                {vaCode}
              </h2>
              <p className="text-xs text-stone-500 mt-2">Berlaku selama 24 jam</p>
            </div>
            <div className="text-left bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
              <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" /> Cara Pembayaran:</p>
              <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Buka aplikasi {payment === "va_bca" ? "BCA Mobile / m-BCA" : payment === "va_mandiri" ? "Livin&apos; by Mandiri" : "BSI Mobile"}</li>
                <li>Pilih menu <strong>Transfer → Virtual Account</strong></li>
                <li>Masukkan kode di atas</li>
                <li>Bayar sebesar <strong className="text-emerald-700">{formatIDR(total)}</strong></li>
              </ol>
            </div>
            <button
              type="button"
              onClick={handlePay}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl text-sm transition-colors shadow-md"
            >
              ✅ Saya Sudah Bayar — Konfirmasi Pembayaran
            </button>
            <p className="text-[10px] text-stone-400">Pembayaran akan diverifikasi otomatis oleh sistem atSira.</p>
          </div>
        </div>
      )}

      {/* === OVERLAY: Verifikasi Pembayaran === */}
      {payStep === "verifying" && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-10 text-center space-y-5 animate-in fade-in duration-300">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
            <div>
              <h2 className="font-black text-stone-900 text-lg">Menunggu Verifikasi Pembayaran</h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {payment === "qris" ? "Memindai konfirmasi QRIS dari bank..." : 
                 payment === "cod" ? "Mencatat pesanan COD Anda..." :
                 "Memverifikasi transfer masuk dari Virtual Account..."}
              </p>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[progress_1.8s_ease-in-out_forwards] rounded-full" style={{animation: "width 1.8s ease-in-out forwards", width: "100%"}}></div>
            </div>
            <p className="text-[10px] text-stone-400 font-medium">Harap tunggu, jangan tutup halaman ini...</p>
          </div>
        </div>
      )}

      {/* Script Midtrans Snap Sandbox */}`;

content = content.replace(injectAfter, withInjected);

fs.writeFileSync("app/checkout/page.tsx", content, "utf8");
console.log("DONE - UI overlays injected");
