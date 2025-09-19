import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserLevelProgressToReferenceUnitLevels1758224000018
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing index on level_id
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_user_level_progress_level_id";
    `);

    // Rename level_id column to unit_level_id
    await queryRunner.query(`
      ALTER TABLE user_level_progress 
      RENAME COLUMN level_id TO unit_level_id;
    `);

    // Add foreign key constraint to unit_levels table
    await queryRunner.query(`
      ALTER TABLE user_level_progress 
      ADD CONSTRAINT "FK_user_level_progress_unit_level_id" 
      FOREIGN KEY (unit_level_id) REFERENCES unit_levels(id) ON DELETE CASCADE;
    `);

    // Create new index on unit_level_id
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_level_progress_unit_level_id" 
      ON user_level_progress (unit_level_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_user_level_progress_unit_level_id";
    `);

    // Drop the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE user_level_progress 
      DROP CONSTRAINT IF EXISTS "FK_user_level_progress_unit_level_id";
    `);

    // Rename unit_level_id column back to level_id
    await queryRunner.query(`
      ALTER TABLE user_level_progress 
      RENAME COLUMN unit_level_id TO level_id;
    `);

    // Recreate the original index on level_id
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_level_progress_level_id" 
      ON user_level_progress (level_id);
    `);
  }
}
