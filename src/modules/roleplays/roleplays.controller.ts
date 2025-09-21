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
import { RoleplaysService } from './roleplays.service';
import { CreateRoleplayDto } from './dto/create-roleplay.dto';
import { UpdateRoleplayDto } from './dto/update-roleplay.dto';
import {
  RoleplayMessageDto,
  RoleplayResponseDto,
} from './dto/roleplay-interaction.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('roleplays')
@Public()
@Controller('roleplays')
export class RoleplaysController {
  constructor(private readonly roleplaysService: RoleplaysService) {}

  @Post()
  create(@Body() createRoleplayDto: CreateRoleplayDto) {
    return this.roleplaysService.create(createRoleplayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roleplays' })
  @ApiResponse({ status: 200, description: 'Returns all roleplays' })
  findAll() {
    return this.roleplaysService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get roleplay by ID' })
  @ApiResponse({ status: 200, description: 'Returns a specific roleplay' })
  findOne(@Param('id') id: string) {
    return this.roleplaysService.findOne(id);
  }

  @Get(':id/npc-turns')
  @ApiOperation({ summary: 'Get NPC turns for roleplay' })
  @ApiResponse({
    status: 200,
    description: 'Returns NPC turns for the roleplay',
  })
  @ApiResponse({ status: 404, description: 'Roleplay not found' })
  getNpcTurns(@Param('id') id: string, @Query('turnOrder') turnOrder?: number) {
    return this.roleplaysService.getNpcTurns(id, { turnOrder });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleplayDto: UpdateRoleplayDto,
  ) {
    return this.roleplaysService.update(id, updateRoleplayDto);
  }

  @Post(':id/message')
  @ApiOperation({ summary: 'Send message in roleplay conversation' })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully',
    type: RoleplayResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Roleplay not found' })
  @ApiResponse({ status: 400, description: 'Invalid message data' })
  sendMessage(
    @Param('id') id: string,
    @Body() messageDto: RoleplayMessageDto,
  ): Promise<RoleplayResponseDto> {
    return this.roleplaysService.sendMessage(id, messageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleplaysService.remove(id);
  }
}
