import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContentItemTable1758224000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum for content types
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type_enum') THEN
          CREATE TYPE content_type_enum AS ENUM ('form', 'roleplay');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS content_items (
        id SERIAL PRIMARY KEY,
        content_type content_type_enum NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        position INTEGER NOT NULL,
        unit_level_id INTEGER NOT NULL REFERENCES unit_levels(id) ON DELETE CASCADE,
        media_asset_id INTEGER REFERENCES media_assets(id) ON DELETE SET NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        deleted_at TIMESTAMPTZ,
        UNIQUE(unit_level_id, position)
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_content_items_unit_level_id" ON content_items (unit_level_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_content_items_content_type" ON content_items (content_type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('content_items');
    await queryRunner.query(`DROP TYPE IF EXISTS "content_type_enum"`);
  }
}
