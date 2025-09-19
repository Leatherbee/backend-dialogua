import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order_index?: number;

  @IsString()
  program_id: string;
}
