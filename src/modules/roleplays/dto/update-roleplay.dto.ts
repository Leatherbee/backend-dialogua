import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleplayDto } from './create-roleplay.dto';

export class UpdateRoleplayDto extends PartialType(CreateRoleplayDto) {}
