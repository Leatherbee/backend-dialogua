-- BIPA 1 Data Insertion with Proper Hierarchical Structure
-- This script implements the learning hierarchy:
-- Level (Program) > Topic (Unit) > Unit Level > Content Type > Quiz Type

BEGIN;

-- Insert Program (Level)
INSERT INTO programs (title, description, created_at, updated_at) VALUES 
('Bahasa Indonesia untuk Penutur Asing Level 1', 'Begin your journey in Indonesian by learning greetings, introductions, and essential everyday expressions.', NOW(), NOW());

-- Get the program ID
DO $$
DECLARE
    program_id INTEGER;
    unit_id INTEGER;
    unit_level_1_id INTEGER;
    unit_level_2_id INTEGER;
    content_item_id INTEGER;
    quiz_id INTEGER;
    roleplay_id INTEGER;
BEGIN
    -- Get program ID
    SELECT id INTO program_id FROM programs WHERE title = 'Bahasa Indonesia untuk Penutur Asing Level 1';

    -- Insert Units (Topics)
    INSERT INTO units (program_id, title, description, order_index, created_at, updated_at) VALUES 
    (program_id, 'Perkenalan', 'Introduction and basic greetings', 1, NOW(), NOW()),
    (program_id, 'Transportasi', 'Transportation and travel', 2, NOW(), NOW()),
    (program_id, 'Tempat Tinggal', 'Housing and accommodation', 3, NOW(), NOW()),
    (program_id, 'Makanan Khas Jakarta', 'Jakarta traditional food', 4, NOW(), NOW()),
    (program_id, 'Berbelanja', 'Shopping and transactions', 5, NOW(), NOW());

    -- UNIT 1: PERKENALAN (Introduction) - 2 LEVELS
    SELECT id INTO unit_id FROM units WHERE title = 'Perkenalan' AND program_id = program_id;
    
    -- Unit 1 Level 1: Quiz Content Only (3 Quiz Types)
    INSERT INTO unit_levels (unit_id, level, name, description, created_at, updated_at) VALUES 
    (unit_id, 1, 'Unit 1 Level 1 - Quiz Perkenalan', 'Quiz-based introduction exercises', NOW(), NOW());
    
    SELECT id INTO unit_level_1_id FROM unit_levels WHERE unit_id = unit_id AND level = 1;
    
    -- Unit 1 Level 2: Roleplay Content Only
    INSERT INTO unit_levels (unit_id, level, name, description, created_at, updated_at) VALUES 
    (unit_id, 2, 'Unit 1 Level 2 - Praktik Perkenalan', 'Interactive roleplay practice', NOW(), NOW());
    
    SELECT id INTO unit_level_2_id FROM unit_levels WHERE unit_id = unit_id AND level = 2;

    -- UNIT 1 LEVEL 1 CONTENT: 3 QUIZ TYPES
    -- Quiz Type 1: Multiple Choice
    INSERT INTO content_items (unit_level_id, content_type, title, description, position, created_at, updated_at) VALUES 
    (unit_level_1_id, 'quiz', 'Pilih Sapaan yang Tepat', 'Multiple choice quiz about appropriate greetings', 1, NOW(), NOW());
    
    SELECT id INTO content_item_id FROM content_items WHERE title = 'Pilih Sapaan yang Tepat' AND unit_level_id = unit_level_1_id;
    
    INSERT INTO quizzes (content_item_id, question, explanation, created_at, updated_at) VALUES 
    (content_item_id, 'Pilih sapaan yang tepat untuk pagi hari:', 'Sapaan yang tepat di pagi hari adalah "Selamat pagi"', NOW(), NOW());
    
    SELECT id INTO quiz_id FROM quizzes WHERE content_item_id = content_item_id;
    
    INSERT INTO quiz_options (quiz_id, option_text, is_correct, created_at, updated_at) VALUES 
    (quiz_id, 'Selamat pagi', true, NOW(), NOW()),
    (quiz_id, 'Selamat siang', false, NOW(), NOW()),
    (quiz_id, 'Selamat malam', false, NOW(), NOW()),
    (quiz_id, 'Halo', false, NOW(), NOW());

    -- Quiz Type 2: Video Comprehension
    INSERT INTO content_items (unit_level_id, content_type, title, description, position, created_at, updated_at) VALUES 
    (unit_level_1_id, 'quiz', 'Perkenalan Diri Sederhana', 'Video comprehension quiz about self-introduction', 2, NOW(), NOW());
    
    SELECT id INTO content_item_id FROM content_items WHERE title = 'Perkenalan Diri Sederhana' AND unit_level_id = unit_level_1_id;
    
    INSERT INTO quizzes (content_item_id, question, explanation, created_at, updated_at) VALUES 
    (content_item_id, 'Setelah menonton video, siapa nama orang dalam video tersebut?', 'Dalam video, orang tersebut memperkenalkan diri sebagai Budi', NOW(), NOW());
    
    SELECT id INTO quiz_id FROM quizzes WHERE content_item_id = content_item_id;
    
    INSERT INTO quiz_options (quiz_id, option_text, is_correct, created_at, updated_at) VALUES 
    (quiz_id, 'Budi', true, NOW(), NOW()),
    (quiz_id, 'Andi', false, NOW(), NOW()),
    (quiz_id, 'Sari', false, NOW(), NOW()),
    (quiz_id, 'Dina', false, NOW(), NOW());

    -- Quiz Type 3: Form Filling
    INSERT INTO content_items (unit_level_id, content_type, title, description, position, created_at, updated_at) VALUES 
    (unit_level_1_id, 'quiz', 'Isi Formulir Data Diri', 'Form filling exercise for personal data', 3, NOW(), NOW());
    
    SELECT id INTO content_item_id FROM content_items WHERE title = 'Isi Formulir Data Diri' AND unit_level_id = unit_level_1_id;
    
    INSERT INTO quizzes (content_item_id, question, explanation, created_at, updated_at) VALUES 
    (content_item_id, 'Lengkapi formulir berikut dengan data diri Anda:', 'Formulir harus diisi dengan informasi pribadi yang benar', NOW(), NOW());
    
    SELECT id INTO quiz_id FROM quizzes WHERE content_item_id = content_item_id;
    
    INSERT INTO quiz_options (quiz_id, option_text, is_correct, created_at, updated_at) VALUES 
    (quiz_id, 'Nama: [Input Field]', true, NOW(), NOW()),
    (quiz_id, 'Umur: [Input Field]', true, NOW(), NOW()),
    (quiz_id, 'Asal: [Input Field]', true, NOW(), NOW());

    -- UNIT 1 LEVEL 2 CONTENT: ROLEPLAY ONLY
    INSERT INTO content_items (unit_level_id, content_type, title, description, position, created_at, updated_at) VALUES 
    (unit_level_2_id, 'roleplay', 'Perkenalan dengan Petugas Bandara', 'Interactive roleplay scenario at airport', 1, NOW(), NOW());
    
    SELECT id INTO content_item_id FROM content_items WHERE title = 'Perkenalan dengan Petugas Bandara' AND unit_level_id = unit_level_2_id;
    
    INSERT INTO roleplays (content_item_id, scenario, role_description, created_at, updated_at) VALUES 
    (content_item_id, 'Anda baru tiba di bandara Indonesia dan bertemu dengan petugas imigrasi', 'Berperan sebagai turis yang baru tiba di Indonesia', NOW(), NOW());
    
    SELECT id INTO roleplay_id FROM roleplays WHERE content_item_id = content_item_id;
    
    INSERT INTO roleplay_turns (roleplay_id, turn_number, speaker, message, created_at, updated_at) VALUES 
    (roleplay_id, 1, 'system', 'Petugas: Selamat datang di Indonesia. Boleh saya lihat paspor Anda?', NOW(), NOW()),
    (roleplay_id, 2, 'user', 'Ini paspor saya. Saya dari [negara asal].', NOW(), NOW()),
    (roleplay_id, 3, 'system', 'Petugas: Terima kasih. Apa tujuan kunjungan Anda ke Indonesia?', NOW(), NOW()),
    (roleplay_id, 4, 'user', 'Saya datang untuk berlibur dan belajar bahasa Indonesia.', NOW(), NOW());

    -- UNITS 2-5: Single level each (maintaining existing structure)
    -- Unit 2: Transportasi
    SELECT id INTO unit_id FROM units WHERE title = 'Transportasi' AND program_id = program_id;
    INSERT INTO unit_levels (unit_id, level, name, description, created_at, updated_at) VALUES 
    (unit_id, 1, 'Unit 2 - Transportasi', 'Transportation and travel', NOW(), NOW());
    
    -- Unit 3: Tempat Tinggal  
    SELECT id INTO unit_id FROM units WHERE title = 'Tempat Tinggal' AND program_id = program_id;
    INSERT INTO unit_levels (unit_id, level, name, description, created_at, updated_at) VALUES 
    (unit_id, 1, 'Unit 3 - Tempat Tinggal', 'Housing and accommodation', NOW(), NOW());
    
    -- Unit 4: Makanan Khas Jakarta
    SELECT id INTO unit_id FROM units WHERE title = 'Makanan Khas Jakarta' AND program_id = program_id;
    INSERT INTO unit_levels (unit_id, level, name, description, created_at, updated_at) VALUES 
    (unit_id, 1, 'Unit 4 - Makanan Khas Jakarta', 'Jakarta traditional food', NOW(), NOW());
    
    -- Unit 5: Berbelanja
    SELECT id INTO unit_id FROM units WHERE title = 'Berbelanja' AND program_id = program_id;
    INSERT INTO unit_levels (unit_id, level, name, description, created_at, updated_at) VALUES 
    (unit_id, 1, 'Unit 5 - Berbelanja', 'Shopping and transactions', NOW(), NOW());

END $$;

COMMIT;

-- Summary of inserted data:
-- 1 Program: Bahasa Indonesia untuk Penutur Asing Level 1
-- 5 Units: Perkenalan, Transportasi, Tempat Tinggal, Makanan Khas Jakarta, Berbelanja
-- 6 Unit Levels: Unit 1 has 2 levels (Level 1: Quizzes, Level 2: Roleplay), Units 2-5 have 1 level each
-- 4 Content Items: 3 quizzes (different types) in Unit 1 Level 1, 1 roleplay in Unit 1 Level 2
-- 3 Quizzes with 11 quiz options total
-- 1 Roleplay with 4 roleplay turns