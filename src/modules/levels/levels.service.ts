import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Roleplay } from '../roleplays/entities/roleplay.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Roleplay)
    private roleplayRepository: Repository<Roleplay>,
  ) {}

  create(createLevelDto: CreateLevelDto) {
    return 'This action adds a new level';
  }

  findAll() {
    return this.levelRepository.find({
      relations: ['program', 'quizzes', 'roleplays'],
    });
  }

  async findOne(id: string) {
    const level = await this.levelRepository.findOne({
      where: { id },
      relations: ['program', 'quizzes', 'roleplays'],
    });

    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }

    return level;
  }

  async findByLevelNumber(levelNumber: number) {
    const levels = await this.levelRepository.find({
      where: { levelNumber },
      relations: ['program', 'quizzes', 'roleplays'],
      order: { createdAt: 'ASC' },
    });

    if (levels.length === 0) {
      throw new NotFoundException(`No levels found with level number ${levelNumber}`);
    }

    return levels;
  }

  update(id: string, updateLevelDto: UpdateLevelDto) {
    return `This action updates a #${id} level`;
  }

  remove(id: string) {
    return `This action removes a #${id} level`;
  }

  async findQuizzesByLevelId(levelId: string) {
    // Verify level exists
    const level = await this.levelRepository.findOne({
      where: { id: levelId },
    });

    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    // Get quizzes with all related data
    const quizzes = await this.quizRepository.find({
      where: { level: { id: levelId } },
      relations: [
        'options',
        'options.media',
        'matchingPairs',
        'matchingPairs.leftMedia',
        'matchingPairs.rightMedia',
        'media',
      ],
      order: { createdAt: 'ASC' },
    });

    return quizzes;
  }

  async findRoleplaysByLevelId(levelId: string) {
    // Verify level exists
    const level = await this.levelRepository.findOne({
      where: { id: levelId },
    });

    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    // Get roleplays with all turns
    const roleplays = await this.roleplayRepository.find({
      where: { level: { id: levelId } },
      relations: ['turns'],
      order: { createdAt: 'ASC' },
    });

    // Sort turns by turnOrder for each roleplay
    roleplays.forEach((roleplay) => {
      roleplay.turns.sort((a, b) => a.turnOrder - b.turnOrder);
    });

    return roleplays;
  }
}
