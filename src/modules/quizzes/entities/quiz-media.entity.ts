import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { QuizOption } from './quiz-option.entity';
import { QuizMatchingPair } from './quiz-matching-pair.entity';
import { MediaType } from '../../../common/enums/database.enums';

@Entity({ name: 'quiz_media' })
export class QuizMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.media, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  quiz: Quiz | null;

  @ManyToOne(() => QuizOption, { nullable: true, onDelete: 'CASCADE' })
  quizOption: QuizOption | null;

  @ManyToOne(() => QuizMatchingPair, { nullable: true, onDelete: 'CASCADE' })
  matchingPair: QuizMatchingPair | null;

  @Column({
    name: 'media_type',
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
