-- Step-by-Step Data Insert Script for BIPA 1 Program
-- Execute each step separately and capture the returned IDs

-- ========================================
-- STEP 1: Insert the Program
-- ========================================
INSERT INTO programs (title, description, metadata, "createdAt", "updatedAt")
VALUES ('Bahasa Indonesia untuk Penutur Asing Level 1', 'BIPA Level 1 - Basic Indonesian language learning program for foreign speakers', '{}', NOW(), NOW())
RETURNING id;

-- Copy the returned UUID and use it in STEP 2

-- ========================================
-- STEP 2: Insert Units (replace PROGRAM_UUID with actual UUID from STEP 1)
-- ========================================
-- INSERT INTO units (title, description, order_index, program_id, "createdAt", "updatedAt")
-- VALUES 
-- ('Perkenalan', 'Unit tentang perkenalan diri dan sapaan dasar', 1, 'PROGRAM_UUID', NOW(), NOW()),
-- ('Transportasi', 'Unit tentang transportasi umum dan perjalanan', 2, 'PROGRAM_UUID', NOW(), NOW()),
-- ('Tempat Tinggal', 'Unit tentang mencari dan membicarakan tempat tinggal', 3, 'PROGRAM_UUID', NOW(), NOW()),
-- ('Makanan Khas Jakarta', 'Unit tentang makanan Indonesia dan kebiasaan makan', 4, 'PROGRAM_UUID', NOW(), NOW()),
-- ('Berbelanja', 'Unit tentang berbelanja dan transaksi sederhana', 5, 'PROGRAM_UUID', NOW(), NOW())
-- RETURNING id;

-- ========================================
-- STEP 3: Insert Unit Levels (replace UNIT_IDs with actual IDs from STEP 2)
-- ========================================
-- INSERT INTO unit_levels (name, description, position, unit_id, metadata, "createdAt", "updatedAt")
-- VALUES
-- ('Level 1 - Perkenalan', 'Level perkenalan dengan sapaan dan memperkenalkan diri', 1, UNIT_ID_1, '{}', NOW(), NOW()),
-- ('Level 2 - Transportasi', 'Level transportasi umum dan komunikasi dengan driver', 2, UNIT_ID_2, '{}', NOW(), NOW()),
-- ('Level 3 - Tempat Tinggal', 'Level mencari kos, hotel, dan asrama', 3, UNIT_ID_3, '{}', NOW(), NOW()),
-- ('Level 4 - Makanan Khas Jakarta', 'Level makanan Indonesia dan memesan makanan', 4, UNIT_ID_4, '{}', NOW(), NOW()),
-- ('Level 5 - Berbelanja', 'Level berbelanja di supermarket dan pasar tradisional', 5, UNIT_ID_5, '{}', NOW(), NOW())
-- RETURNING id;

-- ========================================
-- STEP 4: Insert Content Items (replace UNIT_LEVEL_IDs with actual IDs from STEP 3)
-- ========================================
-- Level 1 Content Items
-- INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
-- VALUES
-- ('quiz', 'Pilih Sapaan yang Tepat', 'Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu', 'Quiz tentang sapaan yang tepat berdasarkan waktu', 1, UNIT_LEVEL_ID_1, '{"objective": "Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu"}', NOW(), NOW()),
-- ('quiz', 'Perkenalan Diri Sederhana', 'Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri', 'Quiz tentang perkenalan diri dasar', 2, UNIT_LEVEL_ID_1, '{"objective": "Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri"}', NOW(), NOW()),
-- ('quiz', 'Isi Formulir Data Diri', 'Pemelajar dapat melengkapi formulir data diri sederhana', 'Quiz tentang mengisi formulir data diri', 3, UNIT_LEVEL_ID_1, '{"objective": "Pemelajar dapat melengkapi formulir data diri sederhana"}', NOW(), NOW()),
-- ('roleplay', 'Perkenalan dengan Petugas Bandara', 'Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara', 'Roleplay perkenalan di bandara', 4, UNIT_LEVEL_ID_1, '{"objective": "Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara"}', NOW(), NOW())
-- RETURNING id;

-- Continue with other levels...

-- ========================================
-- STEP 5: Insert Quizzes (replace CONTENT_ITEM_IDs with actual IDs from STEP 4)
-- ========================================
-- INSERT INTO quizzes (question, explanation, content_item_id, metadata, "createdAt", "updatedAt")
-- VALUES
-- ('Pilih sapaan yang tepat untuk pagi hari', 'Sapaan yang tepat untuk pagi hari adalah "Selamat pagi"', CONTENT_ITEM_ID_1, '{}', NOW(), NOW())
-- RETURNING id;

-- ========================================
-- STEP 6: Insert Quiz Options (replace QUIZ_IDs with actual IDs from STEP 5)
-- ========================================
-- INSERT INTO quiz_options (option_text, is_correct, quiz_id, metadata, "createdAt", "updatedAt")
-- VALUES
-- ('Selamat pagi', TRUE, QUIZ_ID_1, '{}', NOW(), NOW()),
-- ('Selamat siang', FALSE, QUIZ_ID_1, '{}', NOW(), NOW()),
-- ('Selamat sore', FALSE, QUIZ_ID_1, '{}', NOW(), NOW()),
-- ('Selamat malam', FALSE, QUIZ_ID_1, '{}', NOW(), NOW());

-- ========================================
-- STEP 7: Insert Roleplays (replace CONTENT_ITEM_IDs with actual IDs from STEP 4)
-- ========================================
-- INSERT INTO roleplays (scenario, instructions, character_name, character_description, content_item_id, metadata, "createdAt", "updatedAt")
-- VALUES
-- ('Mahasiswa internasional baru tiba di bandara Indonesia, bertemu petugas bandara dan memperkenalkan diri.', 'Berperan sebagai mahasiswa internasional yang baru tiba di Indonesia. Jawab pertanyaan petugas dengan sopan dan jelas.', 'Petugas Bandara', 'Petugas bandara yang ramah dan membantu mahasiswa internasional', CONTENT_ITEM_ID_4, '{}', NOW(), NOW())
-- RETURNING id;

-- ========================================
-- STEP 8: Insert Roleplay Turns (replace ROLEPLAY_IDs with actual IDs from STEP 7)
-- ========================================
-- INSERT INTO roleplay_turns (speaker, message, turn_order, roleplay_id, metadata, "createdAt", "updatedAt")
-- VALUES
-- ('character', 'Selamat pagi. Selamat datang di Indonesia.', 1, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('user', 'Selamat pagi, Bu.', 2, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('character', 'Nama kamu siapa?', 3, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('user', 'Nama saya [nama].', 4, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('character', 'Kamu dari negara mana?', 5, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('user', 'Saya dari [negara].', 6, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('character', 'Alamat kamu di Indonesia di mana?', 7, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('user', 'Saya tinggal di [alamat].', 8, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('character', 'Kapan tanggal lahirmu?', 9, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('user', 'Tanggal [lahir].', 10, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('character', 'Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.', 11, ROLEPLAY_ID_1, '{}', NOW(), NOW()),
-- ('user', 'Terima kasih, Bu.', 12, ROLEPLAY_ID_1, '{}', NOW(), NOW());

-- ========================================
-- INSTRUCTIONS:
-- ========================================
-- 1. Execute STEP 1 first and copy the returned UUID
-- 2. Uncomment STEP 2, replace PROGRAM_UUID with the actual UUID, then execute
-- 3. Copy the returned unit IDs from STEP 2
-- 4. Uncomment STEP 3, replace UNIT_IDs with actual IDs, then execute
-- 5. Continue this pattern for all subsequent steps
-- 6. Each step depends on the IDs returned from previous steps