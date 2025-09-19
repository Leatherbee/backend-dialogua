-- Insert Level 1 Media Assets and Update Content Items
-- This script adds media assets for Level 1 content and links them to existing content items

BEGIN;

-- Insert media assets for Level 1
INSERT INTO media_assets (media_type, url, metadata) VALUES
('image', '/assets/level-1/images/level1_quiz1.png', '{"description": "Image for Level 1 Quiz 1 - Pilih Sapaan yang Tepat"}'),
('video', '/assets/level-1/videos/level1_quiz2.mp4', '{"description": "Video for Level 1 Quiz 2 - Perkenalan Diri Sederhana"}');

-- Update content items to link with media assets
UPDATE content_items 
SET media_asset_id = (SELECT id FROM media_assets WHERE url = '/assets/level-1/images/level1_quiz1.png')
WHERE id = 1;

UPDATE content_items 
SET media_asset_id = (SELECT id FROM media_assets WHERE url = '/assets/level-1/videos/level1_quiz2.mp4')
WHERE id = 2;

-- Verify the insertions
SELECT 
  ci.id,
  ci.content_type,
  ci.title,
  ci.position,
  ma.media_type,
  ma.url
FROM content_items ci
LEFT JOIN media_assets ma ON ci.media_asset_id = ma.id
WHERE ci.unit_level_id = 1
ORDER BY ci.position;

COMMIT;