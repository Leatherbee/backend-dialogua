import { PartialType } from '@nestjs/mapped-types';
import { CreateUserLevelProgressDto } from './create-user-level-progress.dto';

export class UpdateUserLevelProgressDto extends PartialType(
  CreateUserLevelProgressDto,
) {}
