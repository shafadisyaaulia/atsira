import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Ekosistem",
    links: [
      { label: "Penganalisis AI", href: "/dashboard/seller/qualitysense" },
      { label: "Rantai Pasok", href: "/traceability" },
      { label: "Pasar", href: "/marketplace" },
      { label: "Dasbor Harga", href: "/price-dashboard" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang ARC-USK", href: "/magazine" },
      { label: "Laporan Dampak", href: "/tracker" },
      { label: "Makalah Penelitian", href: "/magazine" },
      { label: "Karir", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Ketentuan Layanan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Kebijakan Cookie", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-primary text-inverse-on-surface">
      {/* Bagian Grid Atas */}
      <div className="container-app py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <p className="font-display text-2xl font-bold text-secondary-fixed mb-3">ATSIRA</p>
          <p className="text-sm text-inverse-on-surface/70 max-w-xs">
            Ekosistem digital terintegrasi pertama di Indonesia untuk perdagangan minyak nilam Aceh
            yang transparan dan terverifikasi.
          </p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-label-md uppercase tracking-wider text-inverse-on-surface/50 mb-4">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-inverse-on-surface/85 hover:text-secondary-fixed transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bagian Bottom Bar dengan Integrasi Logo Pemasta */}
      <div className="border-t border-white/10 py-8">
        <div className="container-app flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-inverse-on-surface/60">
          
          {/* Teks Legal Kemitraan */}
          <div className="space-y-1.5 text-center md:text-left">
            <p>© 2026 ATSIRA Ecosystem. Bekerja sama dengan ARC-USK, Universitas Syiah Kuala.</p>
            <p className="text-inverse-on-surface/40">Ditenagai oleh teknologi NIRS-PLS &amp; verifikasi blockchain.</p>
          </div>

          {/* Badge Logo & Kemitraan Pemasta */}
          <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm hover:border-secondary-fixed/30 hover:bg-white/[0.08] transition-all">
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-secondary-fixed block tracking-wider leading-none mb-1">
                Supported & Co-Developed By
              </span>
              <span className="text-[11px] font-semibold text-white block">
                Kelompok Pemasta Nilam Aceh
              </span>
            </div>
            
            {/* Divider Garis Tipis */}
            <div className="w-px h-7 bg-white/10" />

            {/* Container Logo Pemasta */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-lg p-1 shadow-sm">
              <img 
                src="/images/logo-pemasta.png" 
                alt="Logo Resmi Pemasta Nilam" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}