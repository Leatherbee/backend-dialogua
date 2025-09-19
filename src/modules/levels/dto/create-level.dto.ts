import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty({
    description: 'The name of the level',
    example: 'Introduction to Basics',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Description of the level', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Position order of the level',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiProperty({
    description: 'Unit ID that this level belongs to',
    example: 1,
  })
  @IsInt()
  @Min(1)
  unit_id: number;

  @ApiProperty({
    description: 'Additional metadata for the level',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
