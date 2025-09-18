import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppleIdToUsers1758095026771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure table name matches the entity: TypeORM default for User entity is "user" (quoted) in Postgres
        // Add column appleId if not exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'user' AND column_name = 'appleId'
                ) THEN
                    ALTER TABLE "user" ADD COLUMN "appleId" character varying(100);
                END IF;
            END
            $$;
        `);

        // Create an index on appleId for faster lookups
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_class c
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE c.relname = 'IDX_user_appleId' AND n.nspname = 'public'
                ) THEN
                    CREATE INDEX "IDX_user_appleId" ON "user" ("appleId");
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index if exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_class c
                    JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE c.relname = 'IDX_user_appleId' AND n.nspname = 'public'
                ) THEN
                    DROP INDEX "IDX_user_appleId";
                END IF;
            END
            $$;
        `);

        // Drop column if exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'user' AND column_name = 'appleId'
                ) THEN
                    ALTER TABLE "user" DROP COLUMN "appleId";
                END IF;
            END
            $$;
        `);
    }

}
