import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContentTypeToLevels1758305800000 implements MigrationInterface {
  name = 'AddContentTypeToLevels1758305800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the content_type enum if it doesn't exist
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE content_type_enum AS ENUM ('quiz', 'roleplay');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // Add content_type column to levels table
    await queryRunner.query(`
      ALTER TABLE "levels" 
      ADD COLUMN "content_type" content_type_enum
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove content_type column from levels table
    await queryRunner.query(`
      ALTER TABLE "levels" 
      DROP COLUMN "content_type"
    `);

    // Note: We don't drop the enum type as it might be used by content_items table
  }
}
