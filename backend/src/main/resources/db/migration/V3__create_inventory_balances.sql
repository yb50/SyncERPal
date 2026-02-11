CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE inventory_balances (
  id UUID PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES items(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_item_location UNIQUE (item_id, location_id),
  CONSTRAINT chk_quantity_nonnegative CHECK (quantity >= 0)
);

-- Seed for demo purpose: a balance row for every item & location pair, starting at 0.
INSERT INTO inventory_balances (id, item_id, location_id, quantity)
SELECT gen_random_uuid(), i.id, l.id, 0
FROM items i
CROSS JOIN locations l;