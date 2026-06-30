import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6 text-center">
      <Leaf className="w-10 h-10 text-clay-earth mb-5" />
      <h1 className="font-display text-headline-lg-mobile text-primary mb-3">Halaman Tidak Ditemukan</h1>
      <p className="text-on-surface-variant max-w-md mb-8">
        Sepertinya halaman yang Anda cari sudah berpindah lokasi, seperti daun nilam yang tertiup angin.
      </p>
      <div className="flex gap-3">
        <Button href="/">Kembali ke Beranda</Button>
        <Button href="/marketplace" variant="secondary">
          Jelajahi Pasar
        </Button>
      </div>
    </div>
  );
}
