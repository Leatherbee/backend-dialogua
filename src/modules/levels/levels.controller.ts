import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('levels')
@Controller('levels')
@Public()
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new level',
    description: 'Creates a new level with the provided information',
  })
  @ApiResponse({
    status: 201,
    description: 'Level successfully created',
    type: Level,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
  })
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all levels',
    description: 'Retrieves all levels ordered by position',
  })
  @ApiResponse({
    status: 200,
    description: 'List of levels successfully retrieved',
    type: [Level],
  })
  findAll() {
    return this.levelsService.findAll();
  }

  @Get('unit/:unitId')
  @ApiOperation({
    summary: 'Get levels by unit',
    description: 'Retrieves all levels for a specific unit',
  })
  @ApiParam({
    name: 'unitId',
    type: 'number',
    description: 'The ID of the unit',
  })
  @ApiResponse({
    status: 200,
    description: 'List of levels for the unit successfully retrieved',
    type: [Level],
  })
  findByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.levelsService.findByUnit(unitId);
  }

  @Get('name/:name')
  @ApiOperation({
    summary: 'Get level by name',
    description: 'Retrieves a specific level by its name',
  })
  @ApiParam({
    name: 'name',
    type: 'string',
    description: 'The name of the level',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully retrieved',
    type: Level,
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
  })
  findByName(@Param('name') name: string) {
    return this.levelsService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get level by ID',
    description: 'Retrieves a specific level by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the level',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully retrieved',
    type: Level,
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.levelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update level',
    description: 'Updates an existing level with the provided information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the level to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully updated',
    type: Level,
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete level',
    description: 'Soft deletes a level from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the level to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.levelsService.remove(id);
  }
}
