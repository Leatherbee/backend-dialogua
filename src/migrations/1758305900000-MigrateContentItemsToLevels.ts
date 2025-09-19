import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateContentItemsToLevels1758305900000
  implements MigrationInterface
{
  name = 'MigrateContentItemsToLevels1758305900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if there's any data in content_items to migrate
    const contentItemsCount = await queryRunner.query(`
      SELECT COUNT(*) as count FROM content_items
    `);

    if (contentItemsCount[0].count > 0) {
      // If there's data, migrate it to levels table
      // Update levels with content_type based on content_items
      await queryRunner.query(`
        UPDATE levels 
        SET content_type = ci.content_type
        FROM content_items ci 
        WHERE levels.id::text = ci."levelId"::text
      `);

      console.log(
        `Migrated ${contentItemsCount[0].count} content items to levels table`,
      );
    } else {
      console.log('No content items found to migrate - table is empty');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse migration: clear content_type from levels
    await queryRunner.query(`
      UPDATE levels 
      SET content_type = NULL
    `);

    console.log('Cleared content_type from levels table');
  }
}
