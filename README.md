# ATSIRA — Digital Fragrance Ecosystem

Platform ekosistem digital nilam Aceh: menghubungkan petani, penyuling, peneliti ARC-USK, UMKM parfum, dan konsumen dalam satu rantai nilai yang transparan dan terverifikasi.

Dibangun dengan **Next.js 15 (App Router) + TypeScript + Tailwind CSS**, mengikuti design system "Modern Heritage" (`DESIGN.md`).

---

## 🚀 Cara Menjalankan (Fase 1 — Mock Data)

Project ini sudah berjalan penuh dengan **mock data** — tidak perlu setup database atau API key apapun untuk mencoba semua halaman dan flow.

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

> Jika `npm install` gagal karena versi React 19 belum cocok dengan suatu package, jalankan dengan flag: `npm install --legacy-peer-deps`

### Login demo (tanpa registrasi)
Buka `/login`, klik salah satu kartu peran (Petani, UMKM, Buyer, Peneliti) → langsung diarahkan ke dasbor masing-masing. Sesi disimpan di `localStorage` via Zustand, jadi akan tetap login setelah refresh.

---

## 🗺️ Peta Halaman Lengkap

| Kategori | Rute | Keterangan |
|---|---|---|
| Publik | `/` | Landing page |
| Publik | `/marketplace` | Hub pasar (B2B + B2C) |
| Publik | `/marketplace/[id]` | Detail produk + traceability |
| Publik | `/marketplace/analyzer` | Nilam Analyzer AI (preview publik) |
| Publik | `/price-dashboard` | Intelijen harga + kalkulator profitabilitas |
| Publik | `/traceability` | Lacak produk via Batch ID |
| Publik | `/magazine` | Hub artikel & dokumentasi |
| Publik | `/magazine/[slug]` | Detail artikel |
| Publik | `/tracker` | Impact Tracker |
| Auth | `/login` | Pilih peran → masuk dasbor |
| Auth | `/register` | Registrasi akun baru |
| Transaksi | `/cart` | Keranjang belanja |
| Transaksi | `/checkout` | Pembayaran + escrow |
| Transaksi | `/checkout/success` | Konfirmasi pesanan |
| Dasbor | `/dashboard` | Redirect otomatis sesuai peran |
| Dasbor | `/dashboard/petani` | Finansial, Analyzer AI, Kebun, Price Alert |
| Dasbor | `/dashboard/umkm` | Analytics toko, Sourcing B2B, Produk, QR |
| Dasbor | `/dashboard/buyer` | Lacak pesanan, Wallet, Favorit |
| Dasbor | `/dashboard/peneliti` | Antrean verifikasi, Riset, Kreator konten |

Floating **AtBot widget** (maskot 'Nila') tersedia di semua halaman.

---

## 🧱 Struktur Project

```
app/                  → Routes (App Router)
components/
  ui/                 → Button, Card, Input, Badge (design system primitives)
  layout/             → Navbar, Footer, PageShell, DashboardShell
  shared/              → AtBotWidget, ProductDetailClient
lib/
  types/              → TypeScript interfaces (calon schema Supabase)
  mock/                → Data hardcoded dengan "rantai data terkunci"
  analyzer.ts          → Logic Nilam Analyzer (mock → ganti ke Gemini di Fase 2)
  store.ts             → Zustand (auth session + cart)
  supabase/             → Client setup, siap pakai saat Fase 2
supabase/schema.sql     → SQL schema lengkap untuk migrasi ke database asli
```

### Rantai Data Terkunci (Locked Demo Flow)
Untuk presentasi yang matang ke juri, satu cerita dikunci konsisten di seluruh platform:
**Pak Syukur (Gayo) → Distilasi Uap 8 jam → Nilam Analyzer AI → PA 34,2% (Premium) → dijual ke UMKM Seulawah → jadi "Seulawah Elixir" → traceability lengkap dengan Batch ID `ATR-2024-NLM`.**

Cek `lib/mock/farmers.ts`, `lib/mock/products.ts`, dan `lib/mock/ecosystem.ts` untuk detail.

---

## 🔜 Fase 2 — Menyambungkan Database & AI Asli

### 1. Supabase (Database)
1. Daftar gratis di [supabase.com](https://supabase.com), buat project baru.
2. Buka **SQL Editor**, jalankan isi file `supabase/schema.sql`.
3. Salin `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari **Project Settings → API** ke `.env.local` (copy dari `.env.local.example`).
4. Ganti import `from "@/lib/mock"` di setiap halaman dengan query Supabase, contoh:
   ```ts
   const supabase = await createSupabaseServerClient();
   const { data: listings } = await supabase.from("raw_oil_listings").select("*");
   ```

### 2. Google Gemini (Nilam Analyzer AI — Vision)
1. Dapatkan API key gratis di [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Isi `GEMINI_API_KEY` di `.env.local`.
3. Buat route handler `app/api/analyzer/route.ts` yang menerima foto (base64) + form data, panggil Gemini Vision, dan kembalikan JSON terstruktur (lihat komentar TODO di `lib/analyzer.ts`).
4. Ganti isi function `runNilamAnalyzer()` di `lib/analyzer.ts` agar memanggil endpoint tersebut via `fetch("/api/analyzer")`.

### 3. Groq (AtBot — Chat Assistant)
1. Dapatkan API key gratis di [console.groq.com/keys](https://console.groq.com/keys).
2. Isi `GROQ_API_KEY` di `.env.local`.
3. Buat route handler `app/api/chat/route.ts` menggunakan `groq-sdk` dengan system prompt berkonteks nilam Aceh.
4. Ganti function `getCannedResponse()` di `components/shared/AtBotWidget.tsx` agar memanggil endpoint tersebut.

### 4. Autentikasi Asli
Ganti `lib/store.ts` (Zustand mock) dengan Supabase Auth (`supabase.auth.signUp`, `signInWithPassword`) + middleware untuk melindungi rute `/dashboard/*` berdasarkan sesi nyata, bukan local state.

---

## 🎨 Design System

Lihat `DESIGN.md` untuk token lengkap. Singkatnya:
- **Warna**: Patchouli Green (`primary`), Warm Bone (`surface`), Golden Oil (`secondary`), Clay Terracotta (`clay-earth` — warna aksi utama)
- **Tipografi**: Playfair Display (heading), Plus Jakarta Sans (body), JetBrains Mono (data teknis)
- **Bentuk**: radius `0.5rem` standar, pill-shape untuk button, "leaf-corner" untuk aksen brand

---

## 📦 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (persisted) |
| Charts | Recharts |
| Icons | Lucide React |
| Database (Fase 2) | Supabase (PostgreSQL + Auth + RLS) |
| AI Vision (Fase 2) | Google Gemini (free tier) |
| AI Chat (Fase 2) | Groq / Llama (free tier) |
