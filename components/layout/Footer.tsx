import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Ekosistem",
    links: [
      { label: "Penganalisis AI", href: "/marketplace/analyzer" },
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
      <div className="border-t border-white/10 py-6">
        <div className="container-app flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-inverse-on-surface/50">
          <p>© 2026 ATSIRA Ecosystem. Bekerja sama dengan ARC-USK, Universitas Syiah Kuala.</p>
          <p>Ditenagai oleh teknologi NIRS-PLS &amp; verifikasi blockchain.</p>
        </div>
      </div>
    </footer>
  );
}
