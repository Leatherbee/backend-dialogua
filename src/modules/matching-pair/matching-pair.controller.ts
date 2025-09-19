import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
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
import { MatchingPairService } from './matching-pair.service';
import { CreateMatchingPairDto, UpdateMatchingPairDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Matching Pairs')
@Controller('matching-pairs')
export class MatchingPairController {
  constructor(private readonly matchingPairService: MatchingPairService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new matching pair',
    description:
      'Creates a new matching pair with left and right items for a specific matching question',
  })
  @ApiBody({
    description: 'Matching pair creation data',
    type: CreateMatchingPairDto,
    schema: {
      type: 'object',
      properties: {
        left_item: {
          type: 'string',
          maxLength: 255,
          description: 'The left item in the matching pair',
          example: 'Nasi Goreng',
        },
        right_item: {
          type: 'string',
          maxLength: 255,
          description: 'The right item in the matching pair',
          example: 'Indonesian Fried Rice',
        },
        matching_question_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the matching question this pair belongs to',
          example: 1,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the matching pair',
          example: { difficulty: 'easy', category: 'food', points: 5 },
          nullable: true,
        },
      },
      required: ['left_item', 'right_item', 'matching_question_id'],
    },
    examples: {
      foodPair: {
        summary: 'Food matching pair',
        value: {
          left_item: 'Nasi Goreng',
          right_item: 'Indonesian Fried Rice',
          matching_question_id: 1,
          metadata: { difficulty: 'easy', category: 'food' },
        },
      },
      languagePair: {
        summary: 'Language translation pair',
        value: {
          left_item: 'Selamat pagi',
          right_item: 'Good morning',
          matching_question_id: 2,
          metadata: {
            difficulty: 'beginner',
            category: 'greetings',
            points: 3,
          },
        },
      },
      culturePair: {
        summary: 'Cultural concept pair',
        value: {
          left_item: 'Batik',
          right_item: 'Traditional Indonesian textile art',
          matching_question_id: 3,
          metadata: {
            difficulty: 'intermediate',
            category: 'culture',
            points: 8,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Matching pair created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        left_item: { type: 'string', example: 'Nasi Goreng' },
        right_item: { type: 'string', example: 'Indonesian Fried Rice' },
        matching_question_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { difficulty: 'easy', category: 'food' },
          nullable: true,
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
    description: 'Internal server error during matching pair creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createMatchingPairDto: CreateMatchingPairDto) {
    return this.matchingPairService.create(createMatchingPairDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all matching pairs',
    description:
      'Retrieves all matching pairs with optional filtering by matching question ID',
  })
  @ApiQuery({
    name: 'matchingQuestionId',
    type: 'integer',
    required: false,
    description: 'Filter by matching question ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Matching pairs retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          left_item: { type: 'string', example: 'Nasi Goreng' },
          right_item: { type: 'string', example: 'Indonesian Fried Rice' },
          matching_question_id: { type: 'integer', example: 1 },
          metadata: {
            type: 'object',
            example: { difficulty: 'easy', category: 'food' },
            nullable: true,
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
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching pairs retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(@Query('matchingQuestionId') matchingQuestionId?: string) {
    if (matchingQuestionId) {
      return this.matchingPairService.findByMatchingQuestion(
        +matchingQuestionId,
      );
    }
    return this.matchingPairService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get matching pair by ID',
    description: 'Retrieves a specific matching pair by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Matching pair ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Matching pair retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        left_item: { type: 'string', example: 'Nasi Goreng' },
        right_item: { type: 'string', example: 'Indonesian Fried Rice' },
        matching_question_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { difficulty: 'easy', category: 'food' },
          nullable: true,
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
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid matching pair ID parameter',
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
    description: 'Matching pair not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'MatchingPair with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching pair retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchingPairService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update matching pair',
    description:
      'Updates a matching pair with new information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Matching pair ID',
    example: 1,
  })
  @ApiBody({
    description: 'Matching pair update data',
    type: UpdateMatchingPairDto,
    schema: {
      type: 'object',
      properties: {
        left_item: {
          type: 'string',
          maxLength: 255,
          description: 'The left item in the matching pair',
          example: 'Rendang',
        },
        right_item: {
          type: 'string',
          maxLength: 255,
          description: 'The right item in the matching pair',
          example: 'Spicy Indonesian beef curry',
        },
        matching_question_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the matching question this pair belongs to',
          example: 2,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the matching pair',
          example: {
            difficulty: 'intermediate',
            category: 'food',
            points: 10,
            updated: true,
          },
          nullable: true,
        },
      },
    },
    examples: {
      updateLeftItem: {
        summary: 'Update left item only',
        value: {
          left_item: 'Rendang',
        },
      },
      updateMultipleFields: {
        summary: 'Update multiple fields',
        value: {
          left_item: 'Gado-gado',
          right_item: 'Indonesian mixed vegetable salad with peanut sauce',
          metadata: {
            difficulty: 'intermediate',
            category: 'food',
            points: 12,
            updated: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Matching pair updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        left_item: { type: 'string', example: 'Rendang' },
        right_item: { type: 'string', example: 'Spicy Indonesian beef curry' },
        matching_question_id: { type: 'integer', example: 2 },
        metadata: {
          type: 'object',
          example: {
            difficulty: 'intermediate',
            category: 'food',
            points: 10,
            updated: true,
          },
          nullable: true,
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
    description: 'Matching pair not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'MatchingPair with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching pair update',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchingPairDto: UpdateMatchingPairDto,
  ) {
    return this.matchingPairService.update(id, updateMatchingPairDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete matching pair',
    description:
      'Soft deletes a matching pair by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Matching pair ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Matching pair deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        left_item: { type: 'string', example: 'Nasi Goreng' },
        right_item: { type: 'string', example: 'Indonesian Fried Rice' },
        matching_question_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { difficulty: 'easy', category: 'food' },
          nullable: true,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T12:00:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T12:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid matching pair ID parameter',
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
    description: 'Matching pair not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'MatchingPair with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching pair deletion',
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
    return this.matchingPairService.remove(id);
  }
}
