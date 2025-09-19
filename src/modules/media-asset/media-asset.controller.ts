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
import { MediaAssetService } from './media-asset.service';
import { CreateMediaAssetDto, UpdateMediaAssetDto } from './dto';
import { MediaType } from '../../common/enums';

@Controller('media-assets')
export class MediaAssetController {
  constructor(private readonly mediaAssetService: MediaAssetService) {}

  @Post()
  create(@Body() createMediaAssetDto: CreateMediaAssetDto) {
    return this.mediaAssetService.create(createMediaAssetDto);
  }

  @Get()
  findAll(@Query('type') type?: MediaType) {
    if (type) {
      return this.mediaAssetService.findByType(type);
    }
    return this.mediaAssetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaAssetService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaAssetDto: UpdateMediaAssetDto,
  ) {
    return this.mediaAssetService.update(id, updateMediaAssetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediaAssetService.remove(id);
  }
}
