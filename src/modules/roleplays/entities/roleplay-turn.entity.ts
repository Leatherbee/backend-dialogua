import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roleplay } from './roleplay.entity';

@Entity({ name: 'roleplay_turns' })
export class RoleplayTurn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Roleplay, (roleplay) => roleplay.turns, {
    onDelete: 'CASCADE',
  })
  roleplay: Roleplay;

  @Column({ name: 'turn_order', type: 'int' })
  turnOrder: number;

  @Column({ type: 'varchar', length: 50 })
  speaker: string; // 'npc' atau 'user'

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
