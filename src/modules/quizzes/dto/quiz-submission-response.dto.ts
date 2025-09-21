import { ApiProperty } from '@nestjs/swagger';

export class QuestionFeedbackDto {
  @ApiProperty({ description: 'Question ID' })
  questionId: string;

  @ApiProperty({ description: 'Whether the answer was correct' })
  correct: boolean;

  @ApiProperty({ description: 'Explanation for the answer' })
  explanation?: string;

  @ApiProperty({ description: 'Correct answer option ID' })
  correctAnswerId?: string;
}

export class QuizSubmissionResponseDto {
  @ApiProperty({ description: 'Overall score percentage (0-100)' })
  score: number;

  @ApiProperty({ description: 'Total number of questions' })
  totalQuestions: number;

  @ApiProperty({ description: 'Number of correct answers' })
  correctAnswers: number;

  @ApiProperty({ description: 'Whether the quiz was passed (score >= 70%)' })
  passed: boolean;

  @ApiProperty({
    description: 'Detailed feedback for each question',
    type: [QuestionFeedbackDto],
  })
  feedback: QuestionFeedbackDto[];

  @ApiProperty({ description: 'Progress updated successfully' })
  progressUpdated: boolean;
}
