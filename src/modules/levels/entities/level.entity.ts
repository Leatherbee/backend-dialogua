import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Unit } from '../../unit/entities/unit.entity';
import { ContentType } from '../../../common/enums';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Roleplay } from '../../roleplay/entities/roleplay.entity';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @Column({
    type: 'enum',
    enum: ContentType,
    nullable: false,
  })
  content_type: ContentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  objective: string;

  @Column({ type: 'int' })
  unit_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToMany(() => Quiz, (quiz) => quiz.level)
  quizzes: Quiz[];

  @OneToMany(() => Roleplay, (roleplay) => roleplay.level)
  roleplays: Roleplay[];
}
