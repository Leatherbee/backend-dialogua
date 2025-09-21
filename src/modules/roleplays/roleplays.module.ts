import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleplaysService } from './roleplays.service';
import { RoleplaysController } from './roleplays.controller';
import { Roleplay } from './entities/roleplay.entity';
import { RoleplayTurn } from './entities/roleplay-turn.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roleplay, RoleplayTurn, User])],
  controllers: [RoleplaysController],
  providers: [RoleplaysService],
})
export class RoleplaysModule {}
