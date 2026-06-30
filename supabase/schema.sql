-- ============================================================================
-- ATSIRA — Supabase Schema (Fase 2)
-- Jalankan di Supabase SQL Editor. Skema ini 1:1 dengan lib/types/index.ts
-- supaya transisi dari mock data ke database asli minim friksi.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------- USERS (extends auth.users) ----------
create type user_role as enum ('petani', 'umkm', 'buyer', 'peneliti');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role user_role not null,
  email text not null,
  avatar_url text,
  location text,
  verified boolean default false,
  joined_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ---------- FARMERS & DISTILLERIES ----------
create type farm_region as enum ('Gayo', 'Bener Meriah', 'Aceh Barat', 'Aceh Jaya', 'Aceh Selatan');

create table farmers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  name text not null,
  location text not null,
  region farm_region not null,
  gps_lat double precision,
  gps_lng double precision,
  farm_size_ha numeric,
  eco_badge boolean default false,
  avatar_url text,
  quote text,
  created_at timestamptz default now()
);

create table distilleries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null,
  method text not null,
  duration_hours numeric,
  rendemen_percent numeric,
  farmer_id uuid references farmers(id),
  usk_verified boolean default false
);

-- ---------- UMKM STORES ----------
create table umkm_stores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  name text not null,
  owner_name text not null,
  location text,
  logo_url text,
  bio text,
  halal_certified boolean default false,
  bpom_certified boolean default false,
  created_at timestamptz default now()
);

-- ---------- COA (Certificate of Analysis) ----------
create type quality_grade as enum ('Premium', 'Standard', 'Economy', 'Reject');

create table coa_records (
  id uuid primary key default uuid_generate_v4(),
  pa_level numeric not null,
  acid_number numeric,
  density numeric,
  color text,
  viscosity text,
  method text not null, -- 'NIRS-PLS AI' | 'GC-MS Lab (ARC-USK)'
  confidence_score numeric,
  analyzed_at timestamptz default now()
);

-- ---------- PRODUCTS (raw oil + finished products) ----------
create table raw_oil_listings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  farmer_id uuid references farmers(id),
  distillery_id uuid references distilleries(id),
  region text,
  price_per_kg numeric not null,
  min_order_kg numeric default 1,
  stock_kg numeric default 0,
  coa_id uuid references coa_records(id),
  grade quality_grade,
  sell_mode text default 'fixed', -- 'fixed' | 'auction'
  auction_ends_at timestamptz,
  highest_bid numeric,
  image_url text,
  description text,
  listed_at timestamptz default now()
);

create table finished_products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  umkm_id uuid references umkm_stores(id),
  price numeric not null,
  unit text,
  stock numeric default 0,
  rating numeric default 0,
  review_count int default 0,
  image_url text,
  gallery text[],
  description text,
  notes_top text[],
  notes_middle text[],
  notes_base text[],
  sourced_from_raw_oil_id uuid references raw_oil_listings(id),
  coa_id uuid references coa_records(id),
  qr_batch_id text unique
);

create table product_badges (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null,
  product_type text not null, -- 'raw-oil' | 'finished-product'
  badge text not null -- 'AI Verified' | 'USK Verified' | 'Eco Badge' | 'Halal Ready'
);

-- ---------- TRACEABILITY ----------
create table traceability_stages (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null,
  stage text not null, -- 'Kebun' | 'Penyulingan' | 'Pengujian' | 'Distribusi' | 'Botol'
  title text not null,
  description text,
  stage_date date,
  location text,
  gps_lat double precision,
  gps_lng double precision,
  meta jsonb,
  verified boolean default true,
  sort_order int default 0
);

-- ---------- PRICE HISTORY ----------
create table price_ticks (
  id uuid primary key default uuid_generate_v4(),
  tick_date date not null,
  premium numeric not null,
  standard numeric not null,
  economy numeric not null
);

create table price_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  grade quality_grade not null,
  region text,
  threshold_price numeric not null,
  direction text default 'above', -- 'above' | 'below'
  active boolean default true,
  created_at timestamptz default now()
);

-- ---------- ORDERS ----------
create table orders (
  id text primary key, -- e.g. "ATR-8891"
  buyer_id uuid references profiles(id),
  seller_id uuid,
  order_type text not null, -- 'B2B' | 'B2C' | 'C2C'
  subtotal numeric not null,
  shipping_fee numeric default 0,
  tax numeric default 0,
  total numeric not null,
  status text default 'Menunggu Pembayaran',
  escrow_status text default 'Ditahan',
  payment_method text,
  courier text,
  tracking_number text,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id text references orders(id) on delete cascade,
  product_id uuid not null,
  title text not null,
  qty numeric not null,
  unit text,
  price numeric not null
);

alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- ---------- MAGAZINE ----------
create table magazine_articles (
  slug text primary key,
  title text not null,
  category text not null,
  excerpt text,
  content text[],
  author text,
  author_role text,
  published_at date default now(),
  read_minutes int default 5,
  image_url text,
  featured boolean default false
);

-- ---------- VERIFICATION QUEUE (Peneliti) ----------
create table verification_queue (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmers(id),
  region text,
  submitted_at timestamptz default now(),
  ai_pa_level numeric,
  ai_grade quality_grade,
  status text default 'Menunggu', -- 'Menunggu' | 'Dalam Proses' | 'Lulus' | 'Ditolak'
  sample_image_url text
);

-- ---------- IMPACT METRICS (cached aggregates, refreshed via cron/trigger) ----------
create table impact_metrics_snapshot (
  id uuid primary key default uuid_generate_v4(),
  total_oil_traded_kg numeric,
  total_farmers int,
  total_transaction_value numeric,
  co2_prevented_ton numeric,
  umkm_upgraded int,
  cities_served int,
  snapshot_at timestamptz default now()
);

-- ============================================================================
-- Catatan migrasi:
-- 1. Setelah tabel dibuat, isi data awal dari lib/mock/*.ts secara manual atau
--    via seed script (bisa generate INSERT statements dari mock data yang sama).
-- 2. Ganti semua import dari "@/lib/mock" menjadi query Supabase di Server
--    Components (misal: const { data } = await supabase.from('raw_oil_listings').select()).
-- 3. RLS policies di atas baru contoh dasar — sesuaikan untuk tiap tabel sesuai
--    kebutuhan privasi per role sebelum production.
-- ============================================================================
