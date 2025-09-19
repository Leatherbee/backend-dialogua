import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleplayAttemptDto } from './create-roleplay-attempt.dto';

export class UpdateRoleplayAttemptDto extends PartialType(
  CreateRoleplayAttemptDto,
) {}
