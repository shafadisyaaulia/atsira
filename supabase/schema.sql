-- ============================================================================
-- ATSIRA — Supabase Schema
-- Disesuaikan dengan struktur project ATSIRA saat ini:
-- marketplace, auth, produk nilam, traceability, checkout, AI analyzer, chatbot.
-- Jalankan ini di Supabase SQL Editor.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------- ENUMS ----------
create type user_role as enum (
  'petani',
  'umkm',
  'buyer',
  'peneliti',
  'seller',
  'pemasta',
  'arc'
);

create type quality_grade as enum ('Premium', 'Standard', 'Economy', 'Reject');
create type product_type as enum ('raw-oil', 'finished-product');
create type order_status as enum (
  'Menunggu Pembayaran',
  'Diproses',
  'Dikirim',
  'Diterima',
  'Selesai',
  'Dibatalkan'
);
create type escrow_status as enum ('Ditahan', 'Dicairkan', 'Dikembalikan');
create type farm_region as enum ('Gayo', 'Bener Meriah', 'Aceh Barat', 'Aceh Jaya', 'Aceh Selatan');

-- ---------- USERS / PROFILES ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role user_role not null default 'buyer',
  email text not null unique,
  avatar_url text,
  location text,
  bio text,
  verified boolean not null default false,
  joined_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles visible to everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------- FARMERS ----------
create table public.farmers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  location text not null,
  region farm_region not null,
  gps_lat double precision,
  gps_lng double precision,
  farm_size_ha numeric(10,2),
  eco_badge boolean not null default false,
  avatar_url text,
  quote text,
  created_at timestamptz not null default now()
);

create table public.distilleries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null,
  method text not null,
  duration_hours numeric(5,2),
  rendemen_percent numeric(5,2),
  farmer_id uuid references public.farmers(id) on delete set null,
  usk_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- UMKM ----------
create table public.umkm_stores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  owner_name text not null,
  location text,
  logo_url text,
  bio text,
  halal_certified boolean not null default false,
  bpom_certified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- COA / ANALYSIS ----------
create table public.coa_records (
  id uuid primary key default uuid_generate_v4(),
  pa_level numeric(5,2) not null,
  acid_number numeric(6,2),
  density numeric(6,3),
  color text,
  viscosity text,
  method text not null,
  confidence_score numeric(5,2),
  analyzed_at timestamptz not null default now()
);

-- ---------- PRODUCTS ----------
create table public.raw_oil_listings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  farmer_id uuid references public.farmers(id) on delete set null,
  distillery_id uuid references public.distilleries(id) on delete set null,
  region text,
  price_per_kg numeric(12,2) not null,
  min_order_kg numeric(10,2) not null default 1,
  stock_kg numeric(12,2) not null default 0,
  coa_id uuid references public.coa_records(id) on delete set null,
  grade quality_grade,
  sell_mode text not null default 'fixed',
  auction_ends_at timestamptz,
  highest_bid numeric(12,2),
  image_url text,
  description text,
  listed_at timestamptz not null default now()
);

create table public.finished_products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  umkm_id uuid references public.umkm_stores(id) on delete set null,
  price numeric(12,2) not null,
  unit text,
  stock numeric(12,2) not null default 0,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  image_url text,
  gallery text[],
  description text,
  notes_top text[],
  notes_middle text[],
  notes_base text[],
  sourced_from_raw_oil_id uuid references public.raw_oil_listings(id) on delete set null,
  coa_id uuid references public.coa_records(id) on delete set null,
  qr_batch_id text unique,
  created_at timestamptz not null default now()
);

create table public.product_badges (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null,
  product_type product_type not null,
  badge text not null,
  created_at timestamptz not null default now()
);

create index idx_product_badges_product
  on public.product_badges(product_id, product_type);

-- ---------- TRACEABILITY ----------
create table public.traceability_stages (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null,
  stage text not null,
  title text not null,
  description text,
  stage_date date,
  location text,
  gps_lat double precision,
  gps_lng double precision,
  meta jsonb,
  verified boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_traceability_product
  on public.traceability_stages(product_id, sort_order);

-- ---------- PRICE DATA ----------
create table public.price_ticks (
  id uuid primary key default uuid_generate_v4(),
  tick_date date not null,
  premium numeric(12,2) not null,
  standard numeric(12,2) not null,
  economy numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table public.price_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  grade quality_grade not null,
  region text,
  threshold_price numeric(12,2) not null,
  direction text not null default 'above',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- ORDERS ----------
create table public.orders (
  id text primary key,
  buyer_id uuid references public.profiles(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,
  buyer_name text,
  order_type text not null default 'B2C',
  subtotal numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status order_status not null default 'Menunggu Pembayaran',
  escrow_status escrow_status not null default 'Ditahan',
  payment_method text,
  payment_session_id text,
  payment_intent_id text,
  payment_status text default 'pending',
  courier text,
  tracking_number text,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id uuid not null,
  title text not null,
  qty numeric(12,2) not null default 1,
  unit text,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Users can view their own orders"
  on public.orders for select
  using (
    auth.uid() = buyer_id
    or auth.uid() = seller_id
  );

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = buyer_id or buyer_id is null);

create policy "Users can update their own orders"
  on public.orders for update
  using (
    auth.uid() = buyer_id
    or auth.uid() = seller_id
  );

-- ---------- MAGAZINE ----------
create table public.magazine_articles (
  slug text primary key,
  title text not null,
  category text not null,
  excerpt text,
  content text[],
  author text,
  author_role text,
  published_at date not null default current_date,
  read_minutes integer not null default 5,
  image_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- VERIFICATION QUEUE ----------
create table public.verification_queue (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references public.farmers(id) on delete set null,
  region text,
  submitted_at timestamptz not null default now(),
  ai_pa_level numeric(5,2),
  ai_grade quality_grade,
  status text not null default 'Menunggu',
  sample_image_url text,
  created_at timestamptz not null default now()
);

-- ---------- IMPACT METRICS ----------
create table public.impact_metrics_snapshot (
  id uuid primary key default uuid_generate_v4(),
  total_oil_traded_kg numeric(14,2),
  total_farmers integer,
  total_transaction_value numeric(16,2),
  co2_prevented_ton numeric(10,2),
  umkm_upgraded integer,
  cities_served integer,
  snapshot_at timestamptz not null default now()
);

-- ---------- INDEXES ----------
create index idx_raw_oil_listings_region
  on public.raw_oil_listings(region, grade);

create index idx_raw_oil_listings_price
  on public.raw_oil_listings(price_per_kg);

create index idx_finished_products_category
  on public.finished_products(category, price);

create index idx_orders_buyer
  on public.orders(buyer_id, created_at desc);

create index idx_orders_status
  on public.orders(status);

create index idx_price_ticks_date
  on public.price_ticks(tick_date desc);

-- ---------- AUTO CREATE PROFILE ON SIGNUP ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, email, verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'buyer',
    new.email,
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- SAMPLE DATA SEEDING ----------
-- Catatan: data sample ini baru bisa dipakai setelah user sudah dibuat di Auth.
-- Jika ingin seed langsung, pastikan ID berikut cocok dengan auth.users yang sudah ada.

-- Contoh: user petani
-- insert into public.profiles (id, name, role, email, location, verified)
-- values (
--   '11111111-1111-1111-1111-111111111111',
--   'Pak Syukur',
--   'petani',
--   'syukur@atsira.id',
--   'Gayo, Aceh Tengah',
--   true
-- )
-- on conflict (id) do nothing;

-- insert into public.farmers (id, user_id, name, location, region, gps_lat, gps_lng, farm_size_ha, eco_badge, quote)
-- values (
--   '22222222-2222-2222-2222-222222222222',
--   '11111111-1111-1111-1111-111111111111',
--   'Pak Syukur',
--   'Desa Bener Meriah, Gayo',
--   'Gayo',
--   4.7283,
--   96.8917,
--   1.4,
--   true,
--   'Nyaman, bersih, dan konsisten — itulah yang kami cari dari hasil nilam kami.'
-- )
-- on conflict (id) do nothing;

-- Contoh: user UMKM
-- insert into public.profiles (id, name, role, email, location, verified)
-- values (
--   '33333333-3333-3333-3333-333333333333',
--   'Cut Maharani',
--   'umkm',
--   'maharani@seulawah.id',
--   'Banda Aceh',
--   true
-- )
-- on conflict (id) do nothing;

-- insert into public.umkm_stores (id, user_id, name, owner_name, location, bio, halal_certified, bpom_certified)
-- values (
--   '44444444-4444-4444-4444-444444444444',
--   '33333333-3333-3333-3333-333333333333',
--   'Seulawah Atelier',
--   'Cut Maharani',
--   'Banda Aceh',
--   'UMKM parfum lokal berbasis nilam Aceh dengan fokus kualitas, traceability, dan pengalaman premium.',
--   true,
--   true
-- )
-- on conflict (id) do nothing;

-- Contoh: buyer
-- insert into public.profiles (id, name, role, email, location, verified)
-- values (
--   '55555555-5555-5555-5555-555555555555',
--   'Budi Santoso',
--   'buyer',
--   'budi@example.com',
--   'Jakarta',
--   false
-- )
-- on conflict (id) do nothing;

-- ============================================================================
-- Catatan penting:
-- 1. Trigger di atas akan otomatis membuat row di public.profiles saat user baru
--    dibuat di Supabase Auth.
-- 2. Untuk data awal seperti petani dan UMKM, tetap perlu insert manual ID yang
--    valid dari auth.users yang sudah dibuat.
-- 3. Untuk API AI dan payment, biasanya endpoint di app/api/* akan membaca tabel-tabel ini.
-- ============================================================================

-- 1. Setelah tabel dibuat, isi data awal dari lib/mock/*.ts secara manual atau
--    via seed script (bisa generate INSERT statements dari mock data yang sama).
-- 2. Ganti semua import dari "@/lib/mock" menjadi query Supabase di Server
--    Components (misal: const { data } = await supabase.from('raw_oil_listings').select()).
-- 3. RLS policies di atas baru contoh dasar — sesuaikan untuk tiap tabel sesuai
--    kebutuhan privasi per role sebelum production.
-- ============================================================================
