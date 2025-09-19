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
import { RoleplayAttemptService } from './roleplay-attempt.service';
import { CreateRoleplayAttemptDto, UpdateRoleplayAttemptDto } from './dto';

@Controller('roleplay-attempt')
export class RoleplayAttemptController {
  constructor(
    private readonly roleplayAttemptService: RoleplayAttemptService,
  ) {}

  @Post()
  create(@Body() createRoleplayAttemptDto: CreateRoleplayAttemptDto) {
    return this.roleplayAttemptService.create(createRoleplayAttemptDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('roleplayId', ParseIntPipe) roleplayId?: number,
  ) {
    if (userId) {
      return this.roleplayAttemptService.findByUser(userId);
    }
    if (roleplayId) {
      return this.roleplayAttemptService.findByRoleplay(roleplayId);
    }
    return this.roleplayAttemptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleplayAttemptService.findOne(id);
  }

  @Get('user/:userId/roleplay/:roleplayId')
  findByUserAndRoleplay(
    @Param('userId') userId: string,
    @Param('roleplayId', ParseIntPipe) roleplayId: number,
  ) {
    return this.roleplayAttemptService.findByUserAndRoleplay(
      userId,
      roleplayId,
    );
  }

  @Post('complete')
  markCompleted(
    @Body()
    body: {
      userId: string;
      roleplayId: number;
      score?: number;
      feedback?: string;
    },
  ) {
    return this.roleplayAttemptService.markCompleted(
      body.userId,
      body.roleplayId,
      body.score,
      body.feedback,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleplayAttemptDto: UpdateRoleplayAttemptDto,
  ) {
    return this.roleplayAttemptService.update(id, updateRoleplayAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleplayAttemptService.remove(id);
  }
}
