import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleplaysService } from './roleplays.service';
import { RoleplaysController } from './roleplays.controller';
import { Roleplay } from './entities/roleplay.entity';
import { RoleplayTurn } from './entities/roleplay-turn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roleplay, RoleplayTurn])],
  controllers: [RoleplaysController],
  providers: [RoleplaysService],
})
export class RoleplaysModule {}
