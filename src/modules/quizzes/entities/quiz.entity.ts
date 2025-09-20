import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Level } from '../../levels/entities/level.entity';
import { QuizType } from '../../../common/enums/database.enums';
import { QuizOption } from './quiz-option.entity';
import { QuizMedia } from './quiz-media.entity';
import { QuizMatchingPair } from './quiz-matching-pair.entity';

@Entity({ name: 'quizzes' })
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Level, (l) => l.quizzes, { onDelete: 'CASCADE' })
  level: Level;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', nullable: true })
  explanation: string | null;

  @Column({ type: 'text', nullable: true })
  objective: string | null;

  @Column({
    name: 'quiz_type',
    type: 'enum',
    enum: QuizType,
  })
  quizType: QuizType;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => QuizOption, (option) => option.quiz)
  options: QuizOption[];

  @OneToMany(() => QuizMatchingPair, (pair) => pair.quiz)
  matchingPairs: QuizMatchingPair[];

  @OneToMany(() => QuizMedia, (media) => media.quiz)
  media: QuizMedia[];
}
