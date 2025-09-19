import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUnitLevelsToLevels1758302200000
  implements MigrationInterface
{
  name = 'RenameUnitLevelsToLevels1758302200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename the table from unit_levels to levels
    await queryRunner.query(`ALTER TABLE "unit_levels" RENAME TO "levels"`);

    // Update all foreign key constraints that reference unit_levels

    // Update content_items table foreign key
    await queryRunner.query(`
      ALTER TABLE "content_items"
      DROP CONSTRAINT IF EXISTS "FK_content_items_unit_level_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "content_items"
      ADD CONSTRAINT "FK_content_items_level_id"
      FOREIGN KEY ("unit_level_id") REFERENCES "levels"("id") ON DELETE CASCADE
    `);

    // Update user_level_progress table foreign key
    await queryRunner.query(`
      ALTER TABLE "user_level_progress"
      DROP CONSTRAINT IF EXISTS "FK_user_level_progress_unit_level_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "user_level_progress"
      ADD CONSTRAINT "FK_user_level_progress_level_id"
      FOREIGN KEY ("unit_level_id") REFERENCES "levels"("id") ON DELETE CASCADE
    `);

    // Update indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_unit_levels_unit_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_unit_levels_position"`);

    await queryRunner.query(`
      CREATE INDEX "IDX_levels_unit_id" ON "levels" ("unit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_levels_position" ON "levels" ("position")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes

    // Drop new indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_levels_unit_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_levels_position"`);

    // Restore old indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_unit_levels_unit_id" ON "levels" ("unit_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_unit_levels_position" ON "levels" ("position")
    `);

    // Update foreign key constraints back
    await queryRunner.query(`
      ALTER TABLE "content_items"
      DROP CONSTRAINT IF EXISTS "FK_content_items_level_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "content_items"
      ADD CONSTRAINT "FK_content_items_unit_level_id"
      FOREIGN KEY ("unit_level_id") REFERENCES "levels"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_level_progress"
      DROP CONSTRAINT IF EXISTS "FK_user_level_progress_level_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "user_level_progress"
      ADD CONSTRAINT "FK_user_level_progress_unit_level_id"
      FOREIGN KEY ("unit_level_id") REFERENCES "levels"("id") ON DELETE CASCADE
    `);

    // Rename table back
    await queryRunner.query(`ALTER TABLE "levels" RENAME TO "unit_levels"`);
  }
}
