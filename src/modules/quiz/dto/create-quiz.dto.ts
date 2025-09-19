import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @MaxLength(500)
  question: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  content_item_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
