import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roleplay } from '../../roleplay/entities/roleplay.entity';

@Entity('roleplay_turns')
export class RoleplayTurn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  speaker: string; // 'user' or 'character'

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'int' })
  turn_order: number;

  @Column({ type: 'int' })
  roleplay_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Roleplay, (roleplay) => roleplay.turns, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleplay_id' })
  roleplay: Roleplay;
}
