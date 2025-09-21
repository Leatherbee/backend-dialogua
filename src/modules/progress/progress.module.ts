import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { UserLevelProgress } from './entities/progress.entity';
import { Level } from '../levels/entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLevelProgress, Level])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
