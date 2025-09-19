-- Insert Level 2: Perkenalan (Roleplay)
-- This script creates Level 2 with roleplay content for introduction scenarios at the airport

BEGIN;

-- Insert Level 2
INSERT INTO levels (level, name, description, content_type, unit_id) VALUES (
    2,
    'Perkenalan',
    'Pemelajar dapat memperkenalkan diri secara sederhana kepada petugas bandara dengan sopan.',
    'roleplay',
    'a155edf4-6a65-4489-b1e0-6e144237201c'::uuid -- Same unit as level 1
);

-- Get the level_id for Level 2
-- We'll use this in the roleplay insertion
-- Level 2 ID will be generated, so we'll reference it in the roleplay

-- Insert Roleplay for Level 2: Airport Introduction Scenario
INSERT INTO roleplays (scenario, character_name, character_description, level_id) VALUES (
    'Mahasiswa internasional baru tiba di bandara Indonesia. Dia bertemu petugas bandara yang menyapanya dan menanyakan data diri.',
    'Petugas Bandara',
    'Jenis kelamin: Perempuan. Pakaian: Seragam resmi bandara berwarna biru tua, memakai name tag, rambut diikat rapi. Sikap: Ramah, formal tapi hangat, selalu menyapa dengan sopan.',
    (SELECT id FROM levels WHERE level = 2 AND name = 'Perkenalan' AND content_type = 'roleplay')
);

-- Insert Roleplay Turns for the Airport Introduction Scenario
INSERT INTO roleplay_turns (roleplay_id, turn_order, speaker, message) VALUES
-- Turn 1
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 1, 'character', 'Selamat pagi. Selamat datang di Indonesia.'),

-- Turn 2  
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 2, 'user', 'Selamat pagi, Bu.'),

-- Turn 3
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 3, 'character', 'Nama kamu siapa?'),

-- Turn 4
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 4, 'user', 'Nama saya [nama].'),

-- Turn 5
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 5, 'character', 'Kamu dari negara mana?'),

-- Turn 6
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 6, 'user', 'Saya dari [negara].'),

-- Turn 7
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 7, 'character', 'Alamat kamu di Indonesia di mana?'),

-- Turn 8
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 8, 'user', 'Saya tinggal di [alamat].'),

-- Turn 9
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 9, 'character', 'Kapan tanggal lahirmu?'),

-- Turn 10
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 10, 'user', 'Tanggal [lahir].'),

-- Turn 11
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 11, 'character', 'Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.'),

-- Turn 12
((SELECT id FROM roleplays WHERE scenario LIKE 'Mahasiswa internasional baru tiba di bandara%'), 12, 'user', 'Terima kasih, Bu.');

COMMIT;

-- Verification queries
SELECT 'Level 2 created successfully' AS status;
SELECT COUNT(*) AS level_count FROM levels WHERE level = 2;
SELECT COUNT(*) AS roleplay_count FROM roleplays WHERE level_id = (SELECT id FROM levels WHERE level = 2 AND content_type = 'roleplay');
SELECT COUNT(*) AS turn_count FROM roleplay_turns WHERE roleplay_id IN (SELECT id FROM roleplays WHERE level_id = (SELECT id FROM levels WHERE level = 2 AND content_type = 'roleplay'));