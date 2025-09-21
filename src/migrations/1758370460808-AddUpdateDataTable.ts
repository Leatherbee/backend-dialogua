import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdateDataTable1758370460808 implements MigrationInterface {
  name = 'AddUpdateDataTable1758370460808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "update_data" ("id" SERIAL NOT NULL, "table_name" character varying(50) NOT NULL, "last_updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_update_data_id" PRIMARY KEY ("id"))`,
    );

    // Insert initial data for existing tables
    await queryRunner.query(
      `INSERT INTO "update_data" ("table_name", "last_updated_at") VALUES 
       ('levels', CURRENT_TIMESTAMP),
       ('quizzes', CURRENT_TIMESTAMP),
       ('roleplays', CURRENT_TIMESTAMP)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "update_data"`);
  }
}
