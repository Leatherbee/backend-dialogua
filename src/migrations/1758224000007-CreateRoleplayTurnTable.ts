import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleplayTurnTable1758224000007
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum for speaker types
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'speaker_type_enum') THEN
          CREATE TYPE speaker_type_enum AS ENUM ('user', 'character');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roleplay_turns (
        id SERIAL PRIMARY KEY,
        speaker speaker_type_enum NOT NULL,
        message TEXT NOT NULL,
        turn_order INTEGER NOT NULL,
        roleplay_id INTEGER NOT NULL REFERENCES roleplays(id) ON DELETE CASCADE,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        deleted_at TIMESTAMPTZ
      )
    `);

    // Create index on roleplay_id for faster lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_roleplay_turns_roleplay_id" ON roleplay_turns (roleplay_id);
    `);

    // Create index on turn_order for ordering
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_roleplay_turns_turn_order" ON roleplay_turns (turn_order);
    `);

    // Create composite index for roleplay_id and turn_order
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_roleplay_turns_roleplay_turn_order" ON roleplay_turns (roleplay_id, turn_order);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roleplay_turns');
    await queryRunner.query(`DROP TYPE IF EXISTS "speaker_type_enum"`);
  }
}
