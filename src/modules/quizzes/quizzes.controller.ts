import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizSubmissionResponseDto } from './dto/quiz-submission-response.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('quizzes')
@Public()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'Returns all quizzes' })
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiResponse({ status: 200, description: 'Returns a specific quiz' })
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit quiz answers' })
  @ApiResponse({
    status: 200,
    description: 'Quiz submitted successfully',
    type: QuizSubmissionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @ApiResponse({ status: 400, description: 'Invalid submission data' })
  submitQuiz(
    @Param('id') id: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ): Promise<QuizSubmissionResponseDto> {
    return this.quizzesService.submitQuiz(id, submitQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
