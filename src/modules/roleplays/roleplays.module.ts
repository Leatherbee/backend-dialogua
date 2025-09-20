import { Module } from '@nestjs/common';
import { RoleplaysService } from './roleplays.service';
import { RoleplaysController } from './roleplays.controller';

@Module({
  controllers: [RoleplaysController],
  providers: [RoleplaysService],
})
export class RoleplaysModule {}
