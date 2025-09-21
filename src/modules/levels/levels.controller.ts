import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelsService } from './levels.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('levels')
@Public()
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all levels or filter by level number' })
  @ApiResponse({
    status: 200,
    description: 'Returns all levels or filtered by level number',
  })
  findAll(@Query('levelNumber') levelNumber?: string) {
    return this.levelsService.findAll(
      levelNumber ? parseInt(levelNumber, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelsService.findOne(id);
  }

  @Get(':id/quizzes')
  @ApiOperation({ summary: 'Get quizzes for a specific level' })
  @ApiResponse({
    status: 200,
    description: 'Returns all quizzes for the level',
  })
  findQuizzes(@Param('id') id: string) {
    return this.levelsService.findQuizzes(id);
  }

  @Get(':id/roleplays')
  @ApiOperation({ summary: 'Get roleplays for a specific level' })
  @ApiResponse({
    status: 200,
    description: 'Returns all roleplays for the level',
  })
  findRoleplays(@Param('id') id: string) {
    return this.levelsService.findRoleplays(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
