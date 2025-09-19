import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleplayTable1758224000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roleplays (
        id SERIAL PRIMARY KEY,
        scenario VARCHAR(500) NOT NULL,
        instructions TEXT,
        character_name VARCHAR(255),
        character_description TEXT,
        content_item_id INTEGER NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        deleted_at TIMESTAMPTZ
      )
    `);

    // Create index on content_item_id for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_roleplays_content_item_id" ON roleplays (content_item_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roleplays');
  }
}
