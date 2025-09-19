import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateRoleplayTurnDto {
  @IsString()
  @IsIn(['user', 'character'])
  speaker: string;

  @IsString()
  message: string;

  @IsInt()
  @Min(1)
  turn_order: number;

  @IsInt()
  @Min(1)
  roleplay_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
