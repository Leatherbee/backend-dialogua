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
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<UserLevelProgress[]> {
    return await this.userLevelProgressRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { level_id: 'ASC' },
    });
  }

  async findByLevel(levelId: number): Promise<UserLevelProgress[]> {
    return await this.userLevelProgressRepository.find({
      where: { level_id: levelId },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<UserLevelProgress> {
    const userLevelProgress = await this.userLevelProgressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!userLevelProgress) {
      throw new NotFoundException(`UserLevelProgress with ID ${id} not found`);
    }

    return userLevelProgress;
  }

  async findByUserAndLevel(
    userId: string,
    levelId: number,
  ): Promise<UserLevelProgress | null> {
    return await this.userLevelProgressRepository.findOne({
      where: { user_id: userId, level_id: levelId },
      relations: ['user'],
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
    levelId: number,
    score?: number,
  ): Promise<UserLevelProgress> {
    let userLevelProgress = await this.findByUserAndLevel(userId, levelId);

    if (!userLevelProgress) {
      userLevelProgress = await this.create({
        user_id: userId,
        level_id: levelId,
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
