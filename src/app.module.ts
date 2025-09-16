import { Module } from '@nestjs/common';
import { AppConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { LevelsModule } from './modules/levels/levels.module';

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
    LevelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
