import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompletedContentToUserLevelProgress1758224000020
  implements MigrationInterface
{
  name = 'AddCompletedContentToUserLevelProgress1758224000020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_level_progress" 
      ADD COLUMN "completed_content" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_level_progress" 
      DROP COLUMN "completed_content"
    `);
  }
}
