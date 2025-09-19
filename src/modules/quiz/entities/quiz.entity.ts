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
import { QuizOption } from '../../quiz-option/entities/quiz-option.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

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

  @OneToMany(() => QuizOption, (quizOption) => quizOption.quiz)
  options: QuizOption[];
}
