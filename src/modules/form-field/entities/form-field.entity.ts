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
import { FormQuestion } from '../../form-question/entities/form-question.entity';

@Entity('form_fields')
export class FormField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  field_name: string;

  @Column({ type: 'varchar', length: 50 })
  field_type: string; // text, email, number, textarea, select, etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeholder: string;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  validation_rules: Record<string, any>;

  @Column({ type: 'int' })
  form_question_id: number;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => FormQuestion, (formQuestion) => formQuestion.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_question_id' })
  formQuestion: FormQuestion;
}
