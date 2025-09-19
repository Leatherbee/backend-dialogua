import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormQuestionService } from './form-question.service';
import { FormQuestionController } from './form-question.controller';
import { FormQuestion } from './entities/form-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormQuestion])],
  controllers: [FormQuestionController],
  providers: [FormQuestionService],
  exports: [FormQuestionService],
})
export class FormQuestionModule {}
