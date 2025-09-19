import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteContentItemsToLevelsTransition1758306000000
  implements MigrationInterface
{
  name = 'CompleteContentItemsToLevelsTransition1758306000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting complete transition from content_items to levels...');

    // Step 1: Add new content fields to levels table if they don't exist
    const levelColumns = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'levels' AND table_schema = 'public'
    `);

    const existingColumns = levelColumns.map((col: any) => col.column_name);

    if (!existingColumns.includes('title')) {
      await queryRunner.query(`
        ALTER TABLE levels ADD COLUMN title VARCHAR(255)
      `);
    }

    if (!existingColumns.includes('content')) {
      await queryRunner.query(`
        ALTER TABLE levels ADD COLUMN content TEXT
      `);
    }

    if (!existingColumns.includes('objective')) {
      await queryRunner.query(`
        ALTER TABLE levels ADD COLUMN objective TEXT
      `);
    }

    // Step 2: Check if content_items table exists and migrate data
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'content_items'
      )
    `);

    if (tableExists[0].exists) {
      // Migrate content data from content_items to levels
      await queryRunner.query(`
        UPDATE levels
        SET
          title = ci.title,
          content = ci.description,
          objective = ci.metadata->>'objective'
        FROM content_items ci
        WHERE levels.id::text = ci."levelId"::text
      `);

      console.log('Migrated content data from content_items to levels');

      // Step 3: Update quiz table to reference levels directly
      const quizTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'quiz'
        )
      `);

      if (quizTableExists[0].exists) {
        // Add level_id column to quiz if it doesn't exist
        const quizColumns = await queryRunner.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'quiz' AND table_schema = 'public'
        `);

        const quizExistingColumns = quizColumns.map(
          (col: any) => col.column_name,
        );

        if (!quizExistingColumns.includes('level_id')) {
          await queryRunner.query(`
            ALTER TABLE quiz ADD COLUMN level_id VARCHAR(50)
          `);
        }

        // Update quiz records to reference levels directly
        await queryRunner.query(`
          UPDATE quiz
          SET level_id = ci."levelId"
          FROM content_items ci
          WHERE quiz.content_item_id = ci.id
        `);

        // Drop the old content_item_id column
        if (quizExistingColumns.includes('content_item_id')) {
          await queryRunner.query(`
            ALTER TABLE quiz DROP COLUMN content_item_id
          `);
        }

        console.log('Updated quiz table to reference levels directly');
      }

      // Step 4: Update roleplay table to reference levels directly
      const roleplayTableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'roleplay'
        )
      `);

      if (roleplayTableExists[0].exists) {
        // Add level_id column to roleplay if it doesn't exist
        const roleplayColumns = await queryRunner.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'roleplay' AND table_schema = 'public'
        `);

        const roleplayExistingColumns = roleplayColumns.map(
          (col: any) => col.column_name,
        );

        if (!roleplayExistingColumns.includes('level_id')) {
          await queryRunner.query(`
            ALTER TABLE roleplay ADD COLUMN level_id VARCHAR(50)
          `);
        }

        // Update roleplay records to reference levels directly
        await queryRunner.query(`
          UPDATE roleplay
          SET level_id = ci."levelId"
          FROM content_items ci
          WHERE roleplay.content_item_id = ci.id
        `);

        // Drop the old content_item_id column
        if (roleplayExistingColumns.includes('content_item_id')) {
          await queryRunner.query(`
            ALTER TABLE roleplay DROP COLUMN content_item_id
          `);
        }

        console.log('Updated roleplay table to reference levels directly');
      }

      // Step 5: Update matching_questions table to reference levels directly
      const matchingQuestionsExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'matching_questions'
        )
      `);

      if (matchingQuestionsExists[0].exists) {
        // Add level_id column if it doesn't exist
        const matchingColumns = await queryRunner.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'matching_questions' AND table_schema = 'public'
        `);

        const matchingExistingColumns = matchingColumns.map(
          (col: any) => col.column_name,
        );

        if (!matchingExistingColumns.includes('level_id')) {
          await queryRunner.query(`
            ALTER TABLE matching_questions ADD COLUMN level_id VARCHAR(50)
          `);
        }

        // Update matching_questions records
        await queryRunner.query(`
          UPDATE matching_questions
          SET level_id = ci."levelId"
          FROM content_items ci
          WHERE matching_questions.content_item_id = ci.id
        `);

        // Drop the old content_item_id column
        if (matchingExistingColumns.includes('content_item_id')) {
          await queryRunner.query(`
            ALTER TABLE matching_questions DROP COLUMN content_item_id
          `);
        }

        console.log(
          'Updated matching_questions table to reference levels directly',
        );
      }

      // Step 6: Update form_questions table to reference levels directly
      const formQuestionsExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'form_questions'
        )
      `);

      if (formQuestionsExists[0].exists) {
        // Add level_id column if it doesn't exist
        const formColumns = await queryRunner.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'form_questions' AND table_schema = 'public'
        `);

        const formExistingColumns = formColumns.map(
          (col: any) => col.column_name,
        );

        if (!formExistingColumns.includes('level_id')) {
          await queryRunner.query(`
            ALTER TABLE form_questions ADD COLUMN level_id VARCHAR(50)
          `);
        }

        // Update form_questions records
        await queryRunner.query(`
          UPDATE form_questions
          SET level_id = ci."levelId"
          FROM content_items ci
          WHERE form_questions.content_item_id = ci.id
        `);

        // Drop the old content_item_id column
        if (formExistingColumns.includes('content_item_id')) {
          await queryRunner.query(`
            ALTER TABLE form_questions DROP COLUMN content_item_id
          `);
        }

        console.log(
          'Updated form_questions table to reference levels directly',
        );
      }

      // Step 7: Drop the content_items table
      await queryRunner.query(`DROP TABLE content_items`);
      console.log('Dropped content_items table');
    } else {
      console.log('content_items table does not exist - skipping migration');
    }

    // Step 8: Make content_type non-nullable in levels table
    await queryRunner.query(`
      ALTER TABLE levels ALTER COLUMN content_type SET NOT NULL
    `);

    console.log(
      'Completed transition from content_items to levels-based content orchestration',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Reversing content_items to levels transition...');

    // This is a destructive migration, so the down migration will be limited
    // We can't fully restore the content_items table without data loss

    // Make content_type nullable again
    await queryRunner.query(`
      ALTER TABLE levels ALTER COLUMN content_type DROP NOT NULL
    `);

    // Remove the content fields from levels
    await queryRunner.query(`
      ALTER TABLE levels DROP COLUMN IF EXISTS title
    `);

    await queryRunner.query(`
      ALTER TABLE levels DROP COLUMN IF EXISTS content
    `);

    await queryRunner.query(`
      ALTER TABLE levels DROP COLUMN IF EXISTS objective
    `);

    console.log(
      'Partially reversed migration - content_items table cannot be fully restored',
    );
  }
}
