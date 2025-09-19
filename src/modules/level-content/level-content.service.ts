import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../levels/entities/level.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizOption } from '../quiz-option/entities/quiz-option.entity';
import { Roleplay } from '../roleplay/entities/roleplay.entity';
import { RoleplayTurn } from '../roleplay-turn/entities/roleplay-turn.entity';

@Injectable()
export class LevelContentService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizOption)
    private readonly quizOptionRepository: Repository<QuizOption>,
    @InjectRepository(Roleplay)
    private readonly roleplayRepository: Repository<Roleplay>,
    @InjectRepository(RoleplayTurn)
    private readonly roleplayTurnRepository: Repository<RoleplayTurn>,
  ) {}

  async getLevelContent(levelId: string) {
    // Get level information with its content
    const level = await this.levelRepository.findOne({
      where: { id: levelId },
      relations: ['unit'],
    });

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    const response = {
      id: level.id,
      level: level.level,
      name: level.name,
      description: level.description,
      title: level.title,
      content: level.content,
      objective: level.objective,
      content_type: level.content_type,
      position: level.position,
      unit_id: level.unit_id,
      metadata: level.metadata,
      unit: level.unit,
      quiz: null,
      roleplay: null,
    };

    // Fetch specific content based on content_type
    if (level.content_type === 'quiz') {
      const quiz = await this.quizRepository.findOne({
        where: { level_id: levelId },
      });

      if (quiz) {
        const options = await this.quizOptionRepository.find({
          where: { quiz_id: quiz.id },
          order: { id: 'ASC' },
        });

        response.quiz = {
          id: quiz.id,
          question: quiz.question,
          explanation: quiz.explanation,
          metadata: quiz.metadata,
          options: options.map((option) => ({
            id: option.id,
            option_text: option.option_text,
            is_correct: option.is_correct,
            metadata: option.metadata,
          })),
        };
      }
    } else if (level.content_type === 'roleplay') {
      const roleplay = await this.roleplayRepository.findOne({
        where: { level_id: levelId },
      });

      if (roleplay) {
        const turns = await this.roleplayTurnRepository.find({
          where: { roleplay_id: roleplay.id },
          order: { turn_order: 'ASC' },
        });

        response.roleplay = {
          id: roleplay.id,
          scenario: roleplay.scenario,
          instructions: roleplay.instructions,
          character_name: roleplay.character_name,
          character_description: roleplay.character_description,
          metadata: roleplay.metadata,
          turns: turns.map((turn) => ({
            id: turn.id,
            turn_order: turn.turn_order,
            speaker: turn.speaker,
            message: turn.message,
            metadata: turn.metadata,
          })),
        };
      }
    }

    return response;
  }

  async getAllLevelsContent() {
    const levels = await this.levelRepository.find({
      relations: ['unit'],
      order: { position: 'ASC' },
    });

    const levelsWithContent = await Promise.all(
      levels.map(async (level) => {
        return this.getLevelContent(level.id);
      }),
    );

    return levelsWithContent;
  }

  async getLevelsByUnit(unitId: number) {
    const levels = await this.levelRepository.find({
      where: { unit_id: unitId },
      relations: ['unit'],
      order: { position: 'ASC' },
    });

    const levelsWithContent = await Promise.all(
      levels.map(async (level) => {
        return this.getLevelContent(level.id);
      }),
    );

    return levelsWithContent;
  }
}
