-- ============================================================================
-- ATSIRA SCHEMA ADDITIONS — Role-Based Data Flows
-- Tambahan untuk PEMASTA (field data), PENELITI (quality), dan traceability real
-- ============================================================================

-- ---------- FIELD STORIES (Pemasta dokumentasi kegiatan kebun) ----------
create table if not exists public.field_stories (
  slug text primary key,
  title text not null,
  category text not null,
  excerpt text,
  content text[],
  author text,
  author_role text,
  author_user_id uuid references public.profiles(id) on delete set null,
  region farm_region,
  published_at date not null default current_date,
  read_minutes integer not null default 5,
  image_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_field_stories_author on public.field_stories(author_user_id, published_at desc);
create index if not exists idx_field_stories_featured on public.field_stories(featured, published_at desc);

-- ---------- MARKET PRICE UPDATES (Pemasta laporan harga pasar) ----------
create table if not exists public.market_price_updates (
  id uuid primary key default uuid_generate_v4(),
  batch_id text not null unique,
  region farm_region not null,
  report_date date not null,
  quantity_kg numeric(12,2) not null,
  pa_level numeric(5,2) not null,
  price_per_kg numeric(12,2) not null,
  status text not null default 'Unverified',
  method text,
  leaf_age text,
  submitted_by uuid references public.profiles(id) on delete set null,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_market_price_region on public.market_price_updates(region, report_date desc);
create index if not exists idx_market_price_submitted on public.market_price_updates(submitted_by, created_at desc);

-- ---------- QUALITY ASSESSMENTS (Peneliti riset kualitas & benchmark) ----------
create table if not exists public.quality_assessments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  excerpt text,
  content text[],
  researcher_id uuid references public.profiles(id) on delete set null,
  published_at date not null default current_date,
  read_minutes integer not null default 5,
  image_url text,
  featured boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quality_assessments_researcher on public.quality_assessments(researcher_id, published_at desc);
create index if not exists idx_quality_assessments_category on public.quality_assessments(category, published_at desc);

-- ---------- FIELD ACTIVITY LOG (Pemasta tracking kegiatan harian) ----------
create table if not exists public.field_activity_logs (
  id uuid primary key default uuid_generate_v4(),
  pemasta_id uuid references public.profiles(id) on delete cascade,
  farmer_id uuid references public.farmers(id) on delete set null,
  region farm_region,
  activity_type text not null,
  description text,
  activity_date date not null,
  location_name text,
  gps_lat double precision,
  gps_lng double precision,
  attachments text[],
  created_at timestamptz not null default now()
);

create index if not exists idx_field_activity_logs_pemasta on public.field_activity_logs(pemasta_id, activity_date desc);
create index if not exists idx_field_activity_logs_region on public.field_activity_logs(region, activity_date desc);

-- ---------- TRACEABILITY ENTRIES (Real tracking data) ----------
create table if not exists public.traceability_entries (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid,
  batch_id text,
  stage text not null,
  stage_date date not null,
  location text,
  gps_lat double precision,
  gps_lng double precision,
  description text,
  responsible_user uuid references public.profiles(id) on delete set null,
  verification_status text not null default 'pending',
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_traceability_entries_batch on public.traceability_entries(batch_id, stage_date);
create index if not exists idx_traceability_entries_product on public.traceability_entries(product_id, stage_date);

-- ============================================================================
-- Seed Data untuk Role-Based Flows
-- ============================================================================

-- Field Stories dari PEMASTA (Gantikan mock dengan data real)
insert into public.field_stories (slug, title, category, excerpt, content, author, author_role, region, published_at, read_minutes, image_url, featured)
values (
  'rembug-petani-aceh-selatan',
  'Jumpa Petani Nilam Aceh Selatan: Digitalisasi Rantai Pasok & Transparansi Harga',
  'Kegiatan Komunitas',
  'Dokumentasi nyata kegiatan rembug bersama kelompok tani di Aceh Selatan terkait harga lapangan, panen, dan transparansi rantai pasok.',
  array[
    'Tim PEMASTA turun langsung ke kebun dan membahas metode pencatatan harga pasar serta hambatan distribusi di tingkat petani.',
    'Data harga yang dikumpulkan dari lapangan kemudian diverifikasi bersama peneliti ARC untuk menentukan benchmark harga yang adil.'
  ],
  'Kelompok Suling Jaya',
  'Pemasta Node',
  'Aceh Selatan',
  current_date - interval '2 days',
  4,
  '/stories/professional_documentary_photography_of_an_atsira_team_meeting_with_acehnese.png',
  true
)
on conflict (slug) do nothing;

insert into public.field_stories (slug, title, category, excerpt, content, author, author_role, region, published_at, read_minutes, image_url, featured)
values (
  'workshop-penyulingan-aceh-jaya',
  'Workshop Optimalisasi Rendemen Suling bersama Petani Aceh Jaya',
  'Kegiatan Komunitas',
  'Pembelajaran teknis untuk memperbaiki kualitas minyak dan menjaga rendemen di area penyulingan rakyat.',
  array[
    'PEMASTA mengumpulkan data lapangan dari penyulingan rakyat untuk menilai kualitas proses dan konsistensi output.',
    'Hasilnya menjadi masukan penting untuk peneliti dalam menetapkan kadar PA dan rekomendasi harga pasar.'
  ],
  'Eko Ramadhan',
  'Technical Specialist',
  'Aceh Jaya',
  current_date - interval '5 days',
  3,
  '/stories/action_photography_of_a_workshop_optimalisasi_rendemen_suling_in_aceh_jaya._an.png',
  false
)
on conflict (slug) do nothing;

-- Market Price Updates dari PEMASTA
insert into public.market_price_updates (batch_id, region, report_date, quantity_kg, pa_level, price_per_kg, status, method, leaf_age)
values (
  'BCH-092',
  'Aceh Selatan',
  current_date - interval '1 days',
  45,
  32.4,
  1450000,
  'Terverifikasi ARC',
  'Uap (Steam Distressed)',
  '6 Bulan'
),
(
  'BCH-071',
  'Aceh Jaya',
  current_date - interval '20 days',
  50,
  30.5,
  1380000,
  'Terverifikasi AI',
  'Air & Uap (Hydro)',
  '5 Bulan'
),
(
  'BCH-118',
  'Gayo',
  current_date - interval '3 days',
  39,
  34.2,
  1580000,
  'Premium',
  'Uap Bersih',
  '7 Bulan'
)
on conflict (batch_id) do nothing;

-- Quality Assessments dari PENELITI (tabel quality_assessments dengan metadata)
insert into public.quality_assessments (title, category, excerpt, content, published_at, read_minutes, featured, metadata)
values (
  'Total Sampel Teranalisis',
  'Quality Insights',
  'Data gabungan dari PEMASTA dan validasi laboratorium ARC-USK',
  array['Data gabungan dari PEMASTA dan validasi laboratorium ARC-USK'],
  current_date,
  2,
  true,
  jsonb_build_object('value', '5.412', 'note', 'Kombinasi PEMASTA + ARC Lab')
),
(
  'Rata-rata Kadar PA Regional',
  'Quality Insights',
  'Range premium: 32–35%, standard: 28–31%, economy: <28%',
  array['Range premium: 32–35%, standard: 28–31%, economy: <28%'],
  current_date,
  2,
  false,
  jsonb_build_object('value', '31,8%', 'note', 'Premium: 32-35%, Standard: 28-31%, Economy: <28%')
),
(
  'Akurasi Model NIRS-PLS',
  'Quality Insights',
  'Prediksi kualitas terverifikasi terhadap GC-MS lab',
  array['Prediksi kualitas terverifikasi terhadap GC-MS lab'],
  current_date,
  2,
  false,
  jsonb_build_object('value', 'r = 0,93', 'note', 'Verified against GC-MS lab results')
),
(
  'Harga Wajar Rekomendasi',
  'Quality Insights',
  'Berdasarkan PA, rendemen, dan tren pasar lapangan',
  array['Berdasarkan PA, rendemen, dan tren pasar lapangan'],
  current_date,
  2,
  false,
  jsonb_build_object('value', 'Rp 1,3M–Rp 1,6M/kg', 'note', 'Based on PA, rendemen, market trends')
)
on conflict do nothing;
