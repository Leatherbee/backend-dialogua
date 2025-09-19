import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUnitLevelsTable1758224000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'unit_levels',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'position',
            type: 'int',
            default: 0,
          },
          {
            name: 'unit_id',
            type: 'int',
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
        foreignKeys: [
          {
            columnNames: ['unit_id'],
            referencedTableName: 'units',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            columnNames: ['unit_id', 'position'],
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'unit_levels',
      new TableIndex({
        name: 'IDX_unit_levels_unit_id',
        columnNames: ['unit_id'],
      }),
    );
    await queryRunner.createIndex(
      'unit_levels',
      new TableIndex({
        name: 'IDX_unit_levels_position',
        columnNames: ['position'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('unit_levels');
  }
}
