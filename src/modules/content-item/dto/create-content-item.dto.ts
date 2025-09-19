import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { ContentType } from '../../../common/enums';

export class CreateContentItemDto {
  @IsEnum(ContentType)
  content_type: ContentType;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  position: number;

  @IsNumber()
  @IsInt()
  @Min(1)
  unit_level_id: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  media_asset_id?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
