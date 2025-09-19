import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormQuestion } from './entities/form-question.entity';
import { CreateFormQuestionDto, UpdateFormQuestionDto } from './dto';

@Injectable()
export class FormQuestionService {
  constructor(
    @InjectRepository(FormQuestion)
    private readonly formQuestionRepository: Repository<FormQuestion>,
  ) {}

  async create(
    createFormQuestionDto: CreateFormQuestionDto,
  ): Promise<FormQuestion> {
    const formQuestion = this.formQuestionRepository.create(
      createFormQuestionDto,
    );
    return await this.formQuestionRepository.save(formQuestion);
  }

  async findAll(): Promise<FormQuestion[]> {
    return await this.formQuestionRepository.find({
      relations: ['contentItem', 'fields'],
    });
  }

  async findByContentItem(contentItemId: number): Promise<FormQuestion[]> {
    return await this.formQuestionRepository.find({
      where: { content_item_id: contentItemId },
      relations: ['contentItem', 'fields'],
    });
  }

  async findOne(id: number): Promise<FormQuestion> {
    const formQuestion = await this.formQuestionRepository.findOne({
      where: { id },
      relations: ['contentItem', 'fields'],
    });

    if (!formQuestion) {
      throw new NotFoundException(`FormQuestion with ID ${id} not found`);
    }

    return formQuestion;
  }

  async update(
    id: number,
    updateFormQuestionDto: UpdateFormQuestionDto,
  ): Promise<FormQuestion> {
    const formQuestion = await this.findOne(id);
    Object.assign(formQuestion, updateFormQuestionDto);
    return await this.formQuestionRepository.save(formQuestion);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.formQuestionRepository.softDelete(id);
  }
}
