import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UnitLevel } from '../../unit-level/entities/unit-level.entity';

@Entity('user_level_progress')
@Unique(['user_id', 'unit_level_id'])
export class UserLevelProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int' })
  unit_level_id: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  completed_content: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UnitLevel)
  @JoinColumn({ name: 'unit_level_id' })
  unitLevel: UnitLevel;
}
