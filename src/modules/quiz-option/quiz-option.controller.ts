import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { QuizOptionService } from './quiz-option.service';
import { CreateQuizOptionDto, UpdateQuizOptionDto } from './dto';

@Controller('quiz-options')
export class QuizOptionController {
  constructor(private readonly quizOptionService: QuizOptionService) {}

  @Post()
  create(@Body() createQuizOptionDto: CreateQuizOptionDto) {
    return this.quizOptionService.create(createQuizOptionDto);
  }

  @Get()
  findAll(@Query('quizId', ParseIntPipe) quizId?: number) {
    if (quizId) {
      return this.quizOptionService.findByQuiz(quizId);
    }
    return this.quizOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizOptionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizOptionDto: UpdateQuizOptionDto,
  ) {
    return this.quizOptionService.update(id, updateQuizOptionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizOptionService.remove(id);
  }
}
