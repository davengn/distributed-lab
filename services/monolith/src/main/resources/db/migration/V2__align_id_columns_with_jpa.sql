ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_catalog_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_order_id_fkey;

ALTER TABLE catalog ALTER COLUMN id TYPE BIGINT;
ALTER TABLE orders ALTER COLUMN id TYPE BIGINT;
ALTER TABLE order_items ALTER COLUMN id TYPE BIGINT;
ALTER TABLE order_items ALTER COLUMN order_id TYPE BIGINT;
ALTER TABLE order_items ALTER COLUMN catalog_id TYPE BIGINT;
ALTER TABLE payments ALTER COLUMN id TYPE BIGINT;
ALTER TABLE payments ALTER COLUMN order_id TYPE BIGINT;

ALTER SEQUENCE IF EXISTS catalog_id_seq AS BIGINT;
ALTER SEQUENCE IF EXISTS orders_id_seq AS BIGINT;
ALTER SEQUENCE IF EXISTS order_items_id_seq AS BIGINT;
ALTER SEQUENCE IF EXISTS payments_id_seq AS BIGINT;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE order_items
  ADD CONSTRAINT order_items_catalog_id_fkey FOREIGN KEY (catalog_id) REFERENCES catalog(id);
ALTER TABLE payments
  ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id);
