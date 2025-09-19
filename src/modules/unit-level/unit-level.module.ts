import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitLevelService } from './unit-level.service';
import { UnitLevelController } from './unit-level.controller';
import { UnitLevel } from './entities/unit-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitLevel])],
  controllers: [UnitLevelController],
  providers: [UnitLevelService],
  exports: [UnitLevelService],
})
export class UnitLevelModule {}
