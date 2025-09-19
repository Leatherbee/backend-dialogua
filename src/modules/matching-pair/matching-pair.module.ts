import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingPairService } from './matching-pair.service';
import { MatchingPairController } from './matching-pair.controller';
import { MatchingPair } from './entities/matching-pair.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingPair])],
  controllers: [MatchingPairController],
  providers: [MatchingPairService],
  exports: [MatchingPairService],
})
export class MatchingPairModule {}
