import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MatchingQuestion } from '../../matching-question/entities/matching-question.entity';

@Entity('matching_pairs')
export class MatchingPair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  left_item: string;

  @Column({ type: 'varchar', length: 255 })
  right_item: string;

  @Column({ type: 'int' })
  matching_question_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(
    () => MatchingQuestion,
    (matchingQuestion) => matchingQuestion.pairs,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'matching_question_id' })
  matchingQuestion: MatchingQuestion;
}
