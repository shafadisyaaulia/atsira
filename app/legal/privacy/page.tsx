import { PageShell } from "@/components/layout/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="container-app py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-primary mb-8">Kebijakan Privasi</h1>
        <div className="prose text-on-surface-variant space-y-4">
          <p>Terakhir diperbarui: 14 September 2026</p>
          <p>Privasi Anda adalah prioritas kami. atSira mengumpulkan informasi untuk meningkatkan layanan...</p>
          <h2 className="text-xl font-bold text-primary mt-6">1. Data yang Dikumpulkan</h2>
          <p>Kami mengumpulkan data yang Anda berikan saat pendaftaran...</p>
        </div>
      </div>
    </PageShell>
  );
}