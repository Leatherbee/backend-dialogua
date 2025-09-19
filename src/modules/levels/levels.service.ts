import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const level = this.levelRepository.create(createLevelDto);
    return await this.levelRepository.save(level);
  }

  async findAll(): Promise<Level[]> {
    return await this.levelRepository
      .createQueryBuilder('level')
      .leftJoinAndSelect('level.unit', 'unit')
      .leftJoinAndSelect('level.quizzes', 'quizzes')
      .leftJoinAndSelect('level.roleplays', 'roleplays')
      .orderBy('level.position', 'ASC')
      .getMany();
  }

  async findByUnit(unitId: number): Promise<Level[]> {
    return await this.levelRepository
      .createQueryBuilder('level')
      .leftJoinAndSelect('level.unit', 'unit')
      .leftJoinAndSelect('level.quizzes', 'quizzes')
      .leftJoinAndSelect('level.roleplays', 'roleplays')
      .where('level.unit_id = :unitId', { unitId })
      .orderBy('level.position', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Level> {
    const level = await this.levelRepository.findOne({
      where: { id: id.toString() },
      relations: ['unit', 'quizzes', 'roleplays'],
    });

    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }

    return level;
  }

  async findByName(name: string): Promise<Level> {
    const level = await this.levelRepository.findOne({
      where: { name },
      relations: ['unit', 'quizzes', 'roleplays'],
    });

    if (!level) {
      throw new NotFoundException(`Level with name "${name}" not found`);
    }

    return level;
  }

  async update(id: number, updateLevelDto: UpdateLevelDto): Promise<Level> {
    const level = await this.findOne(id);
    Object.assign(level, updateLevelDto);
    return await this.levelRepository.save(level);
  }

  async remove(id: number): Promise<void> {
    const level = await this.findOne(id);
    await this.levelRepository.softRemove(level);
  }
}
