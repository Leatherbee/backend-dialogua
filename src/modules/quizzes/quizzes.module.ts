import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz } from './entities/quiz.entity';
import { QuizOption } from './entities/quiz-option.entity';
import { QuizMedia } from './entities/quiz-media.entity';
import { QuizMatchingPair } from './entities/quiz-matching-pair.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizOption, QuizMedia, QuizMatchingPair]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
