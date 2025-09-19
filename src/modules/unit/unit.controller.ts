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
import { UnitService } from './unit.service';
import { CreateUnitDto, UpdateUnitDto } from './dto';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new unit',
    description:
      'Creates a new learning unit within a specific program with title, description, and ordering information',
  })
  @ApiBody({
    description: 'Unit creation data',
    type: CreateUnitDto,
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Unit title',
          example: 'Family and Relationships',
        },
        description: {
          type: 'string',
          description: 'Unit description',
          example:
            'Learn vocabulary and expressions related to family members and relationships',
          nullable: true,
        },
        image_url: {
          type: 'string',
          description: 'URL to unit cover image',
          example: 'https://example.com/images/family-unit.jpg',
          nullable: true,
        },
        order_index: {
          type: 'integer',
          description: 'Order position within the program',
          minimum: 0,
          example: 1,
          nullable: true,
        },
        program_id: {
          type: 'string',
          format: 'uuid',
          description: 'ID of the program this unit belongs to',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
      required: ['title', 'program_id'],
    },
    examples: {
      basic: {
        summary: 'Basic unit creation',
        value: {
          title: 'Greetings and Introductions',
          description: 'Learn basic greetings and how to introduce yourself',
          program_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
      complete: {
        summary: 'Complete unit with all fields',
        value: {
          title: 'Food and Dining',
          description:
            'Vocabulary and phrases for ordering food and dining experiences',
          image_url: 'https://example.com/images/food-unit.jpg',
          order_index: 3,
          program_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Unit created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        title: { type: 'string', example: 'Family and Relationships' },
        description: {
          type: 'string',
          example:
            'Learn vocabulary and expressions related to family members and relationships',
        },
        image_url: {
          type: 'string',
          example: 'https://example.com/images/family-unit.jpg',
        },
        order_index: { type: 'integer', example: 1 },
        program_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
        program: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during unit creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all units or filter by program',
    description:
      'Retrieves all units in the system or filters units by program ID if provided. Units are ordered by their order_index',
  })
  @ApiQuery({
    name: 'programId',
    required: false,
    type: 'string',
    format: 'uuid',
    description: 'Filter units by program ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Units retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Family and Relationships' },
          description: {
            type: 'string',
            example:
              'Learn vocabulary and expressions related to family members and relationships',
          },
          image_url: {
            type: 'string',
            example: 'https://example.com/images/family-unit.jpg',
          },
          order_index: { type: 'integer', example: 1 },
          program_id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: null,
          },
          program: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              title: { type: 'string', example: 'BIPA Level 1' },
              description: {
                type: 'string',
                example: 'Beginner Indonesian language program',
              },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during units retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(@Query('programId') programId?: string) {
    if (programId) {
      return this.unitService.findByProgram(programId);
    }
    return this.unitService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get unit by ID',
    description:
      'Retrieves a specific unit by its ID with related program information',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Unit ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        title: { type: 'string', example: 'Family and Relationships' },
        description: {
          type: 'string',
          example:
            'Learn vocabulary and expressions related to family members and relationships',
        },
        image_url: {
          type: 'string',
          example: 'https://example.com/images/family-unit.jpg',
        },
        order_index: { type: 'integer', example: 1 },
        program_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
        program: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            title: { type: 'string', example: 'BIPA Level 1' },
            description: {
              type: 'string',
              example: 'Beginner Indonesian language program',
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
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Unit not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unit with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update unit',
    description:
      'Updates an existing unit with new information. All fields are optional',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Unit ID to update',
    example: 1,
  })
  @ApiBody({
    description: 'Unit update data (all fields optional)',
    type: UpdateUnitDto,
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Unit title',
          example: 'Family and Relationships - Updated',
        },
        description: {
          type: 'string',
          description: 'Unit description',
          example: 'Updated description for family and relationships unit',
          nullable: true,
        },
        image_url: {
          type: 'string',
          description: 'URL to unit cover image',
          example: 'https://example.com/images/family-unit-updated.jpg',
          nullable: true,
        },
        order_index: {
          type: 'integer',
          description: 'Order position within the program',
          minimum: 0,
          example: 2,
          nullable: true,
        },
        program_id: {
          type: 'string',
          format: 'uuid',
          description: 'ID of the program this unit belongs to',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
    examples: {
      titleOnly: {
        summary: 'Update title only',
        value: {
          title: 'Family and Social Relationships',
        },
      },
      multipleFields: {
        summary: 'Update multiple fields',
        value: {
          title: 'Family and Social Relationships',
          description:
            'Comprehensive unit covering family vocabulary and social relationship expressions',
          order_index: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Unit updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        title: {
          type: 'string',
          example: 'Family and Relationships - Updated',
        },
        description: {
          type: 'string',
          example: 'Updated description for family and relationships unit',
        },
        image_url: {
          type: 'string',
          example: 'https://example.com/images/family-unit-updated.jpg',
        },
        order_index: { type: 'integer', example: 2 },
        program_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T11:45:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
        program: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or ID parameter',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Unit not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unit with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete unit',
    description:
      'Soft deletes a unit by setting the deletedAt timestamp. The unit will no longer appear in normal queries',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Unit ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unit deleted successfully' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid unit ID parameter',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Unit not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unit with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during unit deletion',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitService.remove(id);
  }
}
