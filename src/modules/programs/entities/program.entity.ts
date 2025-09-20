import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Level } from '../../levels/entities/level.entity';

@Entity({ name: 'programs' })
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'program_code', type: 'varchar', length: 255, unique: true })
  programCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', length: 255 })
  chapter: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  imageUrl: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Level, (level) => level.program)
  levels: Level[];
}
