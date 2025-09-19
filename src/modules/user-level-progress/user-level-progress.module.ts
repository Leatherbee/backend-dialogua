import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLevelProgressService } from './user-level-progress.service';
import { UserLevelProgressController } from './user-level-progress.controller';
import { UserLevelProgress } from './entities/user-level-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLevelProgress])],
  controllers: [UserLevelProgressController],
  providers: [UserLevelProgressService],
  exports: [UserLevelProgressService],
})
export class UserLevelProgressModule {}
