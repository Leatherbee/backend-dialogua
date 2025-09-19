import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizOptionDto } from './create-quiz-option.dto';

export class UpdateQuizOptionDto extends PartialType(CreateQuizOptionDto) {}
