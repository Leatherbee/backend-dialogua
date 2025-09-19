import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLevelColumnToUnitLevels1758224000017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'unit_levels',
      new TableColumn({
        name: 'level',
        type: 'int',
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('unit_levels', 'level');
  }
}
