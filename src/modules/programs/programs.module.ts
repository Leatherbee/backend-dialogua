import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { Program } from './entities/program.entity';
import { Level } from '../levels/entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program, Level])],
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class ProgramsModule {}
