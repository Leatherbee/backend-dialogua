import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleplayAttemptService } from './roleplay-attempt.service';
import { RoleplayAttemptController } from './roleplay-attempt.controller';
import { RoleplayAttempt } from './entities/roleplay-attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleplayAttempt])],
  controllers: [RoleplayAttemptController],
  providers: [RoleplayAttemptService],
  exports: [RoleplayAttemptService],
})
export class RoleplayAttemptModule {}
