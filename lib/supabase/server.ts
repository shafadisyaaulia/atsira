import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * FASE 2 — Supabase client untuk Server Components / Route Handlers.
 * Dipakai di app/api/* atau Server Components yang butuh akses langsung
 * ke database dengan Row Level Security berdasarkan sesi pengguna.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Dipanggil dari Server Component — bisa diabaikan jika ada middleware yang refresh session.
          }
        },
      },
    }
  );
}
