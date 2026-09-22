'use client';
import { AuthProvider } from "@/lib/context/AuthContext";
import dynamic from "next/dynamic";

const AtBotWidget = dynamic(
  () => import("@/components/shared/AtBotWidget").then((m) => m.AtBotWidget),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AtBotWidget />
    </AuthProvider>
  );
}
