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
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelsService } from './levels.service';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  findAll(@Query('levelNumber') levelNumber?: string) {
    if (levelNumber) {
      const levelNum = parseInt(levelNumber, 10);
      if (isNaN(levelNum)) {
        throw new Error('levelNumber must be a valid number');
      }
      return this.levelsService.findByLevelNumber(levelNum);
    }
    return this.levelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }

  @Get(':id/quizzes')
  findQuizzes(@Param('id') id: string) {
    return this.levelsService.findQuizzesByLevelId(id);
  }

  @Get(':id/roleplays')
  findRoleplays(@Param('id') id: string) {
    return this.levelsService.findRoleplaysByLevelId(id);
  }
}
