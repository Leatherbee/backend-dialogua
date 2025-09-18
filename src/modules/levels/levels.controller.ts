import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('banner'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new level' })
  @ApiResponse({
    status: 201,
    description: 'The level has been successfully created.',
    type: Level,
  })
  @ApiBody({
    description: 'Create a new level with an optional banner image',
    type: CreateLevelDto,
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createLevelDto: CreateLevelDto,
  ) {
    if (file) {
      createLevelDto.banner = file.filename;
    }
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all levels' })
  @ApiResponse({
    status: 200,
    description: 'Return all levels.',
    type: [Level],
  })
  findAll() {
    return this.levelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a level by ID' })
  @ApiResponse({ status: 200, description: 'Return the level.', type: Level })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  findOne(@Param('id') id: string) {
    return this.levelsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('banner'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a level' })
  @ApiResponse({
    status: 200,
    description: 'The level has been successfully updated.',
    type: Level,
  })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  @ApiBody({
    description: 'Update a level with an optional banner image',
    type: UpdateLevelDto,
  })
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    if (file) {
      updateLevelDto.banner = file.filename;
    } else if (updateLevelDto.removeBanner) {
      updateLevelDto.banner = null;
    }
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a level' })
  @ApiResponse({
    status: 200,
    description: 'The level has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
