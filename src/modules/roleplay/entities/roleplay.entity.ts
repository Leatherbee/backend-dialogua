import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Level } from '../../levels/entities/level.entity';
import { RoleplayTurn } from '../../roleplay-turn/entities/roleplay-turn.entity';

@Entity('roleplays')
export class Roleplay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  scenario: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  character_name: string;

  @Column({ type: 'text', nullable: true })
  character_description: string;

  @Column({ type: 'varchar' })
  level_id: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Level, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @OneToMany(() => RoleplayTurn, (roleplayTurn) => roleplayTurn.roleplay)
  turns: RoleplayTurn[];
}
