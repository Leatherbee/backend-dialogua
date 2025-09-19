import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchingQuestionDto } from './create-matching-question.dto';

export class UpdateMatchingQuestionDto extends PartialType(
  CreateMatchingQuestionDto,
) {}
