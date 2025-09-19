import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1758224000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "appleId" VARCHAR(100),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON users (email);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_appleId" ON users ("appleId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_users_appleId";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_users_email";
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS users;
    `);
  }
}
