import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { Level } from './entities/level.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Roleplay } from '../roleplays/entities/roleplay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Level, Quiz, Roleplay])],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {}
