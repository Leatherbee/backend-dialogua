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
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('programs')
@Public()
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiResponse({ status: 200, description: 'Returns all programs' })
  findAll() {
    return this.programsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  @Get(':id/levels')
  findLevels(@Param('id') id: string) {
    return this.programsService.findLevelsByProgramId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programsService.update(id, updateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programsService.remove(id);
  }
}
