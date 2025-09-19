import {
  IsUUID,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoleplayAttemptDto {
  @IsUUID()
  user_id: string;

  @IsInt()
  @Min(1)
  roleplay_id: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  attempt_number?: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
