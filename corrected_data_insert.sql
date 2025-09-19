-- Corrected Data Insert Script for BIPA 1 Program
-- This script matches the current database schema

BEGIN;

-- ========================================
-- 1. Insert the Program (BIPA 1)
-- ========================================
INSERT INTO programs (title, description, metadata, "createdAt", "updatedAt")
VALUES ('Bahasa Indonesia untuk Penutur Asing Level 1', 'BIPA Level 1 - Basic Indonesian language learning program for foreign speakers', '{}', NOW(), NOW())
RETURNING id;

-- Note: Save the returned UUID for use in units
-- For this example, let's assume the returned UUID is stored in a variable
-- In practice, you would capture this ID and use it in subsequent inserts

-- ========================================
-- 2. Insert Units (using the program UUID from step 1)
-- ========================================
-- Replace 'PROGRAM_UUID_HERE' with the actual UUID returned from step 1
INSERT INTO units (title, description, order_index, program_id, "createdAt", "updatedAt")
VALUES 
('Perkenalan', 'Unit tentang perkenalan diri dan sapaan dasar', 1, 'PROGRAM_UUID_HERE', NOW(), NOW()),
('Transportasi', 'Unit tentang transportasi umum dan perjalanan', 2, 'PROGRAM_UUID_HERE', NOW(), NOW()),
('Tempat Tinggal', 'Unit tentang mencari dan membicarakan tempat tinggal', 3, 'PROGRAM_UUID_HERE', NOW(), NOW()),
('Makanan Khas Jakarta', 'Unit tentang makanan Indonesia dan kebiasaan makan', 4, 'PROGRAM_UUID_HERE', NOW(), NOW()),
('Berbelanja', 'Unit tentang berbelanja dan transaksi sederhana', 5, 'PROGRAM_UUID_HERE', NOW(), NOW())
RETURNING id;

-- Note: Save the returned unit IDs for use in unit_levels
-- Let's assume these IDs are: 1, 2, 3, 4, 5

-- ========================================
-- 3. Insert Unit Levels (using unit IDs from step 2)
-- ========================================
INSERT INTO unit_levels (name, description, position, unit_id, metadata, "createdAt", "updatedAt")
VALUES
('Level 1 - Perkenalan', 'Level perkenalan dengan sapaan dan memperkenalkan diri', 1, 1, '{}', NOW(), NOW()),
('Level 2 - Transportasi', 'Level transportasi umum dan komunikasi dengan driver', 2, 2, '{}', NOW(), NOW()),
('Level 3 - Tempat Tinggal', 'Level mencari kos, hotel, dan asrama', 3, 3, '{}', NOW(), NOW()),
('Level 4 - Makanan Khas Jakarta', 'Level makanan Indonesia dan memesan makanan', 4, 4, '{}', NOW(), NOW()),
('Level 5 - Berbelanja', 'Level berbelanja di supermarket dan pasar tradisional', 5, 5, '{}', NOW(), NOW())
RETURNING id;

-- Note: Save the returned unit_level IDs for use in content_items
-- Let's assume these IDs are: 1, 2, 3, 4, 5

-- ========================================
-- 4. Insert Content Items (skipping video content as requested)
-- ========================================

-- Level 1: 3 Quizzes + 1 Roleplay
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
VALUES
-- Quizzes for Level 1
('quiz', 'Pilih Sapaan yang Tepat', 'Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu', 'Quiz tentang sapaan yang tepat berdasarkan waktu', 1, 1, '{"objective": "Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu"}', NOW(), NOW()),
('quiz', 'Perkenalan Diri Sederhana', 'Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri', 'Quiz tentang perkenalan diri dasar', 2, 1, '{"objective": "Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri"}', NOW(), NOW()),
('quiz', 'Isi Formulir Data Diri', 'Pemelajar dapat melengkapi formulir data diri sederhana', 'Quiz tentang mengisi formulir data diri', 3, 1, '{"objective": "Pemelajar dapat melengkapi formulir data diri sederhana"}', NOW(), NOW()),
-- Roleplay for Level 1
('roleplay', 'Perkenalan dengan Petugas Bandara', 'Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara', 'Roleplay perkenalan di bandara', 4, 1, '{"objective": "Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara"}', NOW(), NOW());

-- Level 2: 3 Quizzes + 1 Roleplay
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
VALUES
-- Quizzes for Level 2
('quiz', 'Kenali Transportasi Umum', 'Pemelajar dapat mengenali kosakata transportasi umum melalui gambar', 'Quiz tentang jenis-jenis transportasi umum', 1, 2, '{"objective": "Pemelajar dapat mengenali kosakata transportasi umum melalui gambar"}', NOW(), NOW()),
('quiz', 'Suara Transportasi Umum', 'Pemelajar dapat mengenali jenis transportasi umum berdasarkan karakteristiknya', 'Quiz tentang karakteristik transportasi umum', 2, 2, '{"objective": "Pemelajar dapat mengenali jenis transportasi umum berdasarkan karakteristiknya"}', NOW(), NOW()),
('quiz', 'Cocokkan Gambar dan Nama Transportasi', 'Pemelajar dapat mengenali dan mencocokkan nama transportasi umum dengan gambar', 'Quiz mencocokkan transportasi dengan nama', 3, 2, '{"objective": "Pemelajar dapat mengenali dan mencocokkan nama transportasi umum dengan gambar"}', NOW(), NOW()),
-- Roleplay for Level 2
('roleplay', 'Telepon dengan Driver Transportasi', 'Pemelajar dapat melakukan percakapan telepon sederhana dengan driver transportasi online', 'Roleplay telepon dengan driver ojek online', 4, 2, '{"objective": "Pemelajar dapat melakukan percakapan telepon sederhana dengan driver transportasi online"}', NOW(), NOW());

-- Level 3: 4 Quizzes + 1 Roleplay
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
VALUES
-- Quizzes for Level 3
('quiz', 'Cari Kos / Penginapan 1', 'Pemelajar dapat memahami konteks sederhana dari percakapan tentang mencari tempat tinggal', 'Quiz tentang mencari tempat tinggal', 1, 3, '{"objective": "Pemelajar dapat memahami konteks sederhana dari percakapan tentang mencari tempat tinggal"}', NOW(), NOW()),
('quiz', 'Cari Kos / Penginapan 2', 'Pemelajar dapat memahami informasi lokasi dari percakapan sederhana', 'Quiz tentang informasi lokasi tempat tinggal', 2, 3, '{"objective": "Pemelajar dapat memahami informasi lokasi dari percakapan sederhana"}', NOW(), NOW()),
('quiz', 'Telepon Hotel - Layanan Laundry', 'Pemelajar dapat memahami layanan sederhana dalam percakapan telepon hotel', 'Quiz tentang layanan hotel', 3, 3, '{"objective": "Pemelajar dapat memahami layanan sederhana dalam percakapan telepon hotel"}', NOW(), NOW()),
('quiz', 'Informasi Harga Kos', 'Pemelajar dapat memahami informasi harga dari teks iklan kos sederhana', 'Quiz tentang informasi harga kos', 4, 3, '{"objective": "Pemelajar dapat memahami informasi harga dari teks iklan kos sederhana"}', NOW(), NOW()),
-- Roleplay for Level 3
('roleplay', 'Registrasi di Asrama', 'Pemelajar dapat melakukan percakapan sederhana saat masuk ke asrama', 'Roleplay registrasi asrama', 5, 3, '{"objective": "Pemelajar dapat melakukan percakapan sederhana saat masuk ke asrama"}', NOW(), NOW());

-- Level 4: 2 Quizzes + 1 Roleplay
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
VALUES
('quiz', 'Cocokkan Makanan Indonesia', 'Pemelajar dapat mengenali dan mencocokkan makanan Indonesia', 'Quiz tentang makanan khas Indonesia', 1, 4, '{"objective": "Pemelajar dapat mengenali dan mencocokkan makanan Indonesia"}', NOW(), NOW()),
('quiz', 'Rasa Makanan', 'Pemelajar dapat mengenali rasa makanan berdasarkan deskripsi', 'Quiz tentang rasa makanan Indonesia', 2, 4, '{"objective": "Pemelajar dapat mengenali rasa makanan berdasarkan deskripsi"}', NOW(), NOW()),
('roleplay', 'Pesan Makanan di Warung', 'Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan', 'Roleplay memesan makanan di warung', 3, 4, '{"objective": "Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan"}', NOW(), NOW());

-- Level 5: 3 Quizzes + 1 Roleplay
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, metadata, "createdAt", "updatedAt")
VALUES
('quiz', 'Jumlah Barang di Supermarket', 'Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja', 'Quiz tentang jumlah barang belanja', 1, 5, '{"objective": "Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja"}', NOW(), NOW()),
('quiz', 'Tanggapi Informasi Harga', 'Pemelajar dapat menanggapi informasi harga dengan kalimat sederhana', 'Quiz tentang menanggapi harga', 2, 5, '{"objective": "Pemelajar dapat menanggapi informasi harga dengan kalimat sederhana"}', NOW(), NOW()),
('quiz', 'Pilih Metode Pembayaran', 'Pemelajar dapat memilih metode pembayaran sederhana di supermarket', 'Quiz tentang metode pembayaran', 3, 5, '{"objective": "Pemelajar dapat memilih metode pembayaran sederhana di supermarket"}', NOW(), NOW()),
('roleplay', 'Tawar Menawar di Pasar', 'Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana', 'Roleplay tawar menawar di pasar tradisional', 4, 5, '{"objective": "Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana"}', NOW(), NOW());

-- ========================================
-- 5. Insert Sample Quizzes and Quiz Options
-- ========================================

-- Quiz 1: Pilih Sapaan yang Tepat (content_item_id = 1)
INSERT INTO quizzes (question, explanation, content_item_id, metadata, "createdAt", "updatedAt")
VALUES
('Pilih sapaan yang tepat untuk pagi hari', 'Sapaan yang tepat untuk pagi hari adalah "Selamat pagi"', 1, '{}', NOW(), NOW())
RETURNING id;

-- Quiz Options for Quiz 1 (assuming quiz_id = 1)
INSERT INTO quiz_options (option_text, is_correct, quiz_id, metadata, "createdAt", "updatedAt")
VALUES
('Selamat pagi', TRUE, 1, '{}', NOW(), NOW()),
('Selamat siang', FALSE, 1, '{}', NOW(), NOW()),
('Selamat sore', FALSE, 1, '{}', NOW(), NOW()),
('Selamat malam', FALSE, 1, '{}', NOW(), NOW());

-- Quiz 2: Perkenalan Diri Sederhana (content_item_id = 2)
INSERT INTO quizzes (question, explanation, content_item_id, metadata, "createdAt", "updatedAt")
VALUES
('Bagaimana cara memperkenalkan nama dalam bahasa Indonesia?', 'Gunakan "Nama saya..." untuk memperkenalkan diri', 2, '{}', NOW(), NOW())
RETURNING id;

-- Quiz Options for Quiz 2 (assuming quiz_id = 2)
INSERT INTO quiz_options (option_text, is_correct, quiz_id, metadata, "createdAt", "updatedAt")
VALUES
('Nama saya Mario', TRUE, 2, '{}', NOW(), NOW()),
('Saya adalah Mario', FALSE, 2, '{}', NOW(), NOW()),
('Mario nama saya', FALSE, 2, '{}', NOW(), NOW()),
('Saya Mario', FALSE, 2, '{}', NOW(), NOW());

-- ========================================
-- 6. Insert Sample Roleplays and Roleplay Turns
-- ========================================

-- Roleplay 1: Perkenalan dengan Petugas Bandara (content_item_id = 4)
INSERT INTO roleplays (scenario, instructions, character_name, character_description, content_item_id, metadata, "createdAt", "updatedAt")
VALUES
('Mahasiswa internasional baru tiba di bandara Indonesia, bertemu petugas bandara dan memperkenalkan diri.', 'Berperan sebagai mahasiswa internasional yang baru tiba di Indonesia. Jawab pertanyaan petugas dengan sopan dan jelas.', 'Petugas Bandara', 'Petugas bandara yang ramah dan membantu mahasiswa internasional', 4, '{}', NOW(), NOW())
RETURNING id;

-- Roleplay Turns for Roleplay 1 (assuming roleplay_id = 1)
INSERT INTO roleplay_turns (speaker, message, turn_order, roleplay_id, metadata, "createdAt", "updatedAt")
VALUES
('character', 'Selamat pagi. Selamat datang di Indonesia.', 1, 1, '{}', NOW(), NOW()),
('user', 'Selamat pagi, Bu.', 2, 1, '{}', NOW(), NOW()),
('character', 'Nama kamu siapa?', 3, 1, '{}', NOW(), NOW()),
('user', 'Nama saya [nama].', 4, 1, '{}', NOW(), NOW()),
('character', 'Kamu dari negara mana?', 5, 1, '{}', NOW(), NOW()),
('user', 'Saya dari [negara].', 6, 1, '{}', NOW(), NOW()),
('character', 'Alamat kamu di Indonesia di mana?', 7, 1, '{}', NOW(), NOW()),
('user', 'Saya tinggal di [alamat].', 8, 1, '{}', NOW(), NOW()),
('character', 'Kapan tanggal lahirmu?', 9, 1, '{}', NOW(), NOW()),
('user', 'Tanggal [lahir].', 10, 1, '{}', NOW(), NOW()),
('character', 'Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.', 11, 1, '{}', NOW(), NOW()),
('user', 'Terima kasih, Bu.', 12, 1, '{}', NOW(), NOW());

-- Roleplay 2: Telepon dengan Driver Transportasi (content_item_id = 8)
INSERT INTO roleplays (scenario, instructions, character_name, character_description, content_item_id, metadata, "createdAt", "updatedAt")
VALUES
('Mahasiswa menelepon driver ojek online untuk menjemput dari kampus ke rumah.', 'Berperan sebagai mahasiswa yang ingin pulang dari kampus menggunakan ojek online. Komunikasikan lokasi dan tujuan dengan jelas.', 'Driver Ojek', 'Driver ojek online yang berpengalaman dan ramah', 8, '{}', NOW(), NOW())
RETURNING id;

-- Roleplay Turns for Roleplay 2 (assuming roleplay_id = 2)
INSERT INTO roleplay_turns (speaker, message, turn_order, roleplay_id, metadata, "createdAt", "updatedAt")
VALUES
('character', 'Halo, saya driver ojek online. Anda di mana sekarang?', 1, 2, '{}', NOW(), NOW()),
('user', 'Halo Bang, saya di kampus UI Depok.', 2, 2, '{}', NOW(), NOW()),
('character', 'Baik, mau ke mana tujuannya?', 3, 2, '{}', NOW(), NOW()),
('user', 'Ke apartemen Margonda Residence, Bang.', 4, 2, '{}', NOW(), NOW()),
('character', 'Oke, saya sudah di depan gerbang kampus. Pakai baju apa?', 5, 2, '{}', NOW(), NOW()),
('user', 'Saya pakai kemeja putih dan tas hitam.', 6, 2, '{}', NOW(), NOW()),
('character', 'Baik, saya lihat. Ongkosnya 15 ribu ya.', 7, 2, '{}', NOW(), NOW()),
('user', 'Oke Bang, terima kasih.', 8, 2, '{}', NOW(), NOW());

COMMIT;

-- ========================================
-- NOTES FOR MANUAL EXECUTION:
-- ========================================
-- 1. Replace 'PROGRAM_UUID_HERE' with the actual UUID returned from the first INSERT
-- 2. Update unit IDs in unit_levels INSERT based on actual returned IDs
-- 3. Update unit_level IDs in content_items INSERT based on actual returned IDs
-- 4. Update content_item IDs in quizzes and roleplays INSERT based on actual returned IDs
-- 5. Update quiz IDs and roleplay IDs in their respective child tables