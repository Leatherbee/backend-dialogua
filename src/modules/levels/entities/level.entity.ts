import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';
import { LevelContentType } from '../../../common/enums/database.enums';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Roleplay } from '../../roleplays/entities/roleplay.entity';

@Entity({ name: 'levels' })
@Unique('UQ_program_level_number', ['program', 'levelNumber'])
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Program, (p) => p.levels, { onDelete: 'CASCADE' })
  program: Program;

  @Column({ name: 'level_number', type: 'int' })
  levelNumber: number;

  @Column({
    name: 'content_type',
    type: 'enum',
    enum: LevelContentType,
  })
  contentType: LevelContentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'unit_number', type: 'int', nullable: true })
  unitNumber: number | null;

  @Column({ name: 'unit_name', type: 'varchar', length: 255, nullable: true })
  unitName: string | null;

  @Column({ type: 'text', nullable: true })
  objective: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Quiz, (q) => q.level)
  quizzes: Quiz[];

  @OneToMany(() => Roleplay, (rp) => rp.level)
  roleplays: Roleplay[];
}
