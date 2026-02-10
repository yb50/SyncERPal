CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE items (
  id UUID PRIMARY KEY,
  sku VARCHAR(50) NOT NULL UNIQUE,
  name_en VARCHAR(150) NOT NULL,
  name_ja VARCHAR(150) NOT NULL,
  barcode VARCHAR(100) UNIQUE,
  unit VARCHAR(20) NOT NULL DEFAULT 'pcs',
  low_stock_threshold INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed for demo purposes
INSERT INTO items (id, sku, name_en, name_ja, barcode, unit, low_stock_threshold)
VALUES
  (gen_random_uuid(), 'SKU-001', 'Widget A', '部品A', '4900000000011', 'pcs', 10),
  (gen_random_uuid(), 'SKU-002', 'Widget B', '部品B', '4900000000028', 'pcs', 5),
  (gen_random_uuid(), 'SKU-003', 'Box Small', '小箱',    '4900000000035', 'pcs', 20);
