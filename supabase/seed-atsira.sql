-- ============================================================================
-- ATSIRA seed data based on mock/products.ts
-- Jalankan setelah schema.sql berhasil dibuat.
-- Catatan: data profile akan masuk otomatis hanya jika email user sudah ada di auth.users.
-- ============================================================================

-- 1) PROFILE / USER BASED ON AUTH USERS
insert into public.profiles (id, name, role, email, location, verified)
select id, 'Pak Syukur', 'petani', email, 'Gayo, Aceh Tengah', true
from auth.users
where email = 'syukur@atsira.id'
on conflict (email) do update
set name = excluded.name,
    role = excluded.role,
    location = excluded.location,
    verified = excluded.verified;

insert into public.profiles (id, name, role, email, location, verified)
select id, 'Khali', 'umkm', email, 'Banda Aceh', true
from auth.users
where email = 'khali@gmail.com'
on conflict (email) do update
set name = excluded.name,
    role = excluded.role,
    location = excluded.location,
    verified = excluded.verified;

insert into public.profiles (id, name, role, email, location, verified)
select id, 'Shafa', 'buyer', email, 'Jakarta', false
from auth.users
where email = 'shafa@atsira.id'
on conflict (email) do update
set name = excluded.name,
    role = excluded.role,
    location = excluded.location,
    verified = excluded.verified;

-- 2) FARMERS
insert into public.farmers (id, user_id, name, location, region, gps_lat, gps_lng, farm_size_ha, eco_badge, quote)
values (
  '11111111-1111-4111-8111-111111111111',
  (select id from public.profiles where email = 'syukur@atsira.id'),
  'Pak Syukur',
  'Desa Bener Meriah, Gayo',
  'Gayo',
  4.7283,
  96.8917,
  1.4,
  true,
  'Nyaman, bersih, dan konsisten — itulah yang kami cari dari hasil nilam kami.'
)
on conflict (id) do nothing;

insert into public.farmers (id, user_id, name, location, region, gps_lat, gps_lng, farm_size_ha, eco_badge, quote)
values (
  '11111111-1111-4111-8111-111111111112',
  (select id from public.profiles where email = 'shafa@atsira.id'),
  'Petani Aceh Barat',
  'Aceh Barat',
  'Aceh Barat',
  4.4209,
  96.1182,
  1.2,
  false,
  'Budidaya nilam demi kualitas dan komitmen jangka panjang.'
)
on conflict (id) do nothing;

-- 3) DISTRILLERIES
insert into public.distilleries (id, name, location, method, duration_hours, rendemen_percent, farmer_id, usk_verified)
values
(
  '22222222-2222-4222-8222-222222222221',
  'Penyulingan Gayo Lestari',
  'Gayo, Aceh Tengah',
  'Penyulingan Uap',
  8,
  2.8,
  (select id from public.farmers where name = 'Pak Syukur'),
  true
),
(
  '22222222-2222-4222-8222-222222222222',
  'Koperasi Aceh Barat',
  'Aceh Barat',
  'Penyulingan Uap',
  7,
  2.5,
  (select id from public.farmers where name = 'Petani Aceh Barat'),
  true
)
on conflict (id) do nothing;

-- 4) UMKM STORES
insert into public.umkm_stores (id, user_id, name, owner_name, location, bio, halal_certified, bpom_certified)
values (
  '33333333-3333-4333-8333-333333333333',
  (select id from public.profiles where email = 'khali@gmail.com'),
  'Seulawah Atelier',
  'Cut Maharani',
  'Banda Aceh',
  'UMKM parfum lokal berbasis nilam Aceh dengan fokus kualitas, traceability, dan pengalaman premium.',
  true,
  true
)
on conflict (id) do nothing;

insert into public.umkm_stores (id, user_id, name, owner_name, location, bio, halal_certified, bpom_certified)
values (
  '33333333-3333-4333-8333-333333333334',
  null,
  'Aceh Scent',
  'Mitra Lokal',
  'Banda Aceh',
  'Produk aromaterapi dan natural wellness dari minyak nilam Aceh.',
  true,
  false
)
on conflict (id) do nothing;

-- 5) COA RECORDS
insert into public.coa_records (id, pa_level, acid_number, density, color, viscosity, method, confidence_score, analyzed_at)
values
(
  '44444444-4444-4444-8444-444444444444',
  34.2,
  3.48,
  0.956,
  'Coklat Muda',
  'Sedang',
  'NIRS-PLS AI',
  96.3,
  '2026-04-08T09:15:00+07:00'
),
(
  '44444444-4444-4444-8444-444444444445',
  31.6,
  4.10,
  0.949,
  'Coklat Tua',
  'Tinggi',
  'GC-MS Lab (ARC-USK)',
  92.0,
  '2026-04-02T14:30:00+07:00'
),
(
  '44444444-4444-4444-8444-444444444446',
  28.9,
  5.20,
  0.982,
  'Coklat Tua',
  'Tinggi',
  'NIRS-PLS AI',
  89.4,
  '2026-03-20T11:00:00+07:00'
)
on conflict (id) do nothing;

-- 6) RAW OIL LISTINGS
insert into public.raw_oil_listings (
  id, title, farmer_id, distillery_id, region, price_per_kg, min_order_kg, stock_kg,
  coa_id, grade, sell_mode, auction_ends_at, highest_bid, image_url, description, listed_at
)
values
(
  'a1111111-1111-4111-8111-111111111111',
  'Minyak Nilam Mentah — Gayo Premium',
  (select id from public.farmers where name = 'Pak Syukur'),
  (select id from public.distilleries where name = 'Penyulingan Gayo Lestari'),
  'Gayo, Aceh Tengah',
  1250000,
  5,
  42,
  (select id from public.coa_records where pa_level = 34.2 limit 1),
  'Premium',
  'fixed',
  null,
  null,
  '/images/products/minyak nilam 1.png',
  'Minyak nilam mentah hasil sulingan uap dari kebun Gayo, dataran tinggi Aceh Tengah. Dianalisis melalui Nilam Analyzer AI dengan kadar Patchouli Alcohol 34.2%, masuk kategori Premium sesuai SNI 06-2385-2006.',
  '2026-04-08T10:00:00+07:00'
),
(
  'a1111111-1111-4111-8111-111111111112',
  'Minyak Nilam Super — Aceh Barat',
  (select id from public.farmers where name = 'Petani Aceh Barat'),
  (select id from public.distilleries where name = 'Koperasi Aceh Barat'),
  'Aceh Barat',
  1180000,
  10,
  65,
  (select id from public.coa_records where pa_level = 31.6 limit 1),
  'Standard',
  'fixed',
  null,
  null,
  '/images/products/minyak nilam.png',
  'Minyak nilam dari Koperasi Aceh Barat, telah diverifikasi langsung oleh laboratorium ARC-USK. Cocok untuk kebutuhan parfum kelas menengah-atas dengan rendemen tinggi.',
  '2026-04-02T15:00:00+07:00'
),
(
  'a1111111-1111-4111-8111-111111111113',
  'Vetiver (Akar Wangi) — Banda Aceh',
  (select id from public.farmers where name = 'Petani Aceh Barat'),
  (select id from public.distilleries where name = 'Koperasi Aceh Barat'),
  'Banda Aceh',
  2450000,
  2,
  18,
  (select id from public.coa_records where pa_level = 28.9 limit 1),
  'Standard',
  'auction',
  '2026-07-05T23:59:00+07:00',
  2380000,
  '/images/products/minyak nilam 2.png',
  'Akar wangi premium dengan profil aroma woody-earthy yang khas, diburu oleh rumah parfum internasional untuk base note mewah.',
  '2026-03-20T11:30:00+07:00'
)
on conflict (id) do nothing;

-- 7) FINISHED PRODUCTS
insert into public.finished_products (
  id, title, category, umkm_id, price, unit, stock, rating, review_count,
  image_url, gallery, description, notes_top, notes_middle, notes_base,
  sourced_from_raw_oil_id, coa_id, qr_batch_id
)
values
(
  'b1111111-1111-4111-8111-111111111111',
  'Parfum Eksklusif ATSIRA - Eau De Parfum',
  'Parfum',
  (select id from public.umkm_stores where name = 'Seulawah Atelier'),
  350000,
  'pcs',
  24,
  4.9,
  142,
  '/images/products/parfume1.png',
  ARRAY['/images/products/parfume1.png'],
  'Eau de Parfum unisex dengan jantung wangi nilam Gayo otentik berkadar PA 34,2%. Dipadukan dengan bergamot dan kayu cendana untuk profil hangat-earthy yang tahan lama. Setiap botol membawa kisah dari kebun Pak Syukur di Gayo hingga ke tangan Anda.',
  ARRAY['Bergamot', 'Lada Pink'],
  ARRAY['Nilam Gayo', 'Mawar Kering'],
  ARRAY['Kayu Cendana', 'Amber', 'Musk'],
  (select id from public.raw_oil_listings where title = 'Minyak Nilam Mentah — Gayo Premium'),
  (select id from public.coa_records where pa_level = 34.2 limit 1),
  'ATR-2024-NLM'
),
(
  'b1111111-1111-4111-8111-111111111112',
  'Parfum Pria Maskulin Nilam Wood',
  'Parfum',
  (select id from public.umkm_stores where name = 'Seulawah Atelier'),
  290000,
  'pcs',
  31,
  4.8,
  58,
  '/images/products/parfume2.png',
  ARRAY['/images/products/parfume2.png'],
  'Profil woody-musky pekat untuk pemakaian malam, dengan basis nilam Aceh Barat grade Standard.',
  ARRAY['Cengkeh'],
  ARRAY['Nilam'],
  ARRAY['Musk', 'Kayu Gaharu'],
  (select id from public.raw_oil_listings where title = 'Minyak Nilam Super — Aceh Barat'),
  (select id from public.coa_records where pa_level = 31.6 limit 1),
  'ATR-2024-GWM'
),
(
  'b1111111-1111-4111-8111-111111111113',
  'Paket Set Diffuser Ruangan Mewah',
  'Diffuser',
  (select id from public.umkm_stores where name = 'Seulawah Atelier'),
  420000,
  'set',
  15,
  4.9,
  88,
  '/images/products/diffuser set.png',
  ARRAY['/images/products/diffuser set.png'],
  'Reed diffuser keramik buatan tangan dengan minyak esensial nilam Gayo, cocok untuk ruang kerja maupun kamar tidur.',
  ARRAY['Nilam'],
  ARRAY['Cedar'],
  ARRAY['Vanila'],
  (select id from public.raw_oil_listings where title = 'Minyak Nilam Mentah — Gayo Premium'),
  (select id from public.coa_records where pa_level = 34.2 limit 1),
  'ATR-2024-DIF'
),
(
  'b1111111-1111-4111-8111-111111111114',
  'Sabun Herbal Organik Ekstrak Nilam',
  'Sabun Nilam',
  (select id from public.umkm_stores where name = 'Aceh Scent'),
  35000,
  'bar',
  120,
  4.7,
  210,
  '/images/products/soap.png',
  ARRAY['/images/products/soap.png'],
  'Sabun batang dengan campuran minyak nilam Aceh Jaya dan minyak kelapa organik, lembut untuk kulit sensitif.',
  ARRAY['Citrus'],
  ARRAY['Nilam'],
  ARRAY['Kelapa'],
  (select id from public.raw_oil_listings where title = 'Vetiver (Akar Wangi) — Banda Aceh'),
  (select id from public.coa_records where pa_level = 28.9 limit 1),
  'ATR-2024-SBN'
)
on conflict (id) do nothing;

-- 8) BADGES
insert into public.product_badges (id, product_id, product_type, badge)
values
  (gen_random_uuid(), (select id from public.raw_oil_listings where title = 'Minyak Nilam Mentah — Gayo Premium'), 'raw-oil', 'AI Verified'),
  (gen_random_uuid(), (select id from public.raw_oil_listings where title = 'Minyak Nilam Mentah — Gayo Premium'), 'raw-oil', 'Eco Badge'),
  (gen_random_uuid(), (select id from public.raw_oil_listings where title = 'Minyak Nilam Super — Aceh Barat'), 'raw-oil', 'USK Verified'),
  (gen_random_uuid(), (select id from public.raw_oil_listings where title = 'Minyak Nilam Super — Aceh Barat'), 'raw-oil', 'Eco Badge'),
  (gen_random_uuid(), (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'), 'finished-product', 'AI Verified'),
  (gen_random_uuid(), (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'), 'finished-product', 'Halal Ready'),
  (gen_random_uuid(), (select id from public.finished_products where title = 'Paket Set Diffuser Ruangan Mewah'), 'finished-product', 'Eco Badge'),
  (gen_random_uuid(), (select id from public.finished_products where title = 'Sabun Herbal Organik Ekstrak Nilam'), 'finished-product', 'Halal Ready')
on conflict do nothing;

-- 9) TRACEABILITY STAGES
insert into public.traceability_stages (id, product_id, stage, title, description, stage_date, location, gps_lat, gps_lng, meta, verified, sort_order)
values
  (
    gen_random_uuid(),
    (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'),
    'Kebun',
    'Panen di Kebun Bener Meriah',
    'Daun nilam dipanen dari lahan 1,4 hektar milik Pak Syukur, varietas Pogostemon cablin, ditanam Januari 2024.',
    '2026-08-01',
    'Desa Bangerango, Gayo — Elevasi 1.200m',
    4.7283,
    96.8917,
    '{"Luas Lahan": "1,4 Ha", "Varietas": "Pogostemon Cablin"}'::jsonb,
    true,
    1
  ),
  (
    gen_random_uuid(),
    (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'),
    'Penyulingan',
    'Distilasi Uap 8 Jam',
    'Daun disuling menggunakan metode uap tekanan rendah selama 8 jam oleh Penyulingan Gayo Lestari, menghasilkan rendemen 2,8%.',
    '2026-08-12',
    'Penyulingan Gayo Lestari',
    null,
    null,
    '{"Metode": "Steam Distillation", "Durasi": "8 jam", "Rendemen": "2,8%"}'::jsonb,
    true,
    2
  ),
  (
    gen_random_uuid(),
    (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'),
    'Pengujian',
    'Analisis Kadar PA — AI Verified',
    'Nilam Analyzer AI menganalisis sampel dan menghasilkan estimasi kadar Patchouli Alcohol 34,2%, masuk grade Premium.',
    '2026-08-13',
    null,
    null,
    null,
    '{"Kadar PA": "34,2%", "Grade": "Premium", "Metode": "NIRS-PLS AI"}'::jsonb,
    true,
    3
  ),
  (
    gen_random_uuid(),
    (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'),
    'Distribusi',
    'Pengiriman ke UMKM Mitra',
    'Minyak mentah dikirim ke Toko Parfum UMKM Seulawah di Banda Aceh untuk diproses menjadi parfum jadi.',
    '2026-08-20',
    'Pusat Logistik Aceh',
    null,
    null,
    null,
    true,
    4
  ),
  (
    gen_random_uuid(),
    (select id from public.finished_products where title = 'Parfum Eksklusif ATSIRA - Eau De Parfum'),
    'Botol',
    'Diformulasi & Dikemas',
    'Minyak diformulasikan dengan konsentrasi 18% menjadi Eau de Parfum "Seulawah Elixir" dan dikemas dengan QR traceability.',
    '2026-09-02',
    'Toko Parfum UMKM Seulawah',
    null,
    null,
    null,
    true,
    5
  )
on conflict do nothing;

-- 10) PRICE TICKS
insert into public.price_ticks (id, tick_date, premium, standard, economy)
values
  (gen_random_uuid(), '2026-04-08', 1250000, 1180000, 980000),
  (gen_random_uuid(), '2026-04-09', 1275000, 1190000, 1000000),
  (gen_random_uuid(), '2026-04-10', 1300000, 1205000, 1015000)
on conflict do nothing;

-- 11) OPTIONAL: PRICE ALERTS example
insert into public.price_alerts (id, user_id, grade, region, threshold_price, direction, active)
values
  (gen_random_uuid(), (select id from public.profiles where email = 'shafa@atsira.id'), 'Premium', 'Gayo', 1200000, 'above', true)
on conflict do nothing;

-- ============================================================================
-- Catatan:
-- Jika email di auth.users belum dibuat, semua insert yang mengandalkan select
-- dari auth.users akan di-skip. Buat user lewat Supabase Auth dulu lalu jalankan seed lagi.
-- ============================================================================
