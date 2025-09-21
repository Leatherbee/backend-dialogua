import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('progress')
@Public()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user progress' })
  @ApiResponse({ status: 200, description: 'Returns user progress data' })
  findAll(@Request() req: any) {
    const userId = req.user?.sub;
    if (userId) {
      return this.progressService.findAllByUserId(userId);
    }
    return this.progressService.findAll();
  }

  @Get('users/:id/overview')
  @ApiOperation({ summary: 'Get user progress overview' })
  @ApiResponse({
    status: 200,
    description:
      'Returns user progress overview with completed levels and programs',
  })
  getUserOverview(@Param('id') userId: string) {
    return this.progressService.getUserOverview(userId);
  }

  @Get('users/:id/stats')
  @ApiOperation({ summary: 'Get user progress statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns user progress statistics and metrics',
  })
  getUserStats(@Param('id') userId: string) {
    return this.progressService.getUserStats(userId);
  }

  @Get('users/:id/levels')
  @ApiOperation({ summary: 'Get user progress through all levels' })
  @ApiResponse({
    status: 200,
    description:
      'Returns detailed user progress for all levels organized by program, including completion status and timestamps',
  })
  getUserLevelProgress(@Param('id') userId: string) {
    return this.progressService.getUserLevelProgress(userId);
  }

  @Post('users/:userId/levels/:levelId/complete')
  @ApiOperation({ summary: 'Mark a level as completed for a user' })
  @ApiResponse({
    status: 200,
    description: 'Level marked as completed successfully',
  })
  markLevelCompleted(
    @Param('userId') userId: string,
    @Param('levelId') levelId: string,
  ) {
    return this.progressService.markLevelCompleted(userId, levelId);
  }

  @Patch('users/:userId/levels/:levelId')
  @ApiOperation({ summary: 'Update level progress for a user' })
  @ApiResponse({
    status: 200,
    description: 'Level progress updated successfully',
  })
  updateLevelProgress(
    @Param('userId') userId: string,
    @Param('levelId') levelId: string,
    @Body() body: { completed: boolean },
  ) {
    return this.progressService.updateLevelProgress(
      userId,
      levelId,
      body.completed,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update(+id, updateProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(+id);
  }
}
