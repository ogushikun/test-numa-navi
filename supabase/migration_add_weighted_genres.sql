-- 直近の改修で追加された weighted_genres カラムを追加するマイグレーション
ALTER TABLE works ADD COLUMN IF NOT EXISTS weighted_genres JSONB DEFAULT '[]';

COMMENT ON COLUMN works.weighted_genres IS 'タグの重み情報（name, value/rank）';
