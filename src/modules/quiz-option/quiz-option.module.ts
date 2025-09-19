import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizOptionService } from './quiz-option.service';
import { QuizOptionController } from './quiz-option.controller';
import { QuizOption } from './entities/quiz-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizOption])],
  controllers: [QuizOptionController],
  providers: [QuizOptionService],
  exports: [QuizOptionService],
})
export class QuizOptionModule {}
