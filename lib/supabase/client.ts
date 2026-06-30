import { createBrowserClient } from "@supabase/ssr";

/**
 * FASE 2 — Supabase client untuk komponen client-side ("use client").
 * Pastikan env vars NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY
 * sudah diisi di .env.local sebelum mengimpor ini di komponen manapun.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
