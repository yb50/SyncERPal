CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY,
  reference_no VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL,

  item_id UUID NOT NULL REFERENCES items(id),
  from_location_id UUID REFERENCES locations(id),
  to_location_id UUID REFERENCES locations(id),

  quantity INT NOT NULL,
  note TEXT,

  created_by_user_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movements_item_time ON stock_movements(item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_from_time ON stock_movements(from_location_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_to_time ON stock_movements(to_location_id, created_at DESC);
