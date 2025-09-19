import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchingQuestion } from './entities/matching-question.entity';
import { CreateMatchingQuestionDto, UpdateMatchingQuestionDto } from './dto';

@Injectable()
export class MatchingQuestionService {
  constructor(
    @InjectRepository(MatchingQuestion)
    private readonly matchingQuestionRepository: Repository<MatchingQuestion>,
  ) {}

  async create(
    createMatchingQuestionDto: CreateMatchingQuestionDto,
  ): Promise<MatchingQuestion> {
    const matchingQuestion = this.matchingQuestionRepository.create(
      createMatchingQuestionDto,
    );
    return await this.matchingQuestionRepository.save(matchingQuestion);
  }

  async findAll(): Promise<MatchingQuestion[]> {
    return await this.matchingQuestionRepository.find({
      relations: ['contentItem', 'pairs'],
    });
  }

  async findByContentItem(contentItemId: number): Promise<MatchingQuestion[]> {
    return await this.matchingQuestionRepository.find({
      where: { content_item_id: contentItemId },
      relations: ['contentItem', 'pairs'],
    });
  }

  async findOne(id: number): Promise<MatchingQuestion> {
    const matchingQuestion = await this.matchingQuestionRepository.findOne({
      where: { id },
      relations: ['contentItem', 'pairs'],
    });

    if (!matchingQuestion) {
      throw new NotFoundException(`MatchingQuestion with ID ${id} not found`);
    }

    return matchingQuestion;
  }

  async update(
    id: number,
    updateMatchingQuestionDto: UpdateMatchingQuestionDto,
  ): Promise<MatchingQuestion> {
    const matchingQuestion = await this.findOne(id);
    Object.assign(matchingQuestion, updateMatchingQuestionDto);
    return await this.matchingQuestionRepository.save(matchingQuestion);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.matchingQuestionRepository.softDelete(id);
  }
}
