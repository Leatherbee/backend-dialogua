import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import {
  QuizSubmissionResponseDto,
  QuestionFeedbackDto,
} from './dto/quiz-submission-response.dto';
import { Quiz } from './entities/quiz.entity';
import { QuizOption } from './entities/quiz-option.entity';
import { QuizMatchingPair } from './entities/quiz-matching-pair.entity';
import { UserLevelProgress } from '../progress/entities/progress.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizOption)
    private quizOptionRepository: Repository<QuizOption>,
    @InjectRepository(QuizMatchingPair)
    private quizMatchingPairRepository: Repository<QuizMatchingPair>,
    @InjectRepository(UserLevelProgress)
    private progressRepository: Repository<UserLevelProgress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createQuizDto: CreateQuizDto) {
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

  async submitQuiz(
    quizId: string,
    submitDto: SubmitQuizDto,
  ): Promise<QuizSubmissionResponseDto> {
    // Find the quiz with all related data
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: [
        'level',
        'level.program',
        'options',
        'matchingPairs',
        'media',
      ],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Validate user exists
    const user = await this.userRepository.findOneBy({
      id: submitDto.userId as any,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let correctAnswers = 0;
    let totalQuestions = 0;
    const feedback: QuestionFeedbackDto[] = [];

    // Process multiple choice answers
    if (submitDto.answers && quiz.options.length > 0) {
      totalQuestions += submitDto.answers.length;

      for (const answer of submitDto.answers) {
        const selectedOption = quiz.options.find(
          (opt) => opt.id === answer.selectedOptionId,
        );
        const correctOption = quiz.options.find((opt) => opt.isCorrect);

        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++;
        }

        feedback.push({
          questionId: answer.questionId,
          correct: selectedOption?.isCorrect || false,
          explanation: quiz.explanation || undefined,
          correctAnswerId: correctOption?.id,
        });
      }
    }

    // Process matching answers
    if (submitDto.matchingAnswers && quiz.matchingPairs.length > 0) {
      totalQuestions += submitDto.matchingAnswers.length;

      for (const matchingAnswer of submitDto.matchingAnswers) {
        // For matching questions, we need to validate if the pairing is correct
        // This is a simplified validation - you might need more complex logic
        const isCorrect = quiz.matchingPairs.some(
          (pair) =>
            pair.id === matchingAnswer.leftPairId ||
            pair.id === matchingAnswer.rightPairId,
        );

        if (isCorrect) {
          correctAnswers++;
        }

        feedback.push({
          questionId: matchingAnswer.leftPairId,
          correct: isCorrect,
          explanation: quiz.explanation || undefined,
        });
      }
    }

    if (totalQuestions === 0) {
      throw new BadRequestException('No answers provided');
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70; // 70% passing threshold

    // Update progress if quiz is passed
    let progressUpdated = false;
    if (passed) {
      try {
        const existingProgress = await this.progressRepository.findOne({
          where: {
            user: { id: submitDto.userId as any },
            level: { id: quiz.level.id },
          },
        });

        if (existingProgress) {
          existingProgress.completed = true;
          existingProgress.completedAt = new Date();
          existingProgress.lastPlayedAt = new Date();
          await this.progressRepository.save(existingProgress);
        } else {
          const newProgress = this.progressRepository.create({
            user: user,
            level: quiz.level,
            program: quiz.level.program,
            completed: true,
            completedAt: new Date(),
            lastPlayedAt: new Date(),
          });
          await this.progressRepository.save(newProgress);
        }
        progressUpdated = true;
      } catch (error) {
        console.error('Failed to update progress:', error);
        // Don't fail the quiz submission if progress update fails
      }
    }

    return {
      score,
      totalQuestions,
      correctAnswers,
      passed,
      feedback,
      progressUpdated,
    };
  }

  update(id: string, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: string) {
    return `This action removes a #${id} quiz`;
  }
}
