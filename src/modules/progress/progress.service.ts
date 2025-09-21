import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { UserLevelProgress } from './entities/progress.entity';
import { Level } from '../levels/entities/level.entity';
import type { UUID } from 'crypto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserLevelProgress)
    private progressRepository: Repository<UserLevelProgress>,
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  create(_: CreateProgressDto) {
    return 'This action adds a new progress';
  }

  findAllByUserId(userId: string) {
    return this.progressRepository.find({
      where: { user: { id: userId as any } },
      relations: ['program', 'level', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.progressRepository.find({
      relations: ['program', 'level', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserOverview(userId: string) {
    const progress = await this.progressRepository.find({
      where: { user: { id: userId as any } },
      relations: ['program', 'level', 'user'],
      order: { createdAt: 'DESC' },
    });

    const completedLevels = progress.filter((p) => p.completed);
    const totalLevels = progress.length;
    const completedPrograms = [
      ...new Set(completedLevels.map((p) => p.program.id)),
    ];

    return {
      userId,
      totalLevels,
      completedLevels: completedLevels.length,
      completionRate:
        totalLevels > 0 ? (completedLevels.length / totalLevels) * 100 : 0,
      programs: completedPrograms.length,
      recentProgress: progress.slice(0, 5),
      lastPlayedAt: progress.find((p) => p.lastPlayedAt)?.lastPlayedAt || null,
    };
  }

  async getUserStats(userId: string) {
    const progress = await this.progressRepository.find({
      where: { user: { id: userId as any } },
      relations: ['program', 'level'],
      order: { createdAt: 'DESC' },
    });

    const completedProgress = progress.filter((p) => p.completed);
    const totalProgress = progress.length;

    // Group by program
    const programStats = progress.reduce((acc, p) => {
      const programId = p.program.id;
      if (!acc[programId]) {
        acc[programId] = {
          programId,
          programTitle: p.program.title,
          totalLevels: 0,
          completedLevels: 0,
        };
      }
      acc[programId].totalLevels++;
      if (p.completed) {
        acc[programId].completedLevels++;
      }
      return acc;
    }, {});

    const programStatsArray = Object.values(programStats);

    return {
      userId,
      overview: {
        totalLevels: totalProgress,
        completedLevels: completedProgress.length,
        completionRate:
          totalProgress > 0
            ? (completedProgress.length / totalProgress) * 100
            : 0,
        totalPrograms: programStatsArray.length,
      },
      programBreakdown: programStatsArray,
      timeStats: {
        firstStarted:
          progress.length > 0 ? progress[progress.length - 1].createdAt : null,
        lastPlayed: progress.find((p) => p.lastPlayedAt)?.lastPlayedAt || null,
        lastCompleted:
          completedProgress.length > 0
            ? completedProgress[0].completedAt
            : null,
      },
    };
  }

  async getUserLevelProgress(userId: string) {
    // Get all levels with their programs
    const allLevels = await this.levelRepository.find({
      relations: ['program'],
      order: { levelNumber: 'ASC' },
    });

    // Get user's progress for all levels
    const userProgress = await this.progressRepository.find({
      where: { user: { id: userId as any } },
      relations: ['level', 'program'],
    });

    // Create a map of user progress by level ID for quick lookup
    const progressMap = new Map();
    userProgress.forEach((progress) => {
      progressMap.set(progress.level.id, progress);
    });

    // Group levels by program and add progress information
    const programsWithProgress = allLevels.reduce((acc, level) => {
      const programId = level.program.id;

      if (!acc[programId]) {
        acc[programId] = {
          program: {
            id: level.program.id,
            programCode: level.program.programCode,
            title: level.program.title,
            chapter: level.program.chapter,
            description: level.program.description,
          },
          levels: [],
          totalLevels: 0,
          completedLevels: 0,
        };
      }

      const userLevelProgress = progressMap.get(level.id);
      const levelWithProgress = {
        id: level.id,
        levelNumber: level.levelNumber,
        title: level.title,
        description: level.description,
        contentType: level.contentType,
        unitNumber: level.unitNumber,
        unitName: level.unitName,
        objective: level.objective,
        progress: userLevelProgress
          ? {
              completed: userLevelProgress.completed,
              completedAt: userLevelProgress.completedAt,
              lastPlayedAt: userLevelProgress.lastPlayedAt,
              createdAt: userLevelProgress.createdAt,
            }
          : {
              completed: false,
              completedAt: null,
              lastPlayedAt: null,
              createdAt: null,
            },
      };

      acc[programId].levels.push(levelWithProgress);
      acc[programId].totalLevels++;

      if (levelWithProgress.progress.completed) {
        acc[programId].completedLevels++;
      }

      return acc;
    }, {});

    const programs = Object.values(programsWithProgress);

    // Calculate overall statistics
    const totalLevels = allLevels.length;
    const completedLevels = userProgress.filter((p) => p.completed).length;
    const completionRate =
      totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

    return {
      userId,
      summary: {
        totalPrograms: programs.length,
        totalLevels,
        completedLevels,
        completionRate: Math.round(completionRate * 100) / 100,
      },
      programs,
    };
  }

  findOne(id: number) {
    return this.progressRepository.findOne({
      where: { id: id.toString() },
      relations: ['program', 'level', 'user'],
    });
  }

  async markLevelCompleted(userId: string, levelId: string) {
    // First, validate that the user exists
    const userRepository =
      this.progressRepository.manager.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Get the level to find its program
    const level = await this.levelRepository.findOne({
      where: { id: levelId },
      relations: ['program'],
    });

    if (!level) {
      throw new Error('Level not found');
    }

    // Check if progress record already exists
    const progressRecord = await this.progressRepository.findOne({
      where: {
        user: { id: userId as UUID },
        level: { id: levelId },
      },
      relations: ['user', 'level', 'program'],
    });

    const now = new Date();

    if (progressRecord) {
      // Update existing record
      progressRecord.completed = true;
      progressRecord.completedAt = now;
      progressRecord.lastPlayedAt = now;

      return await this.progressRepository.save(progressRecord);
    } else {
      // Create new progress record
      const newProgress = this.progressRepository.create({
        user: { id: userId as UUID },
        level: { id: levelId },
        program: { id: level.program.id },
        completed: true,
        completedAt: now,
        lastPlayedAt: now,
      });

      return await this.progressRepository.save(newProgress);
    }
  }

  async updateLevelProgress(
    userId: string,
    levelId: string,
    completed: boolean = false,
  ) {
    // First, validate that the user exists
    const userRepository =
      this.progressRepository.manager.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Get the level to find its program
    const level = await this.levelRepository.findOne({
      where: { id: levelId },
      relations: ['program'],
    });

    if (!level) {
      throw new Error('Level not found');
    }

    // Check if progress record already exists
    const progressRecord = await this.progressRepository.findOne({
      where: {
        user: { id: userId as UUID },
        level: { id: levelId },
      },
      relations: ['user', 'level', 'program'],
    });

    const now = new Date();

    if (progressRecord) {
      // Update existing record
      progressRecord.completed = completed;
      progressRecord.lastPlayedAt = now;

      if (completed && !progressRecord.completedAt) {
        progressRecord.completedAt = now;
      } else if (!completed) {
        progressRecord.completedAt = null;
      }

      return await this.progressRepository.save(progressRecord);
    } else {
      // Create new progress record
      const newProgress = this.progressRepository.create({
        user: { id: userId as UUID },
        level: { id: levelId },
        program: { id: level.program.id },
        completed,
        completedAt: completed ? now : null,
        lastPlayedAt: now,
      });

      return await this.progressRepository.save(newProgress);
    }
  }

  update(id: number, updateProgressDto: UpdateProgressDto) {
    return `This action updates a #${id} progress`;
  }

  remove(id: number) {
    return `This action removes a #${id} progress`;
  }
}
