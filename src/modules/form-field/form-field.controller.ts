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
import { FormFieldService } from './form-field.service';
import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';

@Controller('form-fields')
export class FormFieldController {
  constructor(private readonly formFieldService: FormFieldService) {}

  @Post()
  create(@Body() createFormFieldDto: CreateFormFieldDto) {
    return this.formFieldService.create(createFormFieldDto);
  }

  @Get()
  findAll(@Query('formQuestionId') formQuestionId?: string) {
    if (formQuestionId) {
      return this.formFieldService.findByFormQuestion(+formQuestionId);
    }
    return this.formFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formFieldService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormFieldDto: UpdateFormFieldDto,
  ) {
    return this.formFieldService.update(+id, updateFormFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formFieldService.remove(+id);
  }
}
