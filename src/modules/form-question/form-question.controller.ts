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
import { FormQuestionService } from './form-question.service';
import { CreateFormQuestionDto, UpdateFormQuestionDto } from './dto';

@Controller('form-questions')
export class FormQuestionController {
  constructor(private readonly formQuestionService: FormQuestionService) {}

  @Post()
  create(@Body() createFormQuestionDto: CreateFormQuestionDto) {
    return this.formQuestionService.create(createFormQuestionDto);
  }

  @Get()
  findAll(@Query('contentItemId') contentItemId?: string) {
    if (contentItemId) {
      return this.formQuestionService.findByContentItem(+contentItemId);
    }
    return this.formQuestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormQuestionDto: UpdateFormQuestionDto,
  ) {
    return this.formQuestionService.update(+id, updateFormQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formQuestionService.remove(+id);
  }
}
