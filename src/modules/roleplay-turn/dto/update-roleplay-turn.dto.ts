import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleplayTurnDto } from './create-roleplay-turn.dto';

export class UpdateRoleplayTurnDto extends PartialType(CreateRoleplayTurnDto) {}
