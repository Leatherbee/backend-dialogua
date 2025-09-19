import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class CreateFormFieldDto {
  @IsString()
  @MaxLength(255)
  field_name: string;

  @IsString()
  @MaxLength(50)
  field_type: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

  @IsOptional()
  @IsObject()
  validation_rules?: Record<string, any>;

  @IsInt()
  @Min(1)
  form_question_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
