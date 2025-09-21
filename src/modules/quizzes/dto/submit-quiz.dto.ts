import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuizAnswerDto {
  @ApiProperty({ description: 'Question ID (for multiple choice questions)' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ description: 'Selected option ID (for multiple choice)' })
  @IsString()
  @IsNotEmpty()
  selectedOptionId: string;
}

export class MatchingAnswerDto {
  @ApiProperty({ description: 'Left matching pair ID' })
  @IsString()
  @IsNotEmpty()
  leftPairId: string;

  @ApiProperty({ description: 'Right matching pair ID' })
  @IsString()
  @IsNotEmpty()
  rightPairId: string;
}

export class SubmitQuizDto {
  @ApiProperty({ description: 'User ID submitting the quiz' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Array of quiz answers for multiple choice questions',
    type: [QuizAnswerDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers?: QuizAnswerDto[];

  @ApiProperty({
    description: 'Array of matching answers for matching questions',
    type: [MatchingAnswerDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchingAnswerDto)
  matchingAnswers?: MatchingAnswerDto[];
}
