CREATE TABLE IF NOT EXISTS market_price_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pemasta_id UUID REFERENCES profiles(id),
    region TEXT NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Berita',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES profiles(id),
    product_title TEXT NOT NULL,
    sample_volume NUMERIC,
    status TEXT DEFAULT 'Menunggu Sampel',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
