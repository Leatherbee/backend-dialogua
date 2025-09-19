import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMatchingQuestionTable1758224000013
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS matching_questions (
        id SERIAL PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        instructions TEXT,
        content_item_id INTEGER NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "deletedAt" TIMESTAMP WITH TIME ZONE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_matching_questions_content_item_id" ON matching_questions (content_item_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_matching_questions_content_item_id";
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS matching_questions;
    `);
  }
}
