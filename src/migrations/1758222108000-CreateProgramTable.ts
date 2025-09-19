import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProgramTable1758222108000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty_level VARCHAR(50),
        estimated_duration_hours INTEGER,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        deleted_at TIMESTAMPTZ
      )
    `);

    // Create index on title for faster searches
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_programs_title" ON programs (title);
    `);

    // Create index on difficulty_level for filtering
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_programs_difficulty_level" ON programs (difficulty_level);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('programs');
  }
}
