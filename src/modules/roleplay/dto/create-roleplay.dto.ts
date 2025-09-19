import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsObject,
} from 'class-validator';

export class CreateRoleplayDto {
  @IsString()
  @MaxLength(500)
  scenario: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  character_name?: string;

  @IsOptional()
  @IsString()
  character_description?: string;

  @IsInt()
  @Min(1)
  content_item_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
