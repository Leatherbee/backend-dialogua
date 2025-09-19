import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchingPair } from './entities/matching-pair.entity';
import { CreateMatchingPairDto, UpdateMatchingPairDto } from './dto';

@Injectable()
export class MatchingPairService {
  constructor(
    @InjectRepository(MatchingPair)
    private readonly matchingPairRepository: Repository<MatchingPair>,
  ) {}

  async create(
    createMatchingPairDto: CreateMatchingPairDto,
  ): Promise<MatchingPair> {
    const matchingPair = this.matchingPairRepository.create(
      createMatchingPairDto,
    );
    return await this.matchingPairRepository.save(matchingPair);
  }

  async findAll(): Promise<MatchingPair[]> {
    return await this.matchingPairRepository.find({
      relations: ['matchingQuestion'],
    });
  }

  async findByMatchingQuestion(
    matchingQuestionId: number,
  ): Promise<MatchingPair[]> {
    return await this.matchingPairRepository.find({
      where: { matching_question_id: matchingQuestionId },
      relations: ['matchingQuestion'],
    });
  }

  async findOne(id: number): Promise<MatchingPair> {
    const matchingPair = await this.matchingPairRepository.findOne({
      where: { id },
      relations: ['matchingQuestion'],
    });

    if (!matchingPair) {
      throw new NotFoundException(`MatchingPair with ID ${id} not found`);
    }

    return matchingPair;
  }

  async update(
    id: number,
    updateMatchingPairDto: UpdateMatchingPairDto,
  ): Promise<MatchingPair> {
    const matchingPair = await this.findOne(id);
    Object.assign(matchingPair, updateMatchingPairDto);
    return await this.matchingPairRepository.save(matchingPair);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.matchingPairRepository.softDelete(id);
  }
}
