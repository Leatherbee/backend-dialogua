import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitLevel } from './entities/unit-level.entity';
import { CreateUnitLevelDto, UpdateUnitLevelDto } from './dto';

@Injectable()
export class UnitLevelService {
  constructor(
    @InjectRepository(UnitLevel)
    private readonly unitLevelRepository: Repository<UnitLevel>,
  ) {}

  async create(createUnitLevelDto: CreateUnitLevelDto): Promise<UnitLevel> {
    const unitLevel = this.unitLevelRepository.create(createUnitLevelDto);
    return await this.unitLevelRepository.save(unitLevel);
  }

  async findAll(): Promise<UnitLevel[]> {
    return await this.unitLevelRepository
      .createQueryBuilder('unitLevel')
      .leftJoinAndSelect('unitLevel.unit', 'unit')
      .leftJoinAndSelect('unit.program', 'program')
      .leftJoinAndSelect('unitLevel.contentItems', 'contentItems')
      .leftJoinAndSelect('contentItems.mediaAsset', 'mediaAsset')
      .leftJoinAndSelect('contentItems.quiz', 'quiz')
      .leftJoinAndSelect('quiz.options', 'quizOptions')
      .leftJoinAndSelect('contentItems.roleplay', 'roleplay')
      .leftJoinAndSelect('roleplay.turns', 'roleplayTurns')
      .orderBy('unitLevel.position', 'ASC')
      .addOrderBy('contentItems.position', 'ASC')
      .addOrderBy('quizOptions.id', 'ASC')
      .addOrderBy('roleplayTurns.turn_order', 'ASC')
      .getMany();
  }

  async findByUnit(unitId: number): Promise<UnitLevel[]> {
    return await this.unitLevelRepository
      .createQueryBuilder('unitLevel')
      .leftJoinAndSelect('unitLevel.unit', 'unit')
      .leftJoinAndSelect('unit.program', 'program')
      .leftJoinAndSelect('unitLevel.contentItems', 'contentItems')
      .leftJoinAndSelect('contentItems.mediaAsset', 'mediaAsset')
      .leftJoinAndSelect('contentItems.quiz', 'quiz')
      .leftJoinAndSelect('quiz.options', 'quizOptions')
      .leftJoinAndSelect('contentItems.roleplay', 'roleplay')
      .leftJoinAndSelect('roleplay.turns', 'roleplayTurns')
      .where('unitLevel.unit_id = :unitId', { unitId })
      .orderBy('unitLevel.position', 'ASC')
      .addOrderBy('contentItems.position', 'ASC')
      .addOrderBy('quizOptions.id', 'ASC')
      .addOrderBy('roleplayTurns.turn_order', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<UnitLevel> {
    const unitLevel = await this.unitLevelRepository.findOne({
      where: { id },
      relations: ['unit'],
    });

    if (!unitLevel) {
      throw new NotFoundException(`UnitLevel with ID ${id} not found`);
    }

    return unitLevel;
  }

  async update(
    id: number,
    updateUnitLevelDto: UpdateUnitLevelDto,
  ): Promise<UnitLevel> {
    const unitLevel = await this.findOne(id);
    Object.assign(unitLevel, updateUnitLevelDto);
    return await this.unitLevelRepository.save(unitLevel);
  }

  async remove(id: number): Promise<void> {
    const unitLevel = await this.findOne(id);
    await this.unitLevelRepository.softRemove(unitLevel);
  }
}
