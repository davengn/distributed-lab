INSERT INTO catalog (title, artist, genre, price, stock_quantity) VALUES
  ('Kind of Blue', 'Miles Davis', 'Jazz', 12.99, 50),
  ('A Love Supreme', 'John Coltrane', 'Jazz', 14.99, 30),
  ('Blue Train', 'John Coltrane', 'Jazz', 11.99, 25),
  ('Time Out', 'Dave Brubeck', 'Jazz', 13.99, 40),
  ('Head Hunters', 'Herbie Hancock', 'Funk', 12.49, 35),
  ('Bitches Brew', 'Miles Davis', 'Jazz Fusion', 15.99, 20),
  ('Mingus Ah Um', 'Charles Mingus', 'Jazz', 13.49, 28),
  ('Sketches of Spain', 'Miles Davis', 'Jazz', 14.49, 22);

INSERT INTO orders (customer_email, status, total_amount) VALUES
  ('learner@distributedlab.dev', 'COMPLETED', 26.98),
  ('student@distributedlab.dev', 'PENDING', 14.99);

INSERT INTO order_items (order_id, catalog_id, quantity, unit_price) VALUES
  (1, 1, 1, 12.99),
  (1, 3, 1, 11.99),
  (2, 2, 1, 14.99);

INSERT INTO payments (order_id, amount, method, status, transaction_ref) VALUES
  (1, 26.98, 'CREDIT_CARD', 'COMPLETED', 'TXN-abc12345'),
  (2, 14.99, 'CREDIT_CARD', 'PENDING', NULL);
