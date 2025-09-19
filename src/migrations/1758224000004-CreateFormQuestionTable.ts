import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormQuestionTable1758224000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "form_questions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "question" text NOT NULL,
        "instructions" text,
        "content_item_id" integer NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "deleted_at" TIMESTAMP WITH TIME ZONE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_form_questions_content_item_id" ON "form_questions" ("content_item_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('form_questions');
  }
}
