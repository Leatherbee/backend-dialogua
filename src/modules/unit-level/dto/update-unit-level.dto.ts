import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitLevelDto } from './create-unit-level.dto';

export class UpdateUnitLevelDto extends PartialType(CreateUnitLevelDto) {}
