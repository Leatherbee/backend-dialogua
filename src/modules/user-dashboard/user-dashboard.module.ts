import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../program/entities/program.entity';
import { Unit } from '../unit/entities/unit.entity';
import { UnitLevel } from '../unit-level/entities/unit-level.entity';
import { UserLevelProgress } from '../user-level-progress/entities/user-level-progress.entity';
import { ContentItem } from '../content-item/entities/content-item.entity';
import { UserDashboardController } from './user-dashboard.controller';
import { UserDashboardService } from './user-dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Program,
      Unit,
      UnitLevel,
      UserLevelProgress,
      ContentItem,
    ]),
  ],
  controllers: [UserDashboardController],
  providers: [UserDashboardService],
  exports: [UserDashboardService],
})
export class UserDashboardModule {}