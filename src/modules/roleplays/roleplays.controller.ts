import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleplaysService } from './roleplays.service';
import { CreateRoleplayDto } from './dto/create-roleplay.dto';
import { UpdateRoleplayDto } from './dto/update-roleplay.dto';
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleplayDto: UpdateRoleplayDto,
  ) {
    return this.roleplaysService.update(id, updateRoleplayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleplaysService.remove(id);
  }
}
