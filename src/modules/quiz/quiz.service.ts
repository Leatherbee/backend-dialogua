import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto, UpdateQuizDto } from './dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  /**
   * Create a new quiz
   */
  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepository.create(createQuizDto);
    return await this.quizRepository.save(quiz);
  }

  /**
   * Find all quizzes
   */
  async findAll(): Promise<Quiz[]> {
    return await this.quizRepository.find({
      relations: ['contentItem', 'options'],
    });
  }

  /**
   * Find quizzes by level
   */
  async findByLevel(levelId: string): Promise<Quiz[]> {
    return await this.quizRepository.find({
      where: { level_id: levelId },
      relations: ['options'],
    });
  }

  /**
   * Find one quiz by ID
   */
  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  /**
   * Update a quiz
   */
  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id);
    Object.assign(quiz, updateQuizDto);
    return await this.quizRepository.save(quiz);
  }

  /**
   * Remove a quiz (soft delete)
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.quizRepository.softDelete(id);
  }
}
