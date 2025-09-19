import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  MaxLength,
  IsUrl,
  Min,
} from 'class-validator';
import { MediaType } from '../../../common/enums';

export class CreateMediaAssetDto {
  @IsEnum(MediaType)
  media_type: MediaType;

  @IsString()
  @IsUrl()
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration_sec?: number;

  @IsOptional()
  @IsString()
  transcript?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt_text?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
