import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'update_data' })
export class UpdateData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_name', type: 'varchar', length: 50 })
  tableName: string;

  @Column({
    name: 'last_updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdatedAt: Date;
}
