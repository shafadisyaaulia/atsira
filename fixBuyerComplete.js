const fs = require('fs');
let content = fs.readFileSync('app/dashboard/buyer/pesanan/page.tsx', 'utf8');

// Tambahkan updateOrderStatus function
const funcToAdd = `
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(\`/api/seller/orders\`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
        if (activeDetailOrder && activeDetailOrder.id === orderId) {
          setActiveDetailOrder({ ...activeDetailOrder, status: newStatus });
        }
      } else {
        alert("Gagal memperbarui status.");
      }
    } catch (e) {
      alert("Terjadi kesalahan sistem.");
    }
  };
`;

content = content.replace(
  /const handlePayNow = async/,
  funcToAdd + '\n  const handlePayNow = async'
);

// Tambahkan tombol Terima Barang
const btnTerima = `
                {activeDetailOrder.status === "shipped" && (
                  <button 
                    onClick={() => handleUpdateStatus(activeDetailOrder.id, "completed")}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs border-none shadow-md flex items-center justify-center gap-2 transition-colors order-1 sm:order-2 h-11"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terima Barang</span>
                  </button>
                )}
`;

content = content.replace(
  /\{isUnpaid \? \([\s\S]*?<\/button>\s*\)\s*:\s*null\}/,
  `{isUnpaid ? (
                  <button 
                    onClick={() => handlePayNow(activeDetailOrder)}
                    disabled={payLoadingId === activeDetailOrder.id}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs border-none shadow-md flex items-center justify-center gap-2 transition-colors order-1 sm:order-2 h-11"
                  >
                    {payLoadingId === activeDetailOrder.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <span>Bayar Tagihan Sekarang</span>
                  </button>
                ) : null}` + btnTerima
);

fs.writeFileSync('app/dashboard/buyer/pesanan/page.tsx', content, 'utf8');
