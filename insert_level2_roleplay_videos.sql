-- Insert Level 2 Roleplay Videos Script
-- This script inserts all 6 level-2 roleplay videos (level2_quiz1a through level2_quiz1f)
-- into the database for iOS app testing
-- Level 2 is about "Perkenalan" (Introduction) at the airport

BEGIN;

-- First, let's get the unit_level_id for Level 2 (Perkenalan)
-- We know from our check that it's ID 2, but let's be explicit

-- Step 1: Insert Media Assets for all 6 videos
INSERT INTO media_assets (media_type, url, duration_sec, transcript, metadata, "createdAt", "updatedAt")
VALUES 
-- Video 1a: Initial greeting at airport
('video', '/assets/level-2/videos/roleplay/level2_quiz1a.mp4', 45, 
'Petugas: Selamat pagi. Selamat datang di Indonesia.
User: Selamat pagi, Bu.
Petugas: Nama kamu siapa?
User: Nama saya [nama].', 
'{"scenario": "airport_greeting", "difficulty": "beginner", "video_type": "roleplay"}', NOW(), NOW()),

-- Video 1b: Country of origin question
('video', '/assets/level-2/videos/roleplay/level2_quiz1b.mp4', 50,
'Petugas: Kamu dari negara mana?
User: Saya dari [negara].
Petugas: Oh, bagus. Selamat datang.',
'{"scenario": "country_origin", "difficulty": "beginner", "video_type": "roleplay"}', NOW(), NOW()),

-- Video 1c: Address in Indonesia
('video', '/assets/level-2/videos/roleplay/level2_quiz1c.mp4', 55,
'Petugas: Alamat kamu di Indonesia di mana?
User: Saya tinggal di [alamat].
Petugas: Baik, saya catat.',
'{"scenario": "address_inquiry", "difficulty": "beginner", "video_type": "roleplay"}', NOW(), NOW()),

-- Video 1d: Birth date question
('video', '/assets/level-2/videos/roleplay/level2_quiz1d.mp4', 40,
'Petugas: Kapan tanggal lahirmu?
User: Tanggal [lahir].
Petugas: Terima kasih.',
'{"scenario": "birth_date", "difficulty": "beginner", "video_type": "roleplay"}', NOW(), NOW()),

-- Video 1e: Purpose of visit
('video', '/assets/level-2/videos/roleplay/level2_quiz1e.mp4', 60,
'Petugas: Tujuan kamu ke Indonesia untuk apa?
User: Saya mau kuliah di [universitas].
Petugas: Wah, bagus sekali. Semoga sukses.',
'{"scenario": "purpose_visit", "difficulty": "intermediate", "video_type": "roleplay"}', NOW(), NOW()),

-- Video 1f: Final farewell
('video', '/assets/level-2/videos/roleplay/level2_quiz1f.mp4', 45,
'Petugas: Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.
User: Terima kasih, Bu.
Petugas: Sama-sama. Selamat beraktivitas.',
'{"scenario": "farewell", "difficulty": "beginner", "video_type": "roleplay"}', NOW(), NOW())
RETURNING id;

-- Step 2: Insert Content Items for each roleplay scenario
-- We'll use the media asset IDs that were just created
WITH media_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM media_assets 
  WHERE url LIKE '%level2_quiz1%' 
  ORDER BY id DESC 
  LIMIT 6
)
INSERT INTO content_items (content_type, title, description, content, position, unit_level_id, media_asset_id, metadata, "createdAt", "updatedAt")
SELECT 
  'roleplay'::content_items_content_type_enum,
  scenario_data.title,
  scenario_data.description,
  scenario_data.content,
  scenario_data.pos + 4, -- Start after existing content (position 4 was the last)
  2, -- unit_level_id for Level 2 Perkenalan
  m.id,
  scenario_data.metadata::jsonb,
  NOW(),
  NOW()
FROM media_ids m
JOIN (VALUES 
  (1, 'Sapaan Awal di Bandara', 'Pemelajar dapat menyapa petugas bandara dengan sopan', 'Roleplay sapaan awal dan perkenalan nama di bandara', 1, '{"objective": "Pemelajar dapat menyapa petugas bandara dengan sopan", "scenario_type": "airport_greeting"}'),
  (2, 'Menyebutkan Asal Negara', 'Pemelajar dapat menyebutkan negara asal dengan jelas', 'Roleplay menjawab pertanyaan tentang negara asal', 2, '{"objective": "Pemelajar dapat menyebutkan negara asal dengan jelas", "scenario_type": "country_origin"}'),
  (3, 'Memberikan Alamat di Indonesia', 'Pemelajar dapat memberikan informasi alamat tempat tinggal di Indonesia', 'Roleplay memberikan alamat tempat tinggal kepada petugas', 3, '{"objective": "Pemelajar dapat memberikan informasi alamat tempat tinggal di Indonesia", "scenario_type": "address_inquiry"}'),
  (4, 'Menyebutkan Tanggal Lahir', 'Pemelajar dapat menyebutkan tanggal lahir dengan format yang benar', 'Roleplay menjawab pertanyaan tentang tanggal lahir', 4, '{"objective": "Pemelajar dapat menyebutkan tanggal lahir dengan format yang benar", "scenario_type": "birth_date"}'),
  (5, 'Menjelaskan Tujuan Kunjungan', 'Pemelajar dapat menjelaskan tujuan kedatangan ke Indonesia', 'Roleplay menjelaskan tujuan kuliah di Indonesia', 5, '{"objective": "Pemelajar dapat menjelaskan tujuan kedatangan ke Indonesia", "scenario_type": "purpose_visit"}'),
  (6, 'Ucapan Perpisahan', 'Pemelajar dapat mengucapkan terima kasih dan perpisahan dengan sopan', 'Roleplay ucapan terima kasih dan perpisahan di akhir percakapan', 6, '{"objective": "Pemelajar dapat mengucapkan terima kasih dan perpisahan dengan sopan", "scenario_type": "farewell"}')
) AS scenario_data(rn, title, description, content, pos, metadata) ON m.rn = scenario_data.rn
RETURNING id, title;

-- Step 3: Insert Roleplay entities for each content item
WITH content_ids AS (
  SELECT id, title, ROW_NUMBER() OVER (ORDER BY id) as rn 
  FROM content_items 
  WHERE unit_level_id = 2 AND content_type = 'roleplay' AND title LIKE '%Driver%' = false
  ORDER BY id DESC 
  LIMIT 6
)
INSERT INTO roleplays (scenario, character_description, content_item_id, "createdAt", "updatedAt")
SELECT 
  roleplay_data.scenario,
  roleplay_data.character_description,
  c.id,
  NOW(),
  NOW()
FROM content_ids c
JOIN (VALUES 
  (1, 'Mahasiswa internasional baru tiba di bandara Indonesia dan bertemu petugas bandara untuk perkenalan awal', 'Petugas bandara perempuan yang ramah, formal tapi hangat, memakai seragam resmi biru tua dengan name tag, selalu menyapa dengan sopan'),
  (2, 'Petugas bandara menanyakan negara asal mahasiswa internasional', 'Petugas bandara yang berpengalaman menangani mahasiswa internasional, sabar dan membantu'),
  (3, 'Petugas bandara meminta informasi alamat tempat tinggal di Indonesia', 'Petugas bandara yang teliti dalam mencatat data mahasiswa internasional untuk keperluan administrasi'),
  (4, 'Petugas bandara menanyakan tanggal lahir untuk verifikasi identitas', 'Petugas bandara yang profesional dalam melakukan verifikasi data pribadi'),
  (5, 'Petugas bandara menanyakan tujuan kedatangan mahasiswa ke Indonesia', 'Petugas bandara yang ramah dan tertarik mengetahui latar belakang mahasiswa internasional'),
  (6, 'Petugas bandara memberikan ucapan selamat datang dan perpisahan yang hangat', 'Petugas bandara yang ramah dan memberikan kesan pertama yang baik tentang Indonesia')
) AS roleplay_data(rn, scenario, character_description) ON c.rn = roleplay_data.rn
RETURNING id, scenario;

-- Step 4: Insert Roleplay Turns for each roleplay
-- This creates the conversation flow for each scenario
WITH roleplay_ids AS (
  SELECT r.id, r.scenario, ROW_NUMBER() OVER (ORDER BY r.id) as rn 
  FROM roleplays r
  JOIN content_items ci ON r.content_item_id = ci.id
  WHERE ci.unit_level_id = 2 AND ci.content_type = 'roleplay' AND ci.title NOT LIKE '%Driver%'
  ORDER BY r.id DESC 
  LIMIT 6
)
INSERT INTO roleplay_turns (roleplay_id, speaker, message, turn_order, "createdAt", "updatedAt")
SELECT 
  r.id,
  turn_data.speaker,
  turn_data.message,
  turn_data.turn_order,
  NOW(),
  NOW()
FROM roleplay_ids r
JOIN (VALUES 
  -- Scenario 1: Sapaan Awal di Bandara
  (1, 'character', 'Selamat pagi. Selamat datang di Indonesia.', 1),
  (1, 'user', 'Selamat pagi, Bu.', 2),
  (1, 'character', 'Nama kamu siapa?', 3),
  (1, 'user', 'Nama saya [nama].', 4),
  
  -- Scenario 2: Menyebutkan Asal Negara  
  (2, 'character', 'Kamu dari negara mana?', 1),
  (2, 'user', 'Saya dari [negara].', 2),
  (2, 'character', 'Oh, dari [negara]. Jauh sekali ya. Pertama kali ke Indonesia?', 3),
  (2, 'user', 'Iya Bu, pertama kali.', 4),
  
  -- Scenario 3: Memberikan Alamat di Indonesia
  (3, 'character', 'Alamat kamu di Indonesia di mana?', 1),
  (3, 'user', 'Saya tinggal di [alamat].', 2),
  (3, 'character', 'Baik, saya catat ya. Kamu tinggal sendiri atau dengan teman?', 3),
  (3, 'user', 'Saya tinggal dengan teman, Bu.', 4),
  
  -- Scenario 4: Menyebutkan Tanggal Lahir
  (4, 'character', 'Kapan tanggal lahirmu?', 1),
  (4, 'user', 'Tanggal [lahir].', 2),
  (4, 'character', 'Baik, umur kamu berapa sekarang?', 3),
  (4, 'user', 'Saya berumur [umur] tahun, Bu.', 4),
  
  -- Scenario 5: Menjelaskan Tujuan Kunjungan
  (5, 'character', 'Kamu ke Indonesia untuk apa?', 1),
  (5, 'user', 'Saya mau kuliah di Indonesia, Bu.', 2),
  (5, 'character', 'Wah bagus. Kuliah di universitas mana?', 3),
  (5, 'user', 'Di [nama universitas], Bu.', 4),
  
  -- Scenario 6: Ucapan Perpisahan
  (6, 'character', 'Baik, terima kasih. Selamat datang dan semoga betah di Indonesia.', 1),
  (6, 'user', 'Terima kasih, Bu.', 2),
  (6, 'character', 'Selamat belajar ya. Semoga sukses kuliahnya.', 3),
  (6, 'user', 'Amin, terima kasih banyak, Bu.', 4)
) AS turn_data(scenario_rn, speaker, message, turn_order) ON r.rn = turn_data.scenario_rn
RETURNING roleplay_id, speaker, message;

-- Commit the transaction
COMMIT;

-- Verification queries to check the inserted data
SELECT 'Media Assets Created:' as info;
SELECT ma.id, ma.media_type, ma.url, ma.duration_sec 
FROM media_assets ma 
WHERE ma.url LIKE '%level2_quiz1%' 
ORDER BY ma.url;

SELECT 'Content Items Created:' as info;
SELECT ci.id, ci.content_type, ci.title, ci.position 
FROM content_items ci 
WHERE ci.unit_level_id = 2 AND ci.content_type = 'roleplay' 
ORDER BY ci.position;

SELECT 'Roleplays Created:' as info;
SELECT r.id, LEFT(r.scenario, 50) as scenario_preview, ci.title 
FROM roleplays r 
JOIN content_items ci ON r.content_item_id = ci.id 
WHERE ci.unit_level_id = 2 
ORDER BY ci.position;

SELECT 'Roleplay Turns Created:' as info;
SELECT COUNT(*) as total_turns, r.id as roleplay_id, ci.title 
FROM roleplay_turns rt 
JOIN roleplays r ON rt.roleplay_id = r.id 
JOIN content_items ci ON r.content_item_id = ci.id 
WHERE ci.unit_level_id = 2 
GROUP BY r.id, ci.title 
ORDER BY r.id;