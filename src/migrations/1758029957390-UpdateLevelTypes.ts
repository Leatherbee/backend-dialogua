import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLevelTypes1758029957390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, update any existing values to one of the new enum values
    await queryRunner.query(`
            UPDATE levels 
            SET type = 'Quiz' 
            WHERE type IS NULL OR type NOT IN ('Quiz', 'Roleplay AI');
        `);

    // Then update the enum type
    await queryRunner.query(`
            ALTER TYPE "public"."level_type_enum" RENAME TO "level_type_enum_old";
            CREATE TYPE "public"."level_type_enum" AS ENUM('Quiz', 'Roleplay AI');
            ALTER TABLE "levels" ALTER COLUMN "type" TYPE "public"."level_type_enum" 
                USING ("type"::text::"public"."level_type_enum");
            DROP TYPE "public"."level_type_enum_old";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to the original enum if needed
    await queryRunner.query(`
            ALTER TYPE "public"."level_type_enum" RENAME TO "level_type_enum_old";
            CREATE TYPE "public"."level_type_enum" AS ENUM('Multiple Choice', 'Video Comprehension', 'Speaking Practice', 'Roleplay AI');
            ALTER TABLE "levels" ALTER COLUMN "type" TYPE "public"."level_type_enum" 
                USING (CASE 
                    WHEN "type" = 'Quiz' THEN 'Multiple Choice'::"public"."level_type_enum"
                    ELSE 'Multiple Choice'::"public"."level_type_enum"
                END);
            DROP TYPE "public"."level_type_enum_old";
        `);
  }
}
