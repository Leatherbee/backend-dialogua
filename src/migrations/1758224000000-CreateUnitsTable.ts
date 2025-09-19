import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUnitsTable1758224000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'units',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'order_index',
            type: 'int',
            default: 0,
          },
          {
            name: 'program_id',
            type: 'uuid',
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
            columnNames: ['program_id'],
            referencedTableName: 'programs',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'units',
      new TableIndex({
        name: 'IDX_units_title',
        columnNames: ['title'],
      }),
    );
    await queryRunner.createIndex(
      'units',
      new TableIndex({
        name: 'IDX_units_order_index',
        columnNames: ['order_index'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('units');
  }
}
