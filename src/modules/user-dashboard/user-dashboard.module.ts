import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../program/entities/program.entity';
import { Unit } from '../unit/entities/unit.entity';
import { Level } from '../levels/entities/level.entity';
import { UserLevelProgress } from '../user-level-progress/entities/user-level-progress.entity';
import { UserDashboardController } from './user-dashboard.controller';
import { UserDashboardService } from './user-dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, Unit, Level, UserLevelProgress]),
  ],
  controllers: [UserDashboardController],
  providers: [UserDashboardService],
  exports: [UserDashboardService],
})
export class UserDashboardModule {}
