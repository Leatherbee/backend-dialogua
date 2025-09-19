import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ContentItem } from '../../content-item/entities/content-item.entity';
import { MatchingPair } from '../../matching-pair/entities/matching-pair.entity';

@Entity('matching_questions')
export class MatchingQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  question: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'int' })
  content_item_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToOne(() => ContentItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItem;

  @OneToMany(
    () => MatchingPair,
    (matchingPair) => matchingPair.matchingQuestion,
  )
  pairs: MatchingPair[];
}
