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

@Entity({ name: 'quiz_matching_pairs' })
export class QuizMatchingPair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.matchingPairs, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @Column({ name: 'left_text', type: 'varchar', length: 255, nullable: true })
  leftText: string | null;

  @Column({ name: 'right_text', type: 'varchar', length: 255, nullable: true })
  rightText: string | null;

  @ManyToOne(() => QuizMedia, { nullable: true })
  leftMedia: QuizMedia | null;

  @ManyToOne(() => QuizMedia, { nullable: true })
  rightMedia: QuizMedia | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
