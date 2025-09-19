```sql
BEGIN;

-- ========================================
-- 1. Insert the Program (BIPA 1)
-- ========================================
INSERT INTO programs (code, name, metadata, created_at, updated_at)
VALUES ('BIPA 1', 'Bahasa Indonesia untuk Penutur Asing Level 1', '{}', NOW(), NOW())
RETURNING program_id;

-- Assume the returned program_id = 1
-- ========================================

-- ========================================
-- 2. Insert Units
-- ========================================
INSERT INTO units (program_id, code, title, position, metadata, created_at, updated_at)
VALUES 
(1, 'U1', 'Perkenalan', 1, '{}', NOW(), NOW()),
(1, 'U2', 'Transportasi', 2, '{}', NOW(), NOW()),
(1, 'U3', 'Tempat Tinggal', 3, '{}', NOW(), NOW()),
(1, 'U4', 'Makanan Khas Jakarta', 4, '{}', NOW(), NOW()),
(1, 'U5', 'Berbelanja', 5, '{}', NOW(), NOW())
RETURNING unit_id;

-- Let's assume these IDs:
-- Perkenalan = 1
-- Transportasi = 2
-- Tempat Tinggal = 3
-- Makanan = 4
-- Berbelanja = 5
-- ========================================

-- ========================================
-- 3. Insert Levels per Unit
-- ========================================
INSERT INTO unit_levels (unit_id, name, position, metadata, created_at, updated_at)
VALUES
(1, 'Level 1 - Perkenalan', 1, '{}', NOW(), NOW()),
(2, 'Level 2 - Transportasi', 2, '{}', NOW(), NOW()),
(3, 'Level 3 - Tempat Tinggal', 3, '{}', NOW(), NOW()),
(4, 'Level 4 - Makanan Khas Jakarta', 4, '{}', NOW(), NOW()),
(5, 'Level 5 - Berbelanja', 5, '{}', NOW(), NOW())
RETURNING level_id;

-- Assume level IDs:
-- Level 1 = 1
-- Level 2 = 2
-- Level 3 = 3
-- Level 4 = 4
-- Level 5 = 5
-- ========================================

-- ========================================
-- 4. Insert Content Items
-- ========================================
-- Level 1: 3 Quizzes + 1 Roleplay
INSERT INTO content_items (level_id, content_type, position, title, objective, prompt_text, metadata, created_at, updated_at)
VALUES
-- Quizzes
(1, 'quiz', 1, 'Pilih Sapaan yang Tepat', 'Pemelajar dapat mengenali dan memilih sapaan yang sesuai dengan konteks waktu', NULL, '{}', NOW(), NOW()),
(1, 'quiz', 2, 'Video Perkenalan Diri', 'Pemelajar dapat memahami pernyataan sederhana untuk memperkenalkan diri', NULL, '{}', NOW(), NOW()),
(1, 'quiz', 3, 'Isi Formulir Data Diri', 'Pemelajar dapat melengkapi formulir data diri sederhana', NULL, '{}', NOW(), NOW()),
-- Roleplay
(1, 'roleplay', 4, 'Perkenalan dengan Petugas Bandara', 'Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara', NULL, '{}', NOW(), NOW());

-- ========================================
-- Level 2: 3 Quizzes + 1 Roleplay
INSERT INTO content_items (level_id, content_type, position, title, objective, prompt_text, metadata, created_at, updated_at)
VALUES
-- Quizzes
(2, 'quiz', 1, 'Kenali Transportasi Umum', 'Pemelajar dapat mengenali kosakata transportasi umum melalui gambar', NULL, '{}', NOW(), NOW()),
(2, 'quiz', 2, 'Audio Transportasi Umum', 'Pemelajar dapat mengenali jenis transportasi umum berdasarkan suara khasnya', NULL, '{}', NOW(), NOW()),
(2, 'quiz', 3, 'Cocokkan Gambar dan Nama Transportasi', 'Pemelajar dapat mengenali dan mencocokkan nama transportasi umum dengan gambar', NULL, '{}', NOW(), NOW()),
-- Roleplay
(2, 'roleplay', 4, 'Telepon dengan Driver Transportasi', 'Pemelajar dapat melakukan percakapan telepon sederhana dengan driver transportasi online', NULL, '{}', NOW(), NOW());

-- ========================================
-- Level 3: 4 Quizzes + 1 Roleplay
INSERT INTO content_items (level_id, content_type, position, title, objective, prompt_text, metadata, created_at, updated_at)
VALUES
-- Quizzes
(3, 'quiz', 1, 'Cari Kos / Penginapan 1', 'Pemelajar dapat memahami konteks sederhana dari percakapan tentang mencari tempat tinggal', NULL, '{}', NOW(), NOW()),
(3, 'quiz', 2, 'Cari Kos / Penginapan 2', 'Pemelajar dapat memahami informasi lokasi dari percakapan sederhana', NULL, '{}', NOW(), NOW()),
(3, 'quiz', 3, 'Telepon Hotel - Layanan Laundry', 'Pemelajar dapat memahami layanan sederhana dalam percakapan telepon hotel', NULL, '{}', NOW(), NOW()),
(3, 'quiz', 4, 'Informasi Harga Kos', 'Pemelajar dapat memahami informasi harga dari teks iklan kos sederhana', NULL, '{}', NOW(), NOW()),
-- Roleplay
(3, 'roleplay', 5, 'Registrasi di Asrama', 'Pemelajar dapat melakukan percakapan sederhana saat masuk ke asrama', NULL, '{}', NOW(), NOW());

-- ========================================
-- Level 4: 2 Quizzes + 1 Roleplay
INSERT INTO content_items (level_id, content_type, position, title, objective, prompt_text, metadata, created_at, updated_at)
VALUES
(4, 'quiz', 1, 'Cocokkan Makanan Indonesia', 'Pemelajar dapat mengenali dan mencocokkan makanan Indonesia', NULL, '{}', NOW(), NOW()),
(4, 'quiz', 2, 'Video Rasa Makanan', 'Pemelajar dapat mengenali rasa makanan berdasarkan reaksi orang', NULL, '{}', NOW(), NOW()),
(4, 'roleplay', 3, 'Pesan Makanan di Warung', 'Pemelajar dapat memesan makanan/minuman dan memahami percakapan tentang kebiasaan makan', NULL, '{}', NOW(), NOW());

-- ========================================
-- Level 5: 3 Quizzes + 1 Roleplay
INSERT INTO content_items (level_id, content_type, position, title, objective, prompt_text, metadata, created_at, updated_at)
VALUES
(5, 'quiz', 1, 'Jumlah Barang di Supermarket', 'Pemelajar dapat menyebutkan jumlah barang sederhana dalam transaksi belanja', NULL, '{}', NOW(), NOW()),
(5, 'quiz', 2, 'Tanggapi Informasi Harga', 'Pemelajar dapat menanggapi informasi harga dengan kalimat sederhana', NULL, '{}', NOW(), NOW()),
(5, 'quiz', 3, 'Pilih Metode Pembayaran', 'Pemelajar dapat memilih metode pembayaran sederhana di supermarket', NULL, '{}', NOW(), NOW()),
(5, 'roleplay', 4, 'Tawar Menawar di Pasar', 'Pemelajar dapat menawar harga dan menyelesaikan transaksi sederhana', NULL, '{}', NOW(), NOW());

-- ========================================
-- 5. Insert Quizzes (Example for Level 1 - Multiple Choice)
-- ========================================
INSERT INTO quizzes (content_id, quiz_type, question_text, metadata)
VALUES
(1, 'multiple_choice', 'Pilih sapaan yang tepat berdasarkan konteks waktu', '{}');

-- Insert quiz options for this quiz
INSERT INTO quiz_options (quiz_id, text, is_correct, position)
VALUES
(1, 'Selamat pagi', TRUE, 1),
(1, 'Selamat siang', FALSE, 2),
(1, 'Selamat sore', FALSE, 3),
(1, 'Selamat malam', FALSE, 4);

-- ========================================
-- Example for Video Comprehension (Level 1)
INSERT INTO quizzes (content_id, quiz_type, question_text, metadata)
VALUES
(2, 'video_comprehension', 'Artinya orang tersebut mengatakan apa?', '{}');

INSERT INTO quiz_options (quiz_id, text, is_correct, position)
VALUES
(2, 'My name is Mario. I am from Brazil.', TRUE, 1),
(2, 'My name is Mario. I live in Jakarta.', FALSE, 2),
(2, 'My name is Mario. I am a student.', FALSE, 3),
(2, 'My name is Mario. I am from Spain.', FALSE, 4);

-- ========================================
-- 6. Insert Roleplay Example (Level 1)
-- ========================================
INSERT INTO roleplays (content_id, scenario_text, metadata)
VALUES
(4, 'Mahasiswa internasional baru tiba di bandara Indonesia, bertemu petugas bandara dan memperkenalkan diri.', '{}');

-- Roleplay turns (AI & User dialog)
INSERT INTO roleplay_turns (roleplay_id, position, speaker, text)
VALUES
(1, 1, 'ai', 'Selamat pagi. Selamat datang di Indonesia.'),
(1, 2, 'user', 'Selamat pagi, Bu.'),
(1, 3, 'ai', 'Nama kamu siapa?'),
(1, 4, 'user', 'Nama saya [nama].'),
(1, 5, 'ai', 'Kamu dari negara mana?'),
(1, 6, 'user', 'Saya dari [negara].'),
(1, 7, 'ai', 'Alamat kamu di Indonesia di mana?'),
(1, 8, 'user', 'Saya tinggal di [alamat].'),
(1, 9, 'ai', 'Kapan tanggal lahirmu?'),
(1, 10, 'user', 'Tanggal [lahir].'),
(1, 11, 'ai', 'Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.'),
(1, 12, 'user', 'Terima kasih, Bu.');

COMMIT;
```