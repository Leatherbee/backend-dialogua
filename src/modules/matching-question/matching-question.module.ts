import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingQuestionService } from './matching-question.service';
import { MatchingQuestionController } from './matching-question.controller';
import { MatchingQuestion } from './entities/matching-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingQuestion])],
  controllers: [MatchingQuestionController],
  providers: [MatchingQuestionService],
  exports: [MatchingQuestionService],
})
export class MatchingQuestionModule {}
