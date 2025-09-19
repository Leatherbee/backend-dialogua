import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ContentItemService } from './content-item.service';
import { CreateContentItemDto, UpdateContentItemDto } from './dto';
import { ContentType } from '../../common/enums';

@Controller('content-items')
export class ContentItemController {
  constructor(private readonly contentItemService: ContentItemService) {}

  @Post()
  create(@Body() createContentItemDto: CreateContentItemDto) {
    return this.contentItemService.create(createContentItemDto);
  }

  @Get()
  findAll(
    @Query('unitLevelId', ParseIntPipe) unitLevelId?: number,
    @Query('type') type?: ContentType,
  ) {
    if (unitLevelId) {
      return this.contentItemService.findByUnitLevel(unitLevelId);
    }
    if (type) {
      return this.contentItemService.findByType(type);
    }
    return this.contentItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentItemDto: UpdateContentItemDto,
  ) {
    return this.contentItemService.update(id, updateContentItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contentItemService.remove(id);
  }
}
