import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocsModule } from './docs/docs.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { ProgramsModule } from './modules/programs/programs.module';
import { LevelsModule } from './modules/levels/levels.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { RoleplaysModule } from './modules/roleplays/roleplays.module';
import { ProgressModule } from './modules/progress/progress.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLevelProgress } from './modules/progress/entities/progress.entity';
import { User } from './modules/users/entities/user.entity';
import { Program } from './modules/programs/entities/program.entity';
import { Level } from './modules/levels/entities/level.entity';
import { Quiz } from './modules/quizzes/entities/quiz.entity';
import { QuizOption } from './modules/quizzes/entities/quiz-option.entity';
import { QuizMedia } from './modules/quizzes/entities/quiz-media.entity';
import { QuizMatchingPair } from './modules/quizzes/entities/quiz-matching-pair.entity';
import { Roleplay } from './modules/roleplays/entities/roleplay.entity';
import { RoleplayTurn } from './modules/roleplays/entities/roleplay-turn.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'assets'),
      exclude: ['/api/{*test}'],
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    TypeOrmModule.forFeature([
      User,
      UserLevelProgress,
      Program,
      Level,
      Quiz,
      QuizOption,
      QuizMedia,
      QuizMatchingPair,
      Roleplay,
      RoleplayTurn,
      RefreshToken,
    ]),
    AppConfigModule,
    DatabaseModule,
    ConversationsModule,
    UsersModule,
    AuthModule,
    SharedModule,
    CommonModule,
    HealthModule,
    DocsModule,
    ProgramsModule,
    LevelsModule,
    QuizzesModule,
    RoleplaysModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
