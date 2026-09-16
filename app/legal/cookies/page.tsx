import { PageShell } from "@/components/layout/PageShell";

export default function CookiesPage() {
  return (
    <PageShell>
      <div className="container-app py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-primary mb-8">Kebijakan Cookie</h1>
        <div className="prose text-on-surface-variant space-y-4">
          <p>Terakhir diperbarui: 14 September 2026</p>
          <p>Kami menggunakan cookies untuk meningkatkan pengalaman Anda di ATSIRA...</p>
        </div>
      </div>
    </PageShell>
  );
}