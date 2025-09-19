import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleplayTurn } from './entities/roleplay-turn.entity';
import { RoleplayTurnController } from './roleplay-turn.controller';
import { RoleplayTurnService } from './roleplay-turn.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleplayTurn])],
  controllers: [RoleplayTurnController],
  providers: [RoleplayTurnService],
  exports: [RoleplayTurnService],
})
export class RoleplayTurnModule {}
