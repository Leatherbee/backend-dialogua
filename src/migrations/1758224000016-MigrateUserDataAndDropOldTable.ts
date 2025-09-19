import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateUserDataAndDropOldTable1758224000016
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, check if old 'user' table exists and has data
    const userTableExists = await queryRunner.hasTable('user');

    if (userTableExists) {
      // Migrate data from old 'user' table to new 'users' table
      await queryRunner.query(`
        INSERT INTO "users" (id, first_name, last_name, email, password, "appleId", "createdAt", "updatedAt")
        SELECT id, first_name, last_name, email, password, "appleId", "createdAt", "updatedAt"
        FROM "user"
        WHERE NOT EXISTS (
          SELECT 1 FROM "users" WHERE "users".id = "user".id
        )
      `);

      // Check if there's an old refresh_token table that references the old user table
      const oldRefreshTokenExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc
          JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
          WHERE tc.table_name = 'refresh_token' 
          AND tc.constraint_type = 'FOREIGN KEY'
          AND ccu.table_name = 'user'
        )
      `);

      if (oldRefreshTokenExists[0].exists) {
        // Drop the old refresh_token table that references the old user table
        await queryRunner.query(`DROP TABLE IF EXISTS "refresh_token" CASCADE`);
      }

      // Drop the old 'user' table
      await queryRunner.query(`DROP TABLE "user" CASCADE`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the old 'user' table
    await queryRunner.query(`
      CREATE TABLE "user" (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name character varying(255),
        last_name character varying(255),
        email character varying(255),
        password character varying(255),
        "appleId" character varying(100),
        "createdAt" timestamp without time zone DEFAULT now(),
        "updatedAt" timestamp without time zone DEFAULT now()
      )
    `);

    // Create index on email
    await queryRunner.query(
      `CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email")`,
    );

    // Migrate data back from 'users' table to 'user' table
    await queryRunner.query(`
      INSERT INTO "user" (id, first_name, last_name, email, password, "appleId", "createdAt", "updatedAt")
      SELECT id, first_name, last_name, email, password, "appleId", "createdAt", "updatedAt"
      FROM "users"
    `);
  }
}
