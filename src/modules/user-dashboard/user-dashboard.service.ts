import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../program/entities/program.entity';
import { Unit } from '../unit/entities/unit.entity';
import { Level } from '../levels/entities/level.entity';
import { UserLevelProgress } from '../user-level-progress/entities/user-level-progress.entity';

@Injectable()
export class UserDashboardService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(UserLevelProgress)
    private readonly userLevelProgressRepository: Repository<UserLevelProgress>,
  ) {}

  async getUserDashboard(userId: string) {
    // Get all programs with their units and levels
    const programs = await this.programRepository.find({
      relations: ['units', 'units.levels'],
      order: {
        order_index: 'ASC',
        units: { order_index: 'ASC', levels: { position: 'ASC' } },
      },
    });

    if (!programs || programs.length === 0) {
      throw new NotFoundException('No programs found');
    }

    // Get user progress for all levels
    const userProgress = await this.userLevelProgressRepository.find({
      where: { user_id: userId },
    });

    // Create a map for quick progress lookup
    const progressMap = new Map();
    userProgress.forEach((progress) => {
      progressMap.set(progress.levelId, progress);
    });

    // Since levels now contain content directly, we don't need to count content items

    // Calculate overall user statistics
    let totalLevels = 0;
    let completedLevels = 0;
    let totalProgress = 0;

    // Process programs and add progress information
    const processedPrograms = programs.map((program) => ({
      id: program.id,
      title: program.title,
      description: program.description,
      order_index: program.order_index,
      units: program.units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        description: unit.description,
        order_index: unit.order_index,
        levels: unit.levels.map((level, index) => {
          totalLevels++;
          const progress = progressMap.get(level.id);
          const isCompleted = progress?.is_completed || false;

          // Since each level now contains its own content, progress is binary (0% or 100%)
          const levelProgress = isCompleted ? 100 : 0;

          if (isCompleted) {
            completedLevels++;
          }

          totalProgress += levelProgress;

          // Level is locked if:
          // 1. It's not the first level AND
          // 2. The previous level is not completed
          const isFirstLevel = index === 0;
          const previousLevel = index > 0 ? unit.levels[index - 1] : null;
          const previousLevelProgress = previousLevel
            ? progressMap.get(previousLevel.id)
            : null;
          const isLocked =
            !isFirstLevel &&
            (!previousLevelProgress || !previousLevelProgress.is_completed);

          return {
            id: level.id,
            name: level.name,
            position: level.position,
            content_type: level.content_type,
            isLocked,
            isCompleted,
            progress: levelProgress,
            metadata: level.metadata,
          };
        }),
      })),
    }));

    const averageProgress = totalLevels > 0 ? totalProgress / totalLevels : 0;

    return {
      user: {
        userId,
        totalProgress: Math.round(averageProgress * 100) / 100,
        completedLevels,
        totalLevels,
      },
      programs: processedPrograms,
    };
  }
}
