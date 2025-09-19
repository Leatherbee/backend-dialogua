import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserLevelProgressService } from './user-level-progress.service';
import { CreateUserLevelProgressDto, UpdateUserLevelProgressDto } from './dto';

@Controller('user-level-progress')
export class UserLevelProgressController {
  constructor(
    private readonly userLevelProgressService: UserLevelProgressService,
  ) {}

  @Post()
  create(@Body() createUserLevelProgressDto: CreateUserLevelProgressDto) {
    return this.userLevelProgressService.create(createUserLevelProgressDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('levelId', ParseIntPipe) levelId?: number,
  ) {
    if (userId) {
      return this.userLevelProgressService.findByUser(userId);
    }
    if (levelId) {
      return this.userLevelProgressService.findByLevel(levelId);
    }
    return this.userLevelProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userLevelProgressService.findOne(id);
  }

  @Get('user/:userId/level/:levelId')
  findByUserAndLevel(
    @Param('userId') userId: string,
    @Param('levelId', ParseIntPipe) levelId: number,
  ) {
    return this.userLevelProgressService.findByUserAndLevel(userId, levelId);
  }

  @Post('complete')
  markCompleted(
    @Body() body: { userId: string; levelId: number; score?: number },
  ) {
    return this.userLevelProgressService.markCompleted(
      body.userId,
      body.levelId,
      body.score,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserLevelProgressDto: UpdateUserLevelProgressDto,
  ) {
    return this.userLevelProgressService.update(id, updateUserLevelProgressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userLevelProgressService.remove(id);
  }
}
