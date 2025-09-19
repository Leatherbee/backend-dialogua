import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUnusedLevelsTable1758224000019 implements MigrationInterface {
  name = 'DropUnusedLevelsTable1758224000019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the levels table as it's no longer needed
    // All level functionality has been migrated to unit_levels
    await queryRunner.query(`DROP TABLE IF EXISTS "levels" CASCADE`);

    // Also drop the enum type that was used by the levels table
    await queryRunner.query(`DROP TYPE IF EXISTS "level_type_enum" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the enum type first
    await queryRunner.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'level_type_enum') THEN
              CREATE TYPE level_type_enum AS ENUM (
                  'Quiz',
                  'Roleplay AI'
              );
          END IF;
      END
      $$;
    `);

    // Recreate the levels table structure for rollback
    await queryRunner.query(`
      CREATE TABLE "levels" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "level" integer NOT NULL,
        "type" level_type_enum NOT NULL,
        "banner" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_0d2d6e7d6b9f8b8b8b8b8b8b8b8b" PRIMARY KEY ("id")
      )
    `);
  }
}
