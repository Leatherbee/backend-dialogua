import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAssetService } from './media-asset.service';
import { MediaAssetController } from './media-asset.controller';
import { MediaAsset } from './entities/media-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaAsset])],
  controllers: [MediaAssetController],
  providers: [MediaAssetService],
  exports: [MediaAssetService],
})
export class MediaAssetModule {}
