import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsObject,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export class CreateQuizOptionDto {
  @IsString()
  @MaxLength(255)
  option_text: string;

  @IsBoolean()
  is_correct: boolean;

  @IsNumber()
  @IsInt()
  @Min(1)
  quiz_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
