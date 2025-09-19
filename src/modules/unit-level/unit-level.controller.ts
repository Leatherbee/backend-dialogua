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
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UnitLevelService } from './unit-level.service';
import { CreateUnitLevelDto, UpdateUnitLevelDto } from './dto';

@ApiTags('Unit Levels')
@Controller('unit-level')
export class UnitLevelController {
  constructor(private readonly unitLevelService: UnitLevelService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new unit level',
    description:
      'Creates a new level within a specific unit with name, description, position, and metadata',
  })
  @ApiBody({
    description: 'Unit level creation data',
    type: CreateUnitLevelDto,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Level name',
          maxLength: 255,
          example: 'Basic Vocabulary',
        },
        description: {
          type: 'string',
          description: 'Level description',
          example: 'Introduction to basic vocabulary and phrases',
          nullable: true,
        },
        position: {
          type: 'integer',
          description: 'Position order within the unit',
          minimum: 0,
          example: 1,
          nullable: true,
        },
        unit_id: {
          type: 'integer',
          description: 'ID of the unit this level belongs to',
          minimum: 1,
          example: 1,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the level',
          example: { difficulty: 'beginner', estimatedTime: 30 },
          nullable: true,
        },
      },
      required: ['name', 'unit_id'],
    },
    examples: {
      basic: {
        summary: 'Basic level creation',
        value: {
          name: 'Introduction to Greetings',
          description: 'Learn basic greeting expressions',
          position: 1,
          unit_id: 1,
        },
      },
      withMetadata: {
        summary: 'Level with metadata',
        value: {
          name: 'Advanced Conversations',
          description: 'Practice complex conversation scenarios',
          position: 3,
          unit_id: 1,
          metadata: {
            difficulty: 'advanced',
            estimatedTime: 45,
            prerequisites: ['basic-vocabulary'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Unit level successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Basic Vocabulary' },
        description: {
          type: 'string',
          example: 'Introduction to basic vocabulary and phrases',
        },
        position: { type: 'integer', example: 1 },
        unit_id: { type: 'integer', example: 1 },
        metadata: { type: 'object', example: { difficulty: 'beginner' } },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deletedAt: { type: 'string', format: 'date-time', nullable: true },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'name should not be empty',
            'unit_id must be a positive number',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  create(@Body() createUnitLevelDto: CreateUnitLevelDto) {
    return this.unitLevelService.create(createUnitLevelDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all unit levels or filter by unit',
    description:
      'Retrieves all unit levels ordered by position, or filters by unit ID if provided',
  })
  @ApiQuery({
    name: 'unitId',
    required: false,
    type: 'integer',
    description: 'Filter levels by unit ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of unit levels successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Basic Vocabulary' },
          description: {
            type: 'string',
            example: 'Introduction to basic vocabulary and phrases',
          },
          position: { type: 'integer', example: 1 },
          unit_id: { type: 'integer', example: 1 },
          metadata: { type: 'object', example: { difficulty: 'beginner' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          unit: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              title: { type: 'string', example: 'Family and Relationships' },
              description: {
                type: 'string',
                example: 'Learn vocabulary about family',
              },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  findAll(@Query('unitId', ParseIntPipe) unitId?: number) {
    if (unitId) {
      return this.unitLevelService.findByUnit(unitId);
    }
    return this.unitLevelService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get a unit level by ID',
    description:
      'Retrieves a specific unit level by its ID with related unit information',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Unit level ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit level successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Basic Vocabulary' },
        description: {
          type: 'string',
          example: 'Introduction to basic vocabulary and phrases',
        },
        position: { type: 'integer', example: 1 },
        unit_id: { type: 'integer', example: 1 },
        metadata: { type: 'object', example: { difficulty: 'beginner' } },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deletedAt: { type: 'string', format: 'date-time', nullable: true },
        unit: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Family and Relationships' },
            description: {
              type: 'string',
              example: 'Learn vocabulary about family',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Unit level not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 404 },
        message: { type: 'string', example: 'UnitLevel with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID parameter',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitLevelService.findOne(id);
  }

  @Public()
  @Get('unit/:unitId')
  @ApiOperation({
    summary: 'Get all levels for a specific unit',
    description:
      'Retrieves all levels belonging to a specific unit, ordered by position',
  })
  @ApiParam({
    name: 'unitId',
    type: 'integer',
    description: 'Unit ID to get levels for',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit levels successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Basic Vocabulary' },
          description: {
            type: 'string',
            example: 'Introduction to basic vocabulary and phrases',
          },
          position: { type: 'integer', example: 1 },
          unit_id: { type: 'integer', example: 1 },
          metadata: { type: 'object', example: { difficulty: 'beginner' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          unit: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              title: { type: 'string', example: 'Family and Relationships' },
              description: {
                type: 'string',
                example: 'Learn vocabulary about family',
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid unit ID parameter',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  findByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.unitLevelService.findByUnit(unitId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a unit level',
    description: 'Updates an existing unit level with new information',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Unit level ID to update',
    example: 1,
  })
  @ApiBody({
    description: 'Unit level update data',
    type: UpdateUnitLevelDto,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Level name',
          maxLength: 255,
          example: 'Advanced Vocabulary',
        },
        description: {
          type: 'string',
          description: 'Level description',
          example: 'Advanced vocabulary and complex phrases',
          nullable: true,
        },
        position: {
          type: 'integer',
          description: 'Position order within the unit',
          minimum: 0,
          example: 2,
          nullable: true,
        },
        unit_id: {
          type: 'integer',
          description: 'ID of the unit this level belongs to',
          minimum: 1,
          example: 1,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the level',
          example: { difficulty: 'advanced', estimatedTime: 45 },
          nullable: true,
        },
      },
    },
    examples: {
      partial: {
        summary: 'Partial update',
        value: {
          name: 'Intermediate Vocabulary',
          description: 'Intermediate level vocabulary practice',
        },
      },
      complete: {
        summary: 'Complete update',
        value: {
          name: 'Advanced Conversations',
          description: 'Practice advanced conversation scenarios',
          position: 3,
          metadata: {
            difficulty: 'advanced',
            estimatedTime: 60,
            prerequisites: ['intermediate-vocabulary'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Unit level successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Advanced Vocabulary' },
        description: {
          type: 'string',
          example: 'Advanced vocabulary and complex phrases',
        },
        position: { type: 'integer', example: 2 },
        unit_id: { type: 'integer', example: 1 },
        metadata: { type: 'object', example: { difficulty: 'advanced' } },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deletedAt: { type: 'string', format: 'date-time', nullable: true },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Unit level not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 404 },
        message: { type: 'string', example: 'UnitLevel with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or ID parameter',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['name should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitLevelDto: UpdateUnitLevelDto,
  ) {
    return this.unitLevelService.update(id, updateUnitLevelDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a unit level',
    description: 'Soft deletes a unit level by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Unit level ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit level successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unit level successfully deleted' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Unit level not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 404 },
        message: { type: 'string', example: 'UnitLevel with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID parameter',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitLevelService.remove(id);
  }
}
