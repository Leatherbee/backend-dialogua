import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { QuizMedia } from './quiz-media.entity';

@Entity({ name: 'quiz_multiple_choice_options' })
export class QuizOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.options, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @Column({ name: 'option_text', type: 'varchar', length: 255, nullable: true })
  optionText: string | null;

  @Column({ name: 'is_correct', type: 'boolean' })
  isCorrect: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => QuizMedia, { nullable: true })
  media: QuizMedia | null;
}
