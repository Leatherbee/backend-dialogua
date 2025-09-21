import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  create(_: CreateQuizDto) {
    return 'This action adds a new quiz';
  }

  findAll() {
    return this.quizRepository.find({
      relations: ['level', 'options', 'matchingPairs', 'media'],
    });
  }

  findOne(id: string) {
    return this.quizRepository.findOne({
      where: { id },
      relations: ['level', 'options', 'matchingPairs', 'media'],
    });
  }

  update(id: string, _: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: string) {
    return `This action removes a #${id} quiz`;
  }
}
