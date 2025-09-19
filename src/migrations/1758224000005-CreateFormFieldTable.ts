import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFormFieldTable1758224000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum for field types
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'field_type_enum') THEN
          CREATE TYPE field_type_enum AS ENUM ('text', 'textarea', 'email', 'number', 'select', 'radio', 'checkbox');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS form_fields (
        id SERIAL PRIMARY KEY,
        field_name VARCHAR(255) NOT NULL,
        field_type field_type_enum NOT NULL,
        placeholder VARCHAR(255),
        is_required BOOLEAN DEFAULT false,
        validation_rules JSONB DEFAULT '{}'::jsonb,
        form_question_id UUID NOT NULL REFERENCES form_questions(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        deleted_at TIMESTAMPTZ
      )
    `);

    // Create index on form_question_id for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_form_fields_form_question_id" ON form_fields (form_question_id);
    `);

    // Create index on field_type for filtering
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_form_fields_field_type" ON form_fields (field_type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('form_fields');
    await queryRunner.query(`DROP TYPE IF EXISTS "field_type_enum"`);
  }
}
