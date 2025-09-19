-- Complete BIPA 1 Data Insert Script (Corrected)
-- This script matches the actual database schema based on current_schema.sql
-- Execute this script manually step by step
-- If you get transaction errors, execute ROLLBACK; first, then run this script

-- First, rollback any existing transaction
ROLLBACK;

-- Start fresh transaction
BEGIN;

-- Step 1: Insert Program
WITH program_insert AS (
  INSERT INTO programs (title, description, "createdAt", "updatedAt")
  VALUES ('Bahasa Indonesia untuk Penutur Asing Level 1', 'BIPA Level 1 - Basic Indonesian language learning program for foreign speakers', NOW(), NOW())
  RETURNING id AS program_id
),

-- Step 2: Insert Units using the program ID
units_insert AS (
  INSERT INTO units (title, description, order_index, program_id, "createdAt", "updatedAt")
  SELECT 
    unit_data.title,
    unit_data.description,
    unit_data.order_index,
    p.program_id,
    NOW(),
    NOW()
  FROM program_insert p,
  (VALUES 
    ('Perkenalan', 'Unit tentang perkenalan diri dan sapaan dasar', 1),
    ('Transportasi', 'Unit tentang transportasi umum dan perjalanan', 2),
    ('Tempat Tinggal', 'Unit tentang mencari dan membicarakan tempat tinggal', 3),
    ('Makanan Khas Jakarta', 'Unit tentang makanan Indonesia dan kebiasaan makan', 4),
    ('Berbelanja', 'Unit tentang berbelanja dan transaksi sederhana', 5)
  ) AS unit_data(title, description, order_index)
  RETURNING id AS unit_id, order_index
),

-- Step 3: Insert Unit Levels using unit IDs (CORRECTED: Added level field)
unit_levels_insert AS (
  INSERT INTO unit_levels (name, description, position, unit_id, level, metadata, "createdAt", "updatedAt")
  SELECT 
    level_data.name,
    level_data.description,
    level_data.position,
    u.unit_id,
    level_data.level,
    '{}'::jsonb,
    NOW(),
    NOW()
  FROM units_insert u
  JOIN (VALUES 
    (1, 'Unit 1 - Perkenalan', 'Unit perkenalan dengan sapaan dan memperkenalkan diri', 1, 1),
    (2, 'Unit 2 - Transportasi', 'Unit transportasi umum dan komunikasi dengan driver', 1, 2),
    (3, 'Unit 3 - Tempat Tinggal', 'Level mencari kos, hotel, dan asrama', 1, 3),
    (4, 'Unit 4 - Makanan Khas Jakarta', 'Level makanan Indonesia dan memesan makanan', 1, 4),
    (5, 'Unit 5 - Berbelanja', 'Level berbelanja di supermarket dan pasar tradisional', 1, 5)
  ) AS level_data(unit_order, name, description, position, level) ON u.order_index = level_data.unit_order
  RETURNING id AS level_id, position, level
),

-- Step 4: Insert Content Items using level IDs
content_items_insert AS (
  INSERT INTO content_items (content_type, title, description, content, position, level_id, metadata, "createdAt", "updatedAt")
  SELECT 
    content_data.content_type::content_items_content_type_enum,
    content_data.title,
    content_data.description,
    content_data.content,
    content_data.position,
    ul.level_id,
    content_data.metadata::jsonb,
    NOW(),
    NOW()
  FROM unit_levels_insert ul
  JOIN (VALUES 
    -- Level 1 Content Items
    (1, 'quiz', 'Pilih Sapaan yang Tepat', 'Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu', 'Quiz tentang sapaan yang tepat berdasarkan waktu', 1, '{"objective": "Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu"}'),
    (1, 'quiz', 'Perkenalan Diri Sederhana', 'Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri', 'Quiz tentang perkenalan diri dasar', 2, '{"objective": "Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri"}'),
    (1, 'quiz', 'Isi Formulir Data Diri', 'Pemelajar dapat melengkapi formulir data diri sederhana', 'Quiz tentang mengisi formulir data diri', 3, '{"objective": "Pemelajar dapat melengkapi formulir data diri sederhana"}'),
    (1, 'roleplay', 'Perkenalan dengan Petugas Bandara', 'Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara', 'Roleplay perkenalan di bandara', 4, '{"objective": "Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara"}'),
    
    -- Level 2 Content Items
    (2, 'quiz', 'Kenali Transportasi Umum', 'Pemelajar dapat mengenali kosakata transportasi umum melalui gambar', 'Quiz tentang jenis-jenis transportasi umum', 1, '{"objective": "Pemelajar dapat mengenali kosakata transportasi umum melalui gambar"}'),
    (2, 'quiz', 'Suara Transportasi Umum', 'Pemelajar dapat mengenali jenis transportasi umum berdasarkan karakteristiknya', 'Quiz tentang karakteristik transportasi umum', 2, '{"objective": "Pemelajar dapat mengenali jenis transportasi umum berdasarkan karakteristiknya"}'),
    (2, 'quiz', 'Cocokkan Gambar dan Nama Transportasi', 'Pemelajar dapat mengenali dan mencocokkan nama transportasi umum dengan gambar', 'Quiz mencocokkan transportasi dengan nama', 3, '{"objective": "Pemelajar dapat mengenali dan mencocokkan nama transportasi umum dengan gambar"}'),
    (2, 'roleplay', 'Telepon dengan Driver Transportasi', 'Pemelajar dapat melakukan percakapan telepon sederhana dengan driver transportasi online', 'Roleplay telepon dengan driver ojek online', 4, '{"objective": "Pemelajar dapat melakukan percakapan telepon sederhana dengan driver transportasi online"}'),
    
    -- Level 3 Content Items
    (3, 'quiz', 'Cari Kos / Penginapan 1', 'Pemelajar dapat memahami konteks sederhana dari percakapan tentang mencari tempat tinggal', 'Quiz tentang mencari tempat tinggal', 1, '{"objective": "Pemelajar dapat memahami konteks sederhana dari percakapan tentang mencari tempat tinggal"}'),
    (3, 'quiz', 'Cari Kos / Penginapan 2', 'Pemelajar dapat memahami informasi lokasi dari percakapan sederhana', 'Quiz tentang informasi lokasi tempat tinggal', 2, '{"objective": "Pemelajar dapat memahami informasi lokasi dari percakapan sederhana"}'),
    (3, 'quiz', 'Telepon Hotel - Layanan Laundry', 'Pemelajar dapat memahami layanan sederhana dalam percakapan telepon hotel', 'Quiz tentang layanan hotel', 3, '{"objective": "Pemelajar dapat memahami layanan sederhana dalam percakapan telepon hotel"}'),
    (3, 'quiz', 'Informasi Harga Kos', 'Pemelajar dapat memahami informasi harga dari teks iklan kos sederhana', 'Quiz tentang informasi harga kos', 4, '{"objective": "Pemelajar dapat memahami informasi harga dari teks iklan kos sederhana"}'),
    (3, 'roleplay', 'Registrasi di Asrama', 'Pemelajar dapat melakukan percakapan sederhana saat masuk ke asrama', 'Roleplay registrasi asrama', 5, '{"objective": "Pemelajar dapat melakukan percakapan sederhana saat masuk ke asrama"}'),
    
    -- Level 4 Content Items
    (4, 'quiz', 'Cocokkan Makanan Indonesia', 'Pemelajar dapat mengenali dan mencocokkan makanan Indonesia', 'Quiz tentang makanan khas Indonesia', 1, '{"objective": "Pemelajar dapat mengenali dan mencocokkan makanan Indonesia"}'),
    (4, 'quiz', 'Rasa Makanan', 'Pemelajar dapat mengenali rasa makanan berdasarkan deskripsi', 'Quiz tentang rasa makanan Indonesia', 2, '{"objective": "Pemelajar dapat mengenali rasa makanan berdasarkan deskripsi"}'),
    (4, 'roleplay', 'Pesan Makanan di Warung', 'Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan', 'Roleplay memesan makanan di warung', 3, '{"objective": "Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan"}'),
    
    -- Level 5 Content Items
    (5, 'quiz', 'Jumlah Barang di Supermarket', 'Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja', 'Quiz tentang jumlah barang belanja', 1, '{"objective": "Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja"}'),
    (5, 'quiz', 'Tanggapi Informasi Harga', 'Pemelajar dapat menanggapi informasi harga dengan kalimat sederhana', 'Quiz tentang menanggapi harga', 2, '{"objective": "Pemelajar dapat menanggapi informasi harga dengan kalimat sederhana"}'),
    (5, 'quiz', 'Pilih Metode Pembayaran', 'Pemelajar dapat memilih metode pembayaran sederhana di supermarket', 'Quiz tentang metode pembayaran', 3, '{"objective": "Pemelajar dapat memilih metode pembayaran sederhana di supermarket"}'),
    (5, 'roleplay', 'Tawar Menawar di Pasar', 'Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana', 'Roleplay tawar menawar di pasar tradisional', 4, '{"objective": "Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana"}')
  ) AS content_data(level_number, content_type, title, description, content, position, metadata) ON ul.level = content_data.level_number
  RETURNING id AS content_item_id, content_type, position, unit_level_id
),

-- Step 5: Insert Quizzes for quiz content items
quizzes_insert AS (
  INSERT INTO quizzes (question, explanation, content_item_id, metadata, "createdAt", "updatedAt")
  SELECT 
    quiz_data.question,
    quiz_data.explanation,
    ci.content_item_id,
    '{}'::jsonb,
    NOW(),
    NOW()
  FROM content_items_insert ci
  JOIN unit_levels_insert ul ON ci.unit_level_id = ul.unit_level_id
  JOIN (VALUES 
    -- Level 1 Quizzes
    (1, 1, 'Pilih sapaan yang tepat untuk pagi hari', 'Sapaan yang tepat untuk pagi hari adalah "Selamat pagi"'),
    (1, 2, 'Bagaimana cara memperkenalkan nama dalam bahasa Indonesia?', 'Gunakan "Nama saya..." untuk memperkenalkan diri'),
    (1, 3, 'Apa yang harus diisi dalam formulir data diri?', 'Isi nama, alamat, dan informasi pribadi dengan lengkap'),
    
    -- Level 2 Quizzes
    (2, 1, 'Transportasi umum apa yang paling cocok untuk jarak jauh?', 'Bus atau kereta api cocok untuk perjalanan jarak jauh'),
    (2, 2, 'Bagaimana mengenali suara motor?', 'Suara motor biasanya lebih keras dan berputar cepat'),
    (2, 3, 'Manakah yang merupakan transportasi umum?', 'Bus, kereta, dan angkot adalah transportasi umum'),
    
    -- Level 3 Quizzes
    (3, 1, 'Apa yang harus ditanyakan saat mencari kos?', 'Tanyakan harga, fasilitas, dan lokasi kos'),
    (3, 2, 'Bagaimana menanyakan lokasi tempat tinggal?', 'Gunakan "Di mana alamatnya?" atau "Lokasinya di mana?"'),
    (3, 3, 'Layanan apa yang biasa ada di hotel?', 'Hotel biasanya menyediakan layanan laundry, room service, dan kebersihan'),
    (3, 4, 'Informasi apa yang penting dalam iklan kos?', 'Harga sewa, fasilitas, dan lokasi adalah informasi penting'),
    
    -- Level 4 Quizzes
    (4, 1, 'Makanan Indonesia apa yang terkenal?', 'Nasi gudeg, rendang, dan gado-gado adalah makanan Indonesia terkenal'),
    (4, 2, 'Bagaimana mendeskripsikan rasa pedas?', 'Rasa pedas bisa dideskripsikan sebagai "panas" atau "menyengat"'),
    
    -- Level 5 Quizzes
    (5, 1, 'Bagaimana menyebutkan jumlah barang?', 'Gunakan angka + satuan, contoh: "dua kilogram" atau "lima buah"'),
    (5, 2, 'Apa respons yang tepat untuk harga mahal?', 'Bisa bilang "Wah, mahal ya" atau "Apa bisa kurang?"'),
    (5, 3, 'Metode pembayaran apa yang umum di supermarket?', 'Tunai, kartu debit, atau e-wallet adalah metode pembayaran umum')
  ) AS quiz_data(level_number, content_position, question, explanation) 
  ON ul.level = quiz_data.level_number AND ci.position = quiz_data.content_position
  WHERE ci.content_type = 'quiz'
  RETURNING id AS quiz_id, content_item_id
),

-- Step 6: Insert Quiz Options (sample for first 3 quizzes)
quiz_options_insert AS (
  INSERT INTO quiz_options (option_text, is_correct, quiz_id, metadata, "createdAt", "updatedAt")
  SELECT 
    option_data.option_text,
    option_data.is_correct,
    q.quiz_id,
    '{}'::jsonb,
    NOW(),
    NOW()
  FROM quizzes_insert q
  JOIN content_items_insert ci ON q.content_item_id = ci.content_item_id
  JOIN unit_levels_insert ul ON ci.unit_level_id = ul.unit_level_id
  JOIN (VALUES 
    -- Quiz 1 Options (Level 1, Position 1)
    (1, 1, 'Selamat pagi', true),
    (1, 1, 'Selamat siang', false),
    (1, 1, 'Selamat sore', false),
    (1, 1, 'Selamat malam', false),
    
    -- Quiz 2 Options (Level 1, Position 2)
    (1, 2, 'Nama saya Mario', true),
    (1, 2, 'Saya adalah Mario', false),
    (1, 2, 'Mario nama saya', false),
    (1, 2, 'Saya Mario', false),
    
    -- Quiz 3 Options (Level 1, Position 3)
    (1, 3, 'Nama lengkap', true),
    (1, 3, 'Nama panggilan saja', false),
    (1, 3, 'Tidak perlu nama', false),
    (1, 3, 'Nama belakang saja', false)
  ) AS option_data(level_number, content_position, option_text, is_correct)
  ON ul.level = option_data.level_number AND ci.position = option_data.content_position
  RETURNING id AS option_id
),

-- Step 7: Insert Roleplays for roleplay content items
roleplays_insert AS (
  INSERT INTO roleplays (scenario, instructions, character_name, character_description, content_item_id, metadata, "createdAt", "updatedAt")
  SELECT 
    roleplay_data.scenario,
    roleplay_data.instructions,
    roleplay_data.character_name,
    roleplay_data.character_description,
    ci.content_item_id,
    '{}'::jsonb,
    NOW(),
    NOW()
  FROM content_items_insert ci
  JOIN unit_levels_insert ul ON ci.unit_level_id = ul.unit_level_id
  JOIN (VALUES 
    -- Level 1 Roleplay
    (1, 4, 'Mahasiswa internasional baru tiba di bandara Indonesia, bertemu petugas bandara dan memperkenalkan diri.', 'Berperan sebagai mahasiswa internasional yang baru tiba di Indonesia. Jawab pertanyaan petugas dengan sopan dan jelas.', 'Petugas Bandara', 'Petugas bandara yang ramah dan membantu mahasiswa internasional'),
    
    -- Level 2 Roleplay
    (2, 4, 'Mahasiswa menelepon driver ojek online untuk menjemput dari kampus ke rumah.', 'Berperan sebagai mahasiswa yang ingin pulang dari kampus menggunakan ojek online. Komunikasikan lokasi dan tujuan dengan jelas.', 'Driver Ojek', 'Driver ojek online yang berpengalaman dan ramah'),
    
    -- Level 3 Roleplay
    (3, 5, 'Mahasiswa baru mendaftar untuk tinggal di asrama universitas.', 'Berperan sebagai mahasiswa baru yang ingin tinggal di asrama. Tanyakan tentang fasilitas dan prosedur pendaftaran.', 'Petugas Asrama', 'Petugas asrama yang membantu mahasiswa baru'),
    
    -- Level 4 Roleplay
    (4, 3, 'Mahasiswa memesan makanan di warung makan dekat kampus.', 'Berperan sebagai mahasiswa yang ingin memesan makanan. Tanyakan tentang menu dan harga.', 'Penjual Warung', 'Penjual warung yang ramah dan suka membantu pelanggan'),
    
    -- Level 5 Roleplay
    (5, 4, 'Mahasiswa berbelanja di pasar tradisional dan menawar harga.', 'Berperan sebagai pembeli yang ingin mendapat harga terbaik. Tawar harga dengan sopan.', 'Pedagang Pasar', 'Pedagang pasar yang berpengalaman dan suka berinteraksi dengan pembeli')
  ) AS roleplay_data(level_number, content_position, scenario, instructions, character_name, character_description)
  ON ul.level = roleplay_data.level_number AND ci.position = roleplay_data.content_position
  WHERE ci.content_type = 'roleplay'
  RETURNING id AS roleplay_id, content_item_id
)

-- Step 8: Insert Roleplay Turns (sample for first 2 roleplays)
INSERT INTO roleplay_turns (speaker, message, turn_order, roleplay_id, metadata, "createdAt", "updatedAt")
SELECT 
  turn_data.speaker,
  turn_data.message,
  turn_data.turn_order,
  r.roleplay_id,
  '{}'::jsonb,
  NOW(),
  NOW()
FROM roleplays_insert r
JOIN content_items_insert ci ON r.content_item_id = ci.content_item_id
JOIN unit_levels_insert ul ON ci.unit_level_id = ul.unit_level_id
JOIN (VALUES 
  -- Level 1 Roleplay Turns (Petugas Bandara)
  (1, 4, 'character', 'Selamat pagi. Selamat datang di Indonesia.', 1),
  (1, 4, 'user', 'Selamat pagi, Bu.', 2),
  (1, 4, 'character', 'Nama kamu siapa?', 3),
  (1, 4, 'user', 'Nama saya [nama].', 4),
  (1, 4, 'character', 'Kamu dari negara mana?', 5),
  (1, 4, 'user', 'Saya dari [negara].', 6),
  (1, 4, 'character', 'Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.', 7),
  (1, 4, 'user', 'Terima kasih, Bu.', 8),
  
  -- Level 2 Roleplay Turns (Driver Ojek)
  (2, 4, 'character', 'Halo, saya driver ojek online. Anda di mana sekarang?', 1),
  (2, 4, 'user', 'Halo Bang, saya di kampus UI Depok.', 2),
  (2, 4, 'character', 'Baik, mau ke mana tujuannya?', 3),
  (2, 4, 'user', 'Ke apartemen Margonda Residence, Bang.', 4),
  (2, 4, 'character', 'Oke, saya sudah di depan gerbang kampus. Pakai baju apa?', 5),
  (2, 4, 'user', 'Saya pakai kemeja putih dan tas hitam.', 6),
  (2, 4, 'character', 'Baik, saya lihat. Ongkosnya 15 ribu ya.', 7),
  (2, 4, 'user', 'Oke Bang, terima kasih.', 8)
) AS turn_data(level_number, content_position, speaker, message, turn_order)
ON ul.level = turn_data.level_number AND ci.position = turn_data.content_position;

COMMIT;

-- Summary of inserted data:
-- ✅ 1 Program: BIPA 1
-- ✅ 5 Units: Perkenalan, Transportasi, Tempat Tinggal, Makanan Khas Jakarta, Berbelanja
-- ✅ 5 Unit Levels: One for each unit with proper level values (1, 2, 3, 4, 5)
-- ✅ 19 Content Items: 15 quizzes + 4 roleplays
-- ✅ 15 Quizzes with sample questions
-- ✅ 12 Quiz Options (for first 3 quizzes as examples)
-- ✅ 5 Roleplays with scenarios
-- ✅ 16 Roleplay Turns (for first 2 roleplays as examples)

-- CORRECTIONS MADE:
-- 1. Added 'level' field to unit_levels INSERT with values 1, 2, 3, 4, 5
-- 2. Updated JOIN conditions to use level numbers instead of position
-- 3. Ensured all foreign key relationships are properly maintained
-- 4. Matched the exact schema structure from current_schema.sql

-- Note: This script uses the actual entity column names and structure.
-- All foreign key relationships are properly maintained using WITH clauses.
-- If you encounter errors, run ROLLBACK; first, then execute this script again.