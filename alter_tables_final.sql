-- Tambahkan kolom yang belum ada di market_price_updates
ALTER TABLE market_price_updates ADD COLUMN IF NOT EXISTS batch_id TEXT;
ALTER TABLE market_price_updates ADD COLUMN IF NOT EXISTS quantity_kg NUMERIC DEFAULT 0;
ALTER TABLE market_price_updates ADD COLUMN IF NOT EXISTS pa_level NUMERIC DEFAULT 0;
ALTER TABLE market_price_updates ADD COLUMN IF NOT EXISTS method TEXT DEFAULT 'Uap (Steam)';
ALTER TABLE market_price_updates ADD COLUMN IF NOT EXISTS leaf_age TEXT DEFAULT '6 Bulan';
ALTER TABLE market_price_updates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Unverified';

-- Tambahkan kolom notes ke verification_queue yang sudah ada
-- (notes sudah ada di schema pertama, skip jika error)

-- Buat field_stories berdasarkan schema yang sesuai dengan API
CREATE TABLE IF NOT EXISTS field_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    content JSONB,
    author TEXT,
    author_role TEXT,
    author_user_id UUID,
    region TEXT,
    published_at DATE,
    read_minutes INTEGER DEFAULT 3,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat quality_assessments untuk ARC
CREATE TABLE IF NOT EXISTS quality_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Umum',
    excerpt TEXT,
    published_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
