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
    return await this.unitLevelRepository.find({
      relations: ['unit'],
      order: { position: 'ASC' },
    });
  }

  async findByUnit(unitId: number): Promise<UnitLevel[]> {
    return await this.unitLevelRepository.find({
      where: { unit_id: unitId },
      relations: ['unit'],
      order: { position: 'ASC' },
    });
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
