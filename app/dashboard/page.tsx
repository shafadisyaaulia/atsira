"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function DashboardIndexPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace(`/dashboard/${user.role}`);
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <p className="text-on-surface-variant text-sm">Mengarahkan ke dasbor Anda...</p>
    </div>
  );
}
