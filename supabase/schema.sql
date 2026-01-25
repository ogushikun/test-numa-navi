-- 作品マスタテーブル
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE NOT NULL, -- ISBN, JAN, MAL_ID など
    title TEXT NOT NULL,
    media TEXT NOT NULL CHECK (media IN ('anime', 'manga', 'lightnovel')),
    rating TEXT NOT NULL CHECK (rating IN ('G', 'R15', 'R18')),
    description TEXT,
    thumbnail_url TEXT,
    reason TEXT, -- 推薦理由テンプレート
    depth INT2 NOT NULL CHECK (depth BETWEEN 0 AND 2),
    intensity INT2 NOT NULL CHECK (intensity BETWEEN 0 AND 2),
    direction TEXT NOT NULL,
    aftertaste TEXT NOT NULL,
    filter TEXT NOT NULL,
    genres TEXT[] DEFAULT '{}',
    weighted_genres JSONB DEFAULT '[]', -- タグの重み情報（name, value/rank)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 作品ごとのリンクテーブル
CREATE TABLE work_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（検索高速化）
CREATE INDEX idx_works_media ON works(media);
CREATE INDEX idx_works_rating ON works(rating);
CREATE INDEX idx_works_external_id ON works(external_id);
