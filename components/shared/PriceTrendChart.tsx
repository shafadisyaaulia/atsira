"use client";

import { usePemastaStore } from "@/lib/store";

interface PriceTrendChartProps {
  className?: string;
}

export default function PriceTrendChart({ className }: PriceTrendChartProps) {
  const { marketPrices } = usePemastaStore();

  // Ambil max 10 data terbaru, urutkan dari yang lama ke baru untuk chart
  const data = [...marketPrices]
    .slice(0, 10)
    .reverse()
    .map((p) => ({
      date: p.date,
      price: Number(p.pricePerKg),
      region: p.region,
    }));

  if (data.length < 2) {
    return null;
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const W = 600;
  const H = 120;
  const PAD = 20;

  // Normalize to SVG coords
  const points = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((d.price - minPrice) / range) * (H - PAD * 2),
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Fill path
  const fillD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;

  return (
    <div className={`bg-white rounded-xl border border-stone-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Tren Harga Minyak Nilam (Rp/Kg)</h3>
        <span className="text-[10px] text-stone-400 font-medium">{data.length} titik data</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + t * (H - PAD * 2)}
            y2={PAD + t * (H - PAD * 2)}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}

        {/* Fill */}
        <path d={fillD} fill="url(#priceGrad)" opacity="0.3" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Gradient */}
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3} fill={i === points.length - 1 ? "#059669" : "#34d399"} />
        ))}
      </svg>

      {/* Price labels */}
      <div className="flex justify-between mt-2">
        <div className="text-[10px] text-stone-400">
          <span className="font-mono">Rp {minPrice.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-stone-500">Terbaru:</span>
          <span className="text-[11px] font-black text-emerald-700 font-mono">
            Rp {prices[prices.length - 1].toLocaleString("id-ID")}/Kg
          </span>
          {prices.length >= 2 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${prices[prices.length - 1] >= prices[prices.length - 2] ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
              {prices[prices.length - 1] >= prices[prices.length - 2] ? "▲" : "▼"}
              {Math.abs(((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2]) * 100).toFixed(1)}%
            </span>
          )}
        </div>
        <div className="text-[10px] text-stone-400">
          <span className="font-mono">Rp {maxPrice.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Date axis */}
      <div className="flex justify-between mt-1">
        {data.length > 0 && (
          <>
            <span className="text-[9px] text-stone-300">{data[0].date}</span>
            <span className="text-[9px] text-stone-300">{data[data.length - 1].date}</span>
          </>
        )}
      </div>
    </div>
  );
}
