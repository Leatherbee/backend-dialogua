import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { Level } from '../levels/entities/level.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  create(createProgramDto: CreateProgramDto) {
    return 'This action adds a new program';
  }

  findAll() {
    return this.programRepository.find();
  }

  findOne(id: string) {
    return this.programRepository.findOne({ where: { id } });
  }

  update(id: string, updateProgramDto: UpdateProgramDto) {
    return `This action updates a #${id} program`;
  }

  remove(id: string) {
    return `This action removes a #${id} program`;
  }

  async findLevelsByProgramId(programId: string) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${programId} not found`);
    }

    return this.levelRepository.find({
      where: { program: { id: programId } },
      order: { levelNumber: 'ASC' },
    });
  }
}
