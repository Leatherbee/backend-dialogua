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
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { SyncService } from './sync.service';
import { CreateSyncDto } from './dto/create-sync.dto';
import { UpdateSyncDto } from './dto/update-sync.dto';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get sync status for data tables' })
  @ApiQuery({
    name: 'since',
    required: false,
    description: 'ISO date string to check for updates since this date',
    example: '2024-01-01T00:00:00Z',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns sync status - either table timestamps or up-to-date status',
    examples: {
      'with-updates': {
        summary: 'When there are updates',
        value: {
          levels: '2024-01-15T10:30:00Z',
          quizzes: '2024-01-14T15:45:00Z',
          roleplays: '2024-01-13T09:20:00Z',
        },
      },
      'up-to-date': {
        summary: 'When no updates since specified date',
        value: {
          status: 'up-to-date',
        },
      },
    },
  })
  async getSyncStatus(@Query('since') since?: string) {
    return this.syncService.getSyncStatus(since);
  }

  @Post()
  create(@Body() createSyncDto: CreateSyncDto) {
    return this.syncService.create(createSyncDto);
  }

  @Get()
  findAll() {
    return this.syncService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syncService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSyncDto: UpdateSyncDto) {
    return this.syncService.update(+id, updateSyncDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.syncService.remove(+id);
  }
}
