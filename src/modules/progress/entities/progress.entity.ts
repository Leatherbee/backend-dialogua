import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Program } from '../../programs/entities/program.entity';
import { Level } from '../../levels/entities/level.entity';

@Entity({ name: 'user_level_progress' })
@Unique('UQ_user_level', ['user', 'level'])
@Index('IDX_user_program', ['user', 'program'])
export class UserLevelProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Program, { onDelete: 'CASCADE' })
  program: Program;

  @ManyToOne(() => Level, { onDelete: 'CASCADE' })
  level: Level;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'last_played_at', type: 'timestamp', nullable: true })
  lastPlayedAt: Date | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
