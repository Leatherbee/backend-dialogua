import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from '../levels/entities/level.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizOption } from '../quiz-option/entities/quiz-option.entity';
import { Roleplay } from '../roleplay/entities/roleplay.entity';
import { RoleplayTurn } from '../roleplay-turn/entities/roleplay-turn.entity';
import { LevelContentController } from './level-content.controller';
import { LevelContentService } from './level-content.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Level, Quiz, QuizOption, Roleplay, RoleplayTurn]),
  ],
  controllers: [LevelContentController],
  providers: [LevelContentService],
  exports: [LevelContentService],
})
export class LevelContentModule {}
