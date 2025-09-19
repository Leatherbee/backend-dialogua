import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleplayAttemptTable1758224000015
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roleplay_attempts (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        roleplay_id INTEGER NOT NULL REFERENCES roleplays(id) ON DELETE CASCADE,
        score INTEGER,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP WITH TIME ZONE,
        attempt_number INTEGER DEFAULT 1,
        feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_roleplay_attempts_user_id" ON roleplay_attempts (user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_roleplay_attempts_roleplay_id" ON roleplay_attempts (roleplay_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_roleplay_attempts_roleplay_id";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_roleplay_attempts_user_id";
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS roleplay_attempts;
    `);
  }
}
