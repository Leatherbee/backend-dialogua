import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roleplay } from './entities/roleplay.entity';
import { RoleplayController } from './roleplay.controller';
import { RoleplayService } from './roleplay.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roleplay])],
  controllers: [RoleplayController],
  providers: [RoleplayService],
  exports: [RoleplayService],
})
export class RoleplayModule {}
