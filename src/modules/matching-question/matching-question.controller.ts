import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MatchingQuestionService } from './matching-question.service';
import { CreateMatchingQuestionDto, UpdateMatchingQuestionDto } from './dto';

@Controller('matching-questions')
export class MatchingQuestionController {
  constructor(
    private readonly matchingQuestionService: MatchingQuestionService,
  ) {}

  @Post()
  create(@Body() createMatchingQuestionDto: CreateMatchingQuestionDto) {
    return this.matchingQuestionService.create(createMatchingQuestionDto);
  }

  @Get()
  findAll(@Query('contentItemId') contentItemId?: string) {
    if (contentItemId) {
      return this.matchingQuestionService.findByContentItem(+contentItemId);
    }
    return this.matchingQuestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchingQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchingQuestionDto: UpdateMatchingQuestionDto,
  ) {
    return this.matchingQuestionService.update(+id, updateMatchingQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchingQuestionService.remove(+id);
  }
}
