import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('banner'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a new level',
    description:
      'Creates a new level with the provided information and optional banner image',
  })
  @ApiResponse({
    status: 201,
    description: 'Level successfully created',
    type: Level,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiBody({
    description: 'Level creation data with optional banner image upload',
    type: CreateLevelDto,
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createLevelDto: CreateLevelDto,
  ) {
    if (file) {
      createLevelDto.banner = file.filename;
    }
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all levels',
    description: 'Retrieves all levels ordered by level number',
  })
  @ApiResponse({
    status: 200,
    description: 'List of levels successfully retrieved',
    type: [Level],
  })
  findAll() {
    return this.levelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get level by ID',
    description: 'Retrieves a specific level by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the level',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully retrieved',
    type: Level,
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Level with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid UUID format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.levelsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('banner'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update level',
    description:
      'Updates an existing level with the provided information and optional banner image',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the level to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully updated',
    type: Level,
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Level with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or UUID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiBody({
    description: 'Level update data with optional banner image upload',
    type: UpdateLevelDto,
  })
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    if (file) {
      updateLevelDto.banner = file.filename;
    } else if (updateLevelDto.removeBanner) {
      updateLevelDto.banner = null;
    }
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete level',
    description: 'Permanently deletes a level from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the level to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Level successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Level deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Level with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid UUID format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
