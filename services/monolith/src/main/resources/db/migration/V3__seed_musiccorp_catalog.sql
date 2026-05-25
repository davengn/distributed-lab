INSERT INTO catalog (title, artist, genre, price, stock_quantity)
SELECT seed.title, seed.artist, seed.genre, seed.price, seed.stock_quantity
FROM (
  VALUES
    ('Kind of Blue', 'Miles Davis', 'Jazz', 12.99, 50),
    ('A Love Supreme', 'John Coltrane', 'Jazz', 14.99, 30),
    ('Blue Train', 'John Coltrane', 'Jazz', 11.99, 25),
    ('Rumours', 'Fleetwood Mac', 'Rock', 13.99, 42),
    ('Purple Rain', 'Prince', 'Pop', 15.49, 18),
    ('Discovery', 'Daft Punk', 'Electronic', 12.49, 36),
    ('Random Access Memories', 'Daft Punk', 'Electronic', 16.99, 12),
    ('Illmatic', 'Nas', 'Hip-Hop', 10.99, 28),
    ('The Miseducation of Lauryn Hill', 'Lauryn Hill', 'R&B', 13.49, 16),
    ('Buena Vista Social Club', 'Buena Vista Social Club', 'Latin', 12.79, 20),
    ('Back in Black', 'AC/DC', 'Rock', 11.49, 34),
    ('The Dark Side of the Moon', 'Pink Floyd', 'Rock', 14.79, 0)
) AS seed(title, artist, genre, price, stock_quantity)
WHERE NOT EXISTS (
  SELECT 1
  FROM catalog existing
  WHERE lower(existing.title) = lower(seed.title)
    AND lower(existing.artist) = lower(seed.artist)
);

SELECT setval('catalog_id_seq', COALESCE((SELECT MAX(id) FROM catalog), 1), true);
