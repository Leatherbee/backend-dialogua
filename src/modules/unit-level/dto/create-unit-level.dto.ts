import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateUnitLevelDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsInt()
  @Min(1)
  unit_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
