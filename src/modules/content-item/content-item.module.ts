import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItemService } from './content-item.service';
import { ContentItemController } from './content-item.controller';
import { ContentItem } from './entities/content-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItem])],
  controllers: [ContentItemController],
  providers: [ContentItemService],
  exports: [ContentItemService],
})
export class ContentItemModule {}
