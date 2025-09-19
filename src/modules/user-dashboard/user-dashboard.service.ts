import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../program/entities/program.entity';
import { Unit } from '../unit/entities/unit.entity';
import { UnitLevel } from '../unit-level/entities/unit-level.entity';
import { UserLevelProgress } from '../user-level-progress/entities/user-level-progress.entity';
import { ContentItem } from '../content-item/entities/content-item.entity';

@Injectable()
export class UserDashboardService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(UnitLevel)
    private readonly unitLevelRepository: Repository<UnitLevel>,
    @InjectRepository(UserLevelProgress)
    private readonly userLevelProgressRepository: Repository<UserLevelProgress>,
    @InjectRepository(ContentItem)
    private readonly contentItemRepository: Repository<ContentItem>,
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
      progressMap.set(progress.unit_level_id, progress);
    });

    // Get content counts for each level
    const contentCounts = await this.contentItemRepository
      .createQueryBuilder('content')
      .select('content.unit_level_id', 'levelId')
      .addSelect('COUNT(*)', 'contentCount')
      .groupBy('content.unit_level_id')
      .getRawMany();

    const contentCountMap = new Map();
    contentCounts.forEach((count) => {
      contentCountMap.set(
        parseInt(count.levelId),
        parseInt(count.contentCount),
      );
    });

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
          const contentCount = contentCountMap.get(level.id) || 0;
          const completedContent = progress?.completed_content || 0;
          const levelProgress =
            contentCount > 0 ? (completedContent / contentCount) * 100 : 0;
          const isCompleted = progress?.is_completed || false;

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
            isLocked,
            isCompleted,
            progress: Math.round(levelProgress),
            contentCount,
            completedContent,
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