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

import { ProgramModule } from './modules/program/program.module';
import { ContentItemModule } from './modules/content-item/content-item.module';
import { FormQuestionModule } from './modules/form-question/form-question.module';
import { FormFieldModule } from './modules/form-field/form-field.module';
import { RoleplayModule } from './modules/roleplay/roleplay.module';
import { RoleplayTurnModule } from './modules/roleplay-turn/roleplay-turn.module';
import { UserLevelProgressModule } from './modules/user-level-progress/user-level-progress.module';
import { UnitModule } from './modules/unit/unit.module';
import { UnitLevelModule } from './modules/unit-level/unit-level.module';
import { MediaAssetModule } from './modules/media-asset/media-asset.module';
import { RoleplayAttemptModule } from './modules/roleplay-attempt/roleplay-attempt.module';
import { MatchingPairModule } from './modules/matching-pair/matching-pair.module';
import { MatchingQuestionModule } from './modules/matching-question/matching-question.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuizOptionModule } from './modules/quiz-option/quiz-option.module';
import { UserDashboardModule } from './modules/user-dashboard/user-dashboard.module';
import { LevelContentModule } from './modules/level-content/level-content.module';
import { DocsModule } from './docs/docs.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ConversationsModule,
    UsersModule,
    AuthModule,
    SharedModule,
    CommonModule,
    HealthModule,

    ProgramModule,
    ContentItemModule,
    FormQuestionModule,
    FormFieldModule,
    RoleplayModule,
    RoleplayTurnModule,
    UserLevelProgressModule,
    UnitModule,
    UnitLevelModule,
    MediaAssetModule,
    RoleplayAttemptModule,
    MatchingPairModule,
    MatchingQuestionModule,
    QuizModule,
    QuizOptionModule,
    UserDashboardModule,
    LevelContentModule,
    DocsModule,
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
