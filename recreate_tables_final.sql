-- DROP dan buat ulang tabel yang schema cache-nya bermasalah
DROP TABLE IF EXISTS market_price_updates CASCADE;
DROP TABLE IF EXISTS verification_queue CASCADE;

-- Buat ulang market_price_updates dengan schema lengkap
CREATE TABLE market_price_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pemasta_id UUID REFERENCES profiles(id),
    batch_id TEXT,
    region TEXT NOT NULL,
    quantity_kg NUMERIC DEFAULT 0,
    pa_level NUMERIC DEFAULT 0,
    price_per_kg NUMERIC NOT NULL,
    method TEXT DEFAULT 'Uap (Steam)',
    leaf_age TEXT DEFAULT '6 Bulan',
    status TEXT DEFAULT 'Unverified',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat ulang verification_queue dengan schema lengkap
CREATE TABLE verification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES profiles(id),
    product_title TEXT NOT NULL,
    sample_volume NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Menunggu Sampel',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
