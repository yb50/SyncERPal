CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE locations (
  id UUID PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name_en VARCHAR(100) NOT NULL,
  name_ja VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed data for demo purposes
INSERT INTO locations (id, code, name_en, name_ja)
VALUES
  (gen_random_uuid(), 'HQ',  'Headquarters', '本社'),
  (gen_random_uuid(), 'WH1', 'Warehouse 1',  '倉庫1'),
  (gen_random_uuid(), 'WH2', 'Warehouse 2',  '倉庫2');
