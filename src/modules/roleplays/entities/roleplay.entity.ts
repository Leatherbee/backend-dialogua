import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Level } from '../../levels/entities/level.entity';
import { RoleplayTurn } from './roleplay-turn.entity';

@Entity({ name: 'roleplays' })
export class Roleplay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  scenario: string;

  @ManyToOne(() => Level, (level) => level.roleplays, { onDelete: 'CASCADE' })
  level: Level;

  @OneToMany(() => RoleplayTurn, (turn) => turn.roleplay)
  turns: RoleplayTurn[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
