import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitLevel } from '../unit-level/entities/unit-level.entity';
import { ContentItem } from '../content-item/entities/content-item.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizOption } from '../quiz-option/entities/quiz-option.entity';
import { Roleplay } from '../roleplay/entities/roleplay.entity';
import { RoleplayTurn } from '../roleplay-turn/entities/roleplay-turn.entity';

@Injectable()
export class LevelContentService {
  constructor(
    @InjectRepository(UnitLevel)
    private readonly unitLevelRepository: Repository<UnitLevel>,
    @InjectRepository(ContentItem)
    private readonly contentItemRepository: Repository<ContentItem>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizOption)
    private readonly quizOptionRepository: Repository<QuizOption>,
    @InjectRepository(Roleplay)
    private readonly roleplayRepository: Repository<Roleplay>,
    @InjectRepository(RoleplayTurn)
    private readonly roleplayTurnRepository: Repository<RoleplayTurn>,
  ) {}

  async getLevelContent(levelId: number) {
    // Get level information
    const level = await this.unitLevelRepository.findOne({
      where: { id: levelId },
    });

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    // Get all content items for this level
    const contentItems = await this.contentItemRepository.find({
      where: { unit_level_id: levelId },
      order: { position: 'ASC' },
    });

    // Process each content item and fetch related data
    const content = await Promise.all(
      contentItems.map(async (item) => {
        const baseContent = {
          id: item.id,
          content_type: item.content_type,
          title: item.title,
          description: item.description,
          position: item.position,
          metadata: item.metadata,
          quiz: null,
          roleplay: null,
        };

        if (item.content_type === 'quiz') {
          // Fetch quiz with options using content_item_id
          const quiz = await this.quizRepository.findOne({
            where: { content_item_id: item.id },
          });

          if (quiz) {
            const options = await this.quizOptionRepository.find({
              where: { quiz_id: quiz.id },
              order: { id: 'ASC' },
            });

            baseContent.quiz = {
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
        } else if (item.content_type === 'roleplay') {
          // Fetch roleplay with turns using content_item_id
          const roleplay = await this.roleplayRepository.findOne({
            where: { content_item_id: item.id },
          });

          if (roleplay) {
            const turns = await this.roleplayTurnRepository.find({
              where: { roleplay_id: roleplay.id },
              order: { turn_order: 'ASC' },
            });

            baseContent.roleplay = {
              id: roleplay.id,
              scenario: roleplay.scenario,
              instructions: roleplay.instructions,
              character_name: roleplay.character_name,
              character_description: roleplay.character_description,
              metadata: roleplay.metadata,
              turns: turns.map((turn) => ({
                id: turn.id,
                speaker: turn.speaker,
                message: turn.message,
                turn_order: turn.turn_order,
                metadata: turn.metadata,
              })),
            };
          }
        }

        return baseContent;
      }),
    );

    return {
      level: {
        id: level.id,
        name: level.name,
        description: level.description,
        position: level.position,
        metadata: level.metadata,
      },
      content,
    };
  }
}