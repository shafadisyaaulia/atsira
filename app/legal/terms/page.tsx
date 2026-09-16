import { PageShell } from "@/components/layout/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="container-app py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-primary mb-8">Ketentuan Layanan</h1>
        <div className="prose text-on-surface-variant space-y-4">
          <p>Terakhir diperbarui: 14 September 2026</p>
          <p>Selamat datang di ATSIRA. Dengan menggunakan platform kami, Anda setuju untuk mematuhi ketentuan berikut...</p>
          <h2 className="text-xl font-bold text-primary mt-6">1. Penggunaan Platform</h2>
          <p>Anda bertanggung jawab atas penggunaan akun Anda...</p>
        </div>
      </div>
    </PageShell>
  );
}