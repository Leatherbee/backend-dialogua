import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserLevelProgressTable1758224000010
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_level_progress (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        level_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        attempts INTEGER DEFAULT 0,
        completed_at TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, level_id)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_level_progress_user_id" ON user_level_progress (user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_level_progress_level_id" ON user_level_progress (level_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_user_level_progress_level_id";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_user_level_progress_user_id";
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS user_level_progress;
    `);
  }
}
