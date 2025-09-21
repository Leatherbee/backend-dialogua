import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { UpdateData } from './entities/sync.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UpdateData])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
