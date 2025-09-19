import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto, UpdateProgramDto } from './dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const program = this.programRepository.create(createProgramDto);

    // Generate BIPA ID if not provided
    if (!program.id) {
      program.id = await this.generateNextBipaId();
    }

    return await this.programRepository.save(program);
  }

  private async generateNextBipaId(): Promise<string> {
    // Find the highest existing BIPA number
    const existingPrograms = await this.programRepository.find({
      select: ['id'],
    });

    let nextNumber = 1;

    if (existingPrograms.length > 0) {
      // Extract numbers from existing BIPA IDs and find the maximum
      const numbers = existingPrograms
        .map((program) => {
          const match = program.id.match(/^BIPA(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((num) => num > 0);

      if (numbers.length > 0) {
        nextNumber = Math.max(...numbers) + 1;
      }
    }

    // Ensure we don't exceed BIPA7
    if (nextNumber > 7) {
      throw new Error('Maximum number of programs (BIPA7) has been reached');
    }

    return `BIPA${nextNumber}`;
  }

  async findAll(): Promise<Program[]> {
    return await this.programRepository.find({
      order: { order_index: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Program> {
    const program = await this.programRepository.findOne({
      where: { id },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }

    return program;
  }

  async update(
    id: string,
    updateProgramDto: UpdateProgramDto,
  ): Promise<Program> {
    const program = await this.findOne(id);
    Object.assign(program, updateProgramDto);
    return await this.programRepository.save(program);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.programRepository.softDelete(id);
  }
}
