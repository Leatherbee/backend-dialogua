import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevelProgress } from './entities/user-level-progress.entity';
import { CreateUserLevelProgressDto, UpdateUserLevelProgressDto } from './dto';

@Injectable()
export class UserLevelProgressService {
  constructor(
    @InjectRepository(UserLevelProgress)
    private readonly userLevelProgressRepository: Repository<UserLevelProgress>,
  ) {}

  async create(
    createUserLevelProgressDto: CreateUserLevelProgressDto,
  ): Promise<UserLevelProgress> {
    const userLevelProgress = this.userLevelProgressRepository.create(
      createUserLevelProgressDto,
    );
    return await this.userLevelProgressRepository.save(userLevelProgress);
  }

  async findAll(): Promise<UserLevelProgress[]> {
    return await this.userLevelProgressRepository.find({
      relations: ['user', 'unitLevel'],
    });
  }

  async findByUser(userId: string): Promise<UserLevelProgress[]> {
    return await this.userLevelProgressRepository.find({
      where: { user_id: userId },
      relations: ['user', 'unitLevel'],
      order: { unit_level_id: 'ASC' },
    });
  }

  async findByUnitLevel(unitLevelId: number): Promise<UserLevelProgress[]> {
    return await this.userLevelProgressRepository.find({
      where: { unit_level_id: unitLevelId },
      relations: ['user', 'unitLevel'],
    });
  }

  async findOne(id: number): Promise<UserLevelProgress> {
    const userLevelProgress = await this.userLevelProgressRepository.findOne({
      where: { id },
      relations: ['user', 'unitLevel'],
    });

    if (!userLevelProgress) {
      throw new NotFoundException(`UserLevelProgress with ID ${id} not found`);
    }

    return userLevelProgress;
  }

  async findByUserAndUnitLevel(
    userId: string,
    unitLevelId: number,
  ): Promise<UserLevelProgress | null> {
    return await this.userLevelProgressRepository.findOne({
      where: { user_id: userId, unit_level_id: unitLevelId },
      relations: ['user', 'unitLevel'],
    });
  }

  async update(
    id: number,
    updateUserLevelProgressDto: UpdateUserLevelProgressDto,
  ): Promise<UserLevelProgress> {
    const userLevelProgress = await this.findOne(id);
    Object.assign(userLevelProgress, updateUserLevelProgressDto);

    if (
      updateUserLevelProgressDto.completed &&
      !userLevelProgress.completed_at
    ) {
      userLevelProgress.completed_at = new Date();
    }

    return await this.userLevelProgressRepository.save(userLevelProgress);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.userLevelProgressRepository.delete(id);
  }

  async markCompleted(
    userId: string,
    unitLevelId: number,
    score?: number,
  ): Promise<UserLevelProgress> {
    let userLevelProgress = await this.findByUserAndUnitLevel(
      userId,
      unitLevelId,
    );

    if (!userLevelProgress) {
      userLevelProgress = await this.create({
        user_id: userId,
        unit_level_id: unitLevelId,
        completed: true,
        score,
        attempts: 1,
      });
    } else {
      userLevelProgress.completed = true;
      userLevelProgress.completed_at = new Date();
      userLevelProgress.attempts += 1;
      if (score !== undefined) {
        userLevelProgress.score = score;
      }
      await this.userLevelProgressRepository.save(userLevelProgress);
    }

    return userLevelProgress;
  }
}
