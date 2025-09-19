import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUnusedLevelsTable1758224000019 implements MigrationInterface {
  name = 'DropUnusedLevelsTable1758224000019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the levels table as it's no longer needed
    // All level functionality has been migrated to unit_levels
    await queryRunner.query(`DROP TABLE IF EXISTS "level"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the levels table structure for rollback
    await queryRunner.query(`
      CREATE TABLE "level" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "level" integer NOT NULL,
        "type" character varying NOT NULL,
        "banner" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_d3f436c9f6d8c3b8b8f8b8f8b8f8" PRIMARY KEY ("id")
      )
    `);

    // Add the enum constraint for type
    await queryRunner.query(`
      ALTER TABLE "level" 
      ADD CONSTRAINT "CHK_level_type" 
      CHECK ("type" IN ('Quiz', 'Roleplay AI'))
    `);
  }
}
