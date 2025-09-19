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
import { MatchingQuestionService } from './matching-question.service';
import { CreateMatchingQuestionDto, UpdateMatchingQuestionDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Matching Questions')
@Controller('matching-questions')
export class MatchingQuestionController {
  constructor(
    private readonly matchingQuestionService: MatchingQuestionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new matching question',
    description:
      'Creates a new matching question with instructions and metadata for a specific content item',
  })
  @ApiBody({
    description: 'Matching question creation data',
    type: CreateMatchingQuestionDto,
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          maxLength: 500,
          description: 'The matching question text',
          example:
            'Match the Indonesian dishes with their English descriptions',
        },
        instructions: {
          type: 'string',
          description: 'Instructions for answering the question',
          example:
            'Drag and drop the Indonesian dish names to match them with their correct English descriptions.',
          nullable: true,
        },
        content_item_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the content item this question belongs to',
          example: 1,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the matching question',
          example: {
            difficulty: 'intermediate',
            category: 'food',
            points: 15,
            timeLimit: 120,
          },
          nullable: true,
        },
      },
      required: ['question', 'content_item_id'],
    },
    examples: {
      foodMatching: {
        summary: 'Food matching question',
        value: {
          question:
            'Match the Indonesian dishes with their English descriptions',
          instructions:
            'Drag and drop the Indonesian dish names to match them with their correct English descriptions.',
          content_item_id: 1,
          metadata: {
            difficulty: 'intermediate',
            category: 'food',
            points: 15,
          },
        },
      },
      languageMatching: {
        summary: 'Language translation matching',
        value: {
          question:
            'Match the Indonesian greetings with their English translations',
          instructions:
            'Connect each Indonesian greeting with its correct English meaning.',
          content_item_id: 2,
          metadata: {
            difficulty: 'beginner',
            category: 'greetings',
            points: 10,
            timeLimit: 60,
          },
        },
      },
      cultureMatching: {
        summary: 'Cultural concept matching',
        value: {
          question: 'Match Indonesian cultural items with their descriptions',
          instructions:
            'Pair each traditional Indonesian item with its cultural significance.',
          content_item_id: 3,
          metadata: {
            difficulty: 'advanced',
            category: 'culture',
            points: 20,
            timeLimit: 180,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Matching question created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example:
            'Match the Indonesian dishes with their English descriptions',
        },
        instructions: {
          type: 'string',
          example:
            'Drag and drop the Indonesian dish names to match them with their correct English descriptions.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { difficulty: 'intermediate', category: 'food', points: 15 },
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
    description: 'Internal server error during matching question creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createMatchingQuestionDto: CreateMatchingQuestionDto) {
    return this.matchingQuestionService.create(createMatchingQuestionDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all matching questions',
    description:
      'Retrieves all matching questions with optional filtering by content item ID',
  })
  @ApiQuery({
    name: 'contentItemId',
    type: 'integer',
    required: false,
    description: 'Filter by content item ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Matching questions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          question: {
            type: 'string',
            example:
              'Match the Indonesian dishes with their English descriptions',
          },
          instructions: {
            type: 'string',
            example:
              'Drag and drop the Indonesian dish names to match them with their correct English descriptions.',
            nullable: true,
          },
          content_item_id: { type: 'integer', example: 1 },
          metadata: {
            type: 'object',
            example: {
              difficulty: 'intermediate',
              category: 'food',
              points: 15,
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
    description: 'Internal server error during matching questions retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(@Query('contentItemId') contentItemId?: string) {
    if (contentItemId) {
      return this.matchingQuestionService.findByContentItem(+contentItemId);
    }
    return this.matchingQuestionService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get matching question by ID',
    description: 'Retrieves a specific matching question by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Matching question ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Matching question retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example:
            'Match the Indonesian dishes with their English descriptions',
        },
        instructions: {
          type: 'string',
          example:
            'Drag and drop the Indonesian dish names to match them with their correct English descriptions.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { difficulty: 'intermediate', category: 'food', points: 15 },
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
    description: 'Invalid matching question ID parameter',
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
    description: 'Matching question not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'MatchingQuestion with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching question retrieval',
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
    return this.matchingQuestionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update matching question',
    description:
      'Updates a matching question with new information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Matching question ID',
    example: 1,
  })
  @ApiBody({
    description: 'Matching question update data',
    type: UpdateMatchingQuestionDto,
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          maxLength: 500,
          description: 'The matching question text',
          example:
            'Match Indonesian traditional instruments with their descriptions',
        },
        instructions: {
          type: 'string',
          description: 'Instructions for answering the question',
          example:
            'Connect each traditional Indonesian musical instrument with its correct description and usage.',
          nullable: true,
        },
        content_item_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the content item this question belongs to',
          example: 2,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the matching question',
          example: {
            difficulty: 'advanced',
            category: 'music',
            points: 25,
            timeLimit: 150,
            updated: true,
          },
          nullable: true,
        },
      },
    },
    examples: {
      updateQuestion: {
        summary: 'Update question text only',
        value: {
          question:
            'Match Indonesian traditional instruments with their descriptions',
        },
      },
      updateMultipleFields: {
        summary: 'Update multiple fields',
        value: {
          question: 'Match Indonesian provinces with their capital cities',
          instructions:
            'Pair each Indonesian province with its correct capital city.',
          metadata: {
            difficulty: 'intermediate',
            category: 'geography',
            points: 18,
            timeLimit: 90,
            updated: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Matching question updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example:
            'Match Indonesian traditional instruments with their descriptions',
        },
        instructions: {
          type: 'string',
          example:
            'Connect each traditional Indonesian musical instrument with its correct description and usage.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 2 },
        metadata: {
          type: 'object',
          example: {
            difficulty: 'advanced',
            category: 'music',
            points: 25,
            timeLimit: 150,
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
    description: 'Matching question not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'MatchingQuestion with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching question update',
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
    @Body() updateMatchingQuestionDto: UpdateMatchingQuestionDto,
  ) {
    return this.matchingQuestionService.update(id, updateMatchingQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete matching question',
    description:
      'Soft deletes a matching question by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Matching question ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Matching question deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example:
            'Match the Indonesian dishes with their English descriptions',
        },
        instructions: {
          type: 'string',
          example:
            'Drag and drop the Indonesian dish names to match them with their correct English descriptions.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { difficulty: 'intermediate', category: 'food', points: 15 },
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
    description: 'Invalid matching question ID parameter',
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
    description: 'Matching question not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'MatchingQuestion with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during matching question deletion',
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
    return this.matchingQuestionService.remove(id);
  }
}
