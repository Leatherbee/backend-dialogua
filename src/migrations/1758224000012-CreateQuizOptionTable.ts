import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuizOptionTable1758224000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS quiz_options (
        id SERIAL PRIMARY KEY,
        option_text VARCHAR(255) NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE,
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "deletedAt" TIMESTAMP WITH TIME ZONE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_quiz_options_quiz_id" ON quiz_options (quiz_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_quiz_options_quiz_id";
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS quiz_options;
    `);
  }
}
