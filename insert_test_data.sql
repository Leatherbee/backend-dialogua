-- Simple Test Data Insert Script for BIPA 1 Program
-- This script inserts minimal test data to make the API endpoints work

BEGIN;

-- Step 1: Insert a test program
INSERT INTO programs (title, description, metadata, "createdAt", "updatedAt")
VALUES ('Bahasa Indonesia untuk Penutur Asing Level 1', 'BIPA Level 1 - Basic Indonesian language learning program for foreign speakers', '{}', NOW(), NOW());

-- Get the program ID (we'll use a simple approach)
-- Step 2: Insert units for the program
WITH program_data AS (
  SELECT id as program_id FROM programs WHERE title = 'Bahasa Indonesia untuk Penutur Asing Level 1' LIMIT 1
)
INSERT INTO units (title, description, order_index, program_id, "createdAt", "updatedAt")
SELECT 
  unit_data.title,
  unit_data.description,
  unit_data.order_index,
  p.program_id,
  NOW(),
  NOW()
FROM program_data p,
(VALUES 
  ('Perkenalan', 'Unit tentang perkenalan diri dan sapaan dasar', 1),
  ('Transportasi', 'Unit tentang transportasi umum dan perjalanan', 2),
  ('Tempat Tinggal', 'Unit tentang mencari dan membicarakan tempat tinggal', 3),
  ('Makanan Khas Jakarta', 'Unit tentang makanan Indonesia dan kebiasaan makan', 4),
  ('Berbelanja', 'Unit tentang berbelanja dan transaksi sederhana', 5)
) AS unit_data(title, description, order_index);

-- Step 3: Insert unit levels
WITH unit_data AS (
  SELECT id as unit_id, order_index FROM units 
  WHERE program_id = (SELECT id FROM programs WHERE title = 'Bahasa Indonesia untuk Penutur Asing Level 1' LIMIT 1)
)
INSERT INTO unit_levels (name, description, position, unit_id, metadata, "createdAt", "updatedAt")
SELECT 
  level_data.name,
  level_data.description,
  level_data.position,
  u.unit_id,
  '{}'::jsonb,
  NOW(),
  NOW()
FROM unit_data u
JOIN (VALUES 
  (1, 'Level 1 - Perkenalan', 'Level perkenalan dengan sapaan dan memperkenalkan diri', 1),
  (2, 'Level 2 - Transportasi', 'Level transportasi umum dan komunikasi dengan driver', 2),
  (3, 'Level 3 - Tempat Tinggal', 'Level mencari kos, hotel, dan asrama', 3),
  (4, 'Level 4 - Makanan Khas Jakarta', 'Level makanan Indonesia dan memesan makanan', 4),
  (5, 'Level 5 - Berbelanja', 'Level berbelanja di supermarket dan pasar tradisional', 5)
) AS level_data(unit_order, name, description, position) ON u.order_index = level_data.unit_order;

-- Step 4: Insert some basic content items
WITH level_data AS (
  SELECT ul.id as unit_level_id, ul.position 
  FROM unit_levels ul
  JOIN units u ON ul.unit_id = u.id
  WHERE u.program_id = (SELECT id FROM programs WHERE title = 'Bahasa Indonesia untuk Penutur Asing Level 1' LIMIT 1)
)
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
SELECT 
  content_data.content_type::content_items_content_type_enum,
  content_data.title,
  content_data.description,
  content_data.content,
  content_data.position,
  l.unit_level_id,
  content_data.metadata::jsonb,
  NOW(),
  NOW()
FROM level_data l
JOIN (VALUES 
  -- Level 1 Content Items
  (1, 'quiz', 'Pilih Sapaan yang Tepat', 'Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu', 'Quiz tentang sapaan yang tepat berdasarkan waktu', 1, '{"objective": "Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu"}'),
  (1, 'quiz', 'Perkenalan Diri Sederhana', 'Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri', 'Quiz tentang perkenalan diri dasar', 2, '{"objective": "Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri"}'),
  (1, 'roleplay', 'Perkenalan dengan Petugas Bandara', 'Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara', 'Roleplay perkenalan di bandara', 3, '{"objective": "Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara"}'),
  
  -- Level 2 Content Items
  (2, 'quiz', 'Kenali Transportasi Umum', 'Pemelajar dapat mengenali kosakata transportasi umum melalui gambar', 'Quiz tentang jenis-jenis transportasi umum', 1, '{"objective": "Pemelajar dapat mengenali kosakata transportasi umum melalui gambar"}'),
  (2, 'roleplay', 'Bertanya Arah ke Sopir', 'Pemelajar dapat bertanya arah dan berkomunikasi dengan sopir transportasi umum', 'Roleplay bertanya arah kepada sopir', 2, '{"objective": "Pemelajar dapat bertanya arah dan berkomunikasi dengan sopir transportasi umum"}'),
  
  -- Level 3 Content Items
  (3, 'quiz', 'Pilih Tempat Tinggal', 'Pemelajar dapat memilih tempat tinggal yang sesuai berdasarkan deskripsi', 'Quiz tentang memilih tempat tinggal', 1, '{"objective": "Pemelajar dapat memilih tempat tinggal yang sesuai berdasarkan deskripsi"}'),
  (3, 'roleplay', 'Mencari Kos', 'Pemelajar dapat berkomunikasi dengan pemilik kos untuk mencari tempat tinggal', 'Roleplay mencari kos', 2, '{"objective": "Pemelajar dapat berkomunikasi dengan pemilik kos untuk mencari tempat tinggal"}'),
  
  -- Level 4 Content Items
  (4, 'quiz', 'Cocokkan Makanan Indonesia', 'Pemelajar dapat mengenali dan mencocokkan makanan Indonesia', 'Quiz tentang makanan khas Indonesia', 1, '{"objective": "Pemelajar dapat mengenali dan mencocokkan makanan Indonesia"}'),
  (4, 'roleplay', 'Pesan Makanan di Warung', 'Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan', 'Roleplay memesan makanan di warung', 2, '{"objective": "Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan"}'),
  
  -- Level 5 Content Items
  (5, 'quiz', 'Jumlah Barang di Supermarket', 'Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja', 'Quiz tentang jumlah barang belanja', 1, '{"objective": "Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja"}'),
  (5, 'roleplay', 'Tawar Menawar di Pasar', 'Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana', 'Roleplay tawar menawar di pasar', 2, '{"objective": "Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana"}')
) AS content_data(level_position, content_type, title, description, content, position, metadata) ON l.position = content_data.level_position;

COMMIT;

-- Verify the data was inserted
SELECT 'Programs inserted:' as info, COUNT(*) as count FROM programs;
SELECT 'Units inserted:' as info, COUNT(*) as count FROM units;
SELECT 'Unit levels inserted:' as info, COUNT(*) as count FROM unit_levels;
SELECT 'Content items inserted:' as info, COUNT(*) as count FROM content_items;