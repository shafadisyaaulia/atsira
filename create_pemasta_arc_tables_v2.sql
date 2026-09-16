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
    read_minutes INTEGER,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quality_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    category TEXT,
    excerpt TEXT,
    published_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
