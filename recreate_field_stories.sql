-- Drop dan buat ulang field_stories dengan struktur yang benar
DROP TABLE IF EXISTS field_stories CASCADE;

CREATE TABLE field_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
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
