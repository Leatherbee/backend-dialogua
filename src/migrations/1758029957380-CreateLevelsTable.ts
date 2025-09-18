import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLevelsTable1758029957380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS levels (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                level integer NOT NULL,
                type character varying NOT NULL,
                banner text NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP,
                CONSTRAINT "PK_0d2d6e7d6b9f8b8b8b8b8b8b8b8b" PRIMARY KEY (id)
            )
        `);

    // Create enum type for level types
    await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'level_type_enum') THEN
                    CREATE TYPE level_type_enum AS ENUM (
                        'Quiz',
                        'Roleplay AI'
                    );
                END IF;
            END
            $$;
        `);

    // Alter the type column to use the enum
    await queryRunner.query(`
            ALTER TABLE levels 
            ALTER COLUMN type TYPE level_type_enum 
            USING type::level_type_enum;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // First drop the table that depends on the enum
    await queryRunner.query(`DROP TABLE IF EXISTS levels CASCADE`);

    // Then drop the enum type
    await queryRunner.query(`DROP TYPE IF EXISTS level_type_enum CASCADE`);
  }
}
