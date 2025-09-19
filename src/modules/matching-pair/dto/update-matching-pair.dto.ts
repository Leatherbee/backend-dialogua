import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchingPairDto } from './create-matching-pair.dto';

export class UpdateMatchingPairDto extends PartialType(CreateMatchingPairDto) {}
