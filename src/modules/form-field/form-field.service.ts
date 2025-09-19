import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormField } from './entities/form-field.entity';
import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';

@Injectable()
export class FormFieldService {
  constructor(
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
  ) {}

  async create(createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    const formField = this.formFieldRepository.create(createFormFieldDto);
    return await this.formFieldRepository.save(formField);
  }

  async findAll(): Promise<FormField[]> {
    return await this.formFieldRepository.find({
      relations: ['formQuestion'],
    });
  }

  async findByFormQuestion(formQuestionId: number): Promise<FormField[]> {
    return await this.formFieldRepository.find({
      where: { form_question_id: formQuestionId },
      relations: ['formQuestion'],
    });
  }

  async findOne(id: number): Promise<FormField> {
    const formField = await this.formFieldRepository.findOne({
      where: { id },
      relations: ['formQuestion'],
    });

    if (!formField) {
      throw new NotFoundException(`FormField with ID ${id} not found`);
    }

    return formField;
  }

  async update(
    id: number,
    updateFormFieldDto: UpdateFormFieldDto,
  ): Promise<FormField> {
    const formField = await this.findOne(id);
    Object.assign(formField, updateFormFieldDto);
    return await this.formFieldRepository.save(formField);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.formFieldRepository.softDelete(id);
  }
}
