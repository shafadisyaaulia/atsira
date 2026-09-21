"use client";

import { useState, useCallback } from "react";
import { QrCode, Download, X, Loader2, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

interface NilamTraceQRProps {
  batchId: string;
  productName?: string;
  /** Render sebagai tombol inline (default) atau hanya ikon */
  variant?: "button" | "icon";
}

/**
 * Komponen NilamTrace QR Generator.
 *
 * Klik tombol → generate QR dari API → tampilkan modal dengan:
 * - Preview QR code berwarna hijau atSira
 * - Link traceability
 * - Tombol unduh PNG
 * - Tombol salin link
 */
export function NilamTraceQR({ batchId, productName, variant = "button" }: NilamTraceQRProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<{ qrDataUrl: string; traceUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    setOpen(true);
    if (qrData) return; // sudah di-cache
    setLoading(true);
    setError(null);
    try {
      const label = productName || batchId;
      const res = await fetch(`/api/qr?data=${encodeURIComponent(batchId)}&label=${encodeURIComponent(label)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal generate QR");
      setQrData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [batchId, productName, qrData]);

  function downloadQR() {
    if (!qrData) return;
    const link = document.createElement("a");
    link.href = qrData.qrDataUrl;
    link.download = `nilam-trace-${batchId}.png`;
    link.click();
  }

  async function copyLink() {
    if (!qrData) return;
    await navigator.clipboard.writeText(qrData.traceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {/* Trigger button */}
      {variant === "button" ? (
        <button
          onClick={generate}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-medium"
        >
          <QrCode className="w-3.5 h-3.5" />
          NilamTrace QR
        </button>
      ) : (
        <button
          onClick={generate}
          className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition-colors"
          title="Generate NilamTrace QR"
        >
          <QrCode className="w-4 h-4" />
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4 text-stone-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-3">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-700">NilamTrace Digital</span>
              </div>
              <h3 className="font-black text-stone-800 text-base">Kode QR Ketelusuran</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {productName && <span className="font-medium">{productName} · </span>}
                Batch: <span className="font-mono font-bold text-emerald-700">{batchId}</span>
              </p>
            </div>

            {/* QR Display */}
            <div className="flex items-center justify-center bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4 min-h-[200px]">
              {loading ? (
                <div className="flex flex-col items-center gap-2 text-stone-400">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-xs">Generating QR...</p>
                </div>
              ) : error ? (
                <p className="text-xs text-red-500 text-center">{error}</p>
              ) : qrData ? (
                <img src={qrData.qrDataUrl} alt="NilamTrace QR" className="w-48 h-48 object-contain" />
              ) : null}
            </div>

            {/* Trace URL */}
            {qrData && (
              <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <p className="text-[10px] text-stone-600 truncate flex-1">{qrData.traceUrl}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                disabled={!qrData}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-50 transition-colors text-stone-700 font-medium"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin!" : "Salin Link"}
              </button>
              <button
                onClick={downloadQR}
                disabled={!qrData}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-colors text-white font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PNG
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center mt-3 leading-relaxed">
              Tempel QR ini pada label kemasan produk nilam Anda.<br />
              Pembeli bisa scan untuk melihat rekam jejak hulu ke hilir.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
