import { IsUUID, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateUserLevelProgressDto {
  @IsUUID()
  user_id: string;

  @IsInt()
  @Min(1)
  level_id: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  attempts?: number;
}
