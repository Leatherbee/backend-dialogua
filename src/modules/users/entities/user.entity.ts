import type { UUID } from 'crypto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLevelProgress } from '../../progress/entities/progress.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
  first_name: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
  last_name: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  appleId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => UserLevelProgress, (progress) => progress.user)
  progress: UserLevelProgress[];
}
