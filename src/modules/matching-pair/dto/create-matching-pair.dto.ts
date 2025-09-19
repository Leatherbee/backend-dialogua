import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsObject,
} from 'class-validator';

export class CreateMatchingPairDto {
  @IsString()
  @MaxLength(255)
  left_item: string;

  @IsString()
  @MaxLength(255)
  right_item: string;

  @IsInt()
  @Min(1)
  matching_question_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
