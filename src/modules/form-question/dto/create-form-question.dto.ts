import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsObject,
} from 'class-validator';

export class CreateFormQuestionDto {
  @IsString()
  @MaxLength(500)
  question: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsInt()
  @Min(1)
  content_item_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
