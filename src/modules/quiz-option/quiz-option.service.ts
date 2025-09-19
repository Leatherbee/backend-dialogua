import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizOption } from './entities/quiz-option.entity';
import { CreateQuizOptionDto, UpdateQuizOptionDto } from './dto';

@Injectable()
export class QuizOptionService {
  constructor(
    @InjectRepository(QuizOption)
    private readonly quizOptionRepository: Repository<QuizOption>,
  ) {}

  /**
   * Create a new quiz option
   */
  async create(createQuizOptionDto: CreateQuizOptionDto): Promise<QuizOption> {
    const quizOption = this.quizOptionRepository.create(createQuizOptionDto);
    return await this.quizOptionRepository.save(quizOption);
  }

  /**
   * Find all quiz options
   */
  async findAll(): Promise<QuizOption[]> {
    return await this.quizOptionRepository.find({
      relations: ['quiz'],
    });
  }

  /**
   * Find quiz options by quiz
   */
  async findByQuiz(quizId: number): Promise<QuizOption[]> {
    return await this.quizOptionRepository.find({
      where: { quiz_id: quizId },
      relations: ['quiz'],
    });
  }

  /**
   * Find one quiz option by ID
   */
  async findOne(id: number): Promise<QuizOption> {
    const quizOption = await this.quizOptionRepository.findOne({
      where: { id },
      relations: ['quiz'],
    });

    if (!quizOption) {
      throw new NotFoundException(`QuizOption with ID ${id} not found`);
    }

    return quizOption;
  }

  /**
   * Update a quiz option
   */
  async update(
    id: number,
    updateQuizOptionDto: UpdateQuizOptionDto,
  ): Promise<QuizOption> {
    const quizOption = await this.findOne(id);
    Object.assign(quizOption, updateQuizOptionDto);
    return await this.quizOptionRepository.save(quizOption);
  }

  /**
   * Remove a quiz option (soft delete)
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.quizOptionRepository.softDelete(id);
  }
}
