import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMediaAssetsTable1758224000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum for media types
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type_enum') THEN
          CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio', 'document');
        END IF;
      END
      $$;
    `);

    await queryRunner.createTable(
      new Table({
        name: 'media_assets',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'media_type',
            type: 'enum',
            enum: ['image', 'video', 'audio', 'document'],
          },
          {
            name: 'url',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'duration_sec',
            type: 'numeric',
            isNullable: true,
          },
          {
            name: 'transcript',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'alt_text',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            default: "'{}'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'media_assets',
      new TableIndex({
        name: 'IDX_media_assets_media_type',
        columnNames: ['media_type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('media_assets');
    await queryRunner.query(`DROP TYPE IF EXISTS media_type_enum`);
  }
}
