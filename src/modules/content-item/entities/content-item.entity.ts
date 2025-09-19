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
import { ContentType } from '../../../common/enums';
import { UnitLevel } from '../../unit-level/entities/unit-level.entity';
import { MediaAsset } from '../../media-asset/entities/media-asset.entity';

@Entity('content_items')
export class ContentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  content_type: ContentType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'int' })
  unit_level_id: number;

  @Column({ type: 'int', nullable: true })
  media_asset_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => UnitLevel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unit_level_id' })
  unitLevel: UnitLevel;

  @ManyToOne(() => MediaAsset, { nullable: true })
  @JoinColumn({ name: 'media_asset_id' })
  mediaAsset: MediaAsset;
}
