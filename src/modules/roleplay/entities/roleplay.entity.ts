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
import { RoleplayTurn } from '../../roleplay-turn/entities/roleplay-turn.entity';

@Entity('roleplays')
export class Roleplay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  scenario: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  character_name: string;

  @Column({ type: 'text', nullable: true })
  character_description: string;

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

  @OneToMany(() => RoleplayTurn, (roleplayTurn) => roleplayTurn.roleplay)
  turns: RoleplayTurn[];
}
