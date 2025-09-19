import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMatchingPairTable1758224000014
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS matching_pairs (
        id SERIAL PRIMARY KEY,
        left_item VARCHAR(255) NOT NULL,
        right_item VARCHAR(255) NOT NULL,
        matching_question_id INTEGER NOT NULL REFERENCES matching_questions(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "deletedAt" TIMESTAMP WITH TIME ZONE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_matching_pairs_matching_question_id" ON matching_pairs (matching_question_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_matching_pairs_matching_question_id";
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS matching_pairs;
    `);
  }
}
