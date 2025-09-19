import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto } from './dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepository.create(createUnitDto);
    return await this.unitRepository.save(unit);
  }

  async findAll(): Promise<Unit[]> {
    return await this.unitRepository.find({
      relations: ['program'],
      order: { order_index: 'ASC' },
    });
  }

  async findByProgram(programId: string): Promise<Unit[]> {
    return await this.unitRepository.find({
      where: { program_id: programId },
      relations: ['program'],
      order: { order_index: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({
      where: { id },
      relations: ['program'],
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);
    Object.assign(unit, updateUnitDto);
    return await this.unitRepository.save(unit);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.unitRepository.softDelete(id);
  }
}
