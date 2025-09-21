import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  create(_: CreateLevelDto) {
    return 'This action adds a new level';
  }

  findAll(levelNumber?: number) {
    const whereCondition = levelNumber ? { levelNumber } : {};

    return this.levelRepository.find({
      where: whereCondition,
      relations: ['program', 'quizzes', 'roleplays'],
      order: { levelNumber: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.levelRepository.findOne({
      where: { id },
      relations: ['program'],
    });
  }

  findQuizzes(id: string) {
    return this.levelRepository
      .findOne({
        where: { id },
        relations: [
          'quizzes',
          'quizzes.options',
          'quizzes.options.media',
          'quizzes.matchingPairs',
          'quizzes.matchingPairs.leftMedia',
          'quizzes.matchingPairs.rightMedia',
          'quizzes.media',
        ],
      })
      .then((level) => level?.quizzes || []);
  }

  findRoleplays(id: string) {
    return this.levelRepository
      .findOne({
        where: { id },
        relations: ['roleplays', 'roleplays.turns'],
      })
      .then((level) => level?.roleplays || []);
  }

  update(id: string, updateLevelDto: UpdateLevelDto) {
    return `This action updates a #${id} level`;
  }

  remove(id: string) {
    return `This action removes a #${id} level`;
  }
}
