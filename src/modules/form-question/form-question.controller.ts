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
import { Public } from '../auth/decorators/public.decorator';
import { FormQuestionService } from './form-question.service';
import { CreateFormQuestionDto, UpdateFormQuestionDto } from './dto';

@ApiTags('Form Questions')
@Controller('form-questions')
export class FormQuestionController {
  constructor(private readonly formQuestionService: FormQuestionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new form question',
    description:
      'Creates a new form question with instructions and metadata for a specific content item',
  })
  @ApiBody({
    description: 'Form question creation data',
    type: CreateFormQuestionDto,
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          maxLength: 500,
          description: 'The form question text',
          example: 'What is your favorite Indonesian dish?',
        },
        instructions: {
          type: 'string',
          description: 'Instructions for answering the question',
          example:
            'Please provide a detailed answer about your favorite Indonesian cuisine.',
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
          description: 'Additional metadata for the form question',
          example: { category: 'food', difficulty: 'easy', points: 10 },
          nullable: true,
        },
      },
      required: ['question', 'content_item_id'],
    },
    examples: {
      basicQuestion: {
        summary: 'Basic form question',
        value: {
          question: 'What is your favorite Indonesian dish?',
          instructions:
            'Please provide a detailed answer about your favorite Indonesian cuisine.',
          content_item_id: 1,
          metadata: { category: 'food', difficulty: 'easy' },
        },
      },
      languageQuestion: {
        summary: 'Language learning question',
        value: {
          question:
            'Translate the following sentence to Indonesian: "Good morning"',
          instructions:
            'Provide the Indonesian translation and pronunciation guide.',
          content_item_id: 2,
          metadata: {
            category: 'translation',
            difficulty: 'beginner',
            points: 5,
          },
        },
      },
      cultureQuestion: {
        summary: 'Cultural question',
        value: {
          question:
            'Describe a traditional Indonesian ceremony you know about.',
          instructions:
            'Include details about the purpose, participants, and cultural significance.',
          content_item_id: 3,
          metadata: {
            category: 'culture',
            difficulty: 'intermediate',
            points: 15,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Form question created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example: 'What is your favorite Indonesian dish?',
        },
        instructions: {
          type: 'string',
          example:
            'Please provide a detailed answer about your favorite Indonesian cuisine.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { category: 'food', difficulty: 'easy' },
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
    description: 'Internal server error during form question creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createFormQuestionDto: CreateFormQuestionDto) {
    return this.formQuestionService.create(createFormQuestionDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all form questions',
    description:
      'Retrieves all form questions with optional filtering by content item ID',
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
    description: 'Form questions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          question: {
            type: 'string',
            example: 'What is your favorite Indonesian dish?',
          },
          instructions: {
            type: 'string',
            example:
              'Please provide a detailed answer about your favorite Indonesian cuisine.',
            nullable: true,
          },
          content_item_id: { type: 'integer', example: 1 },
          metadata: {
            type: 'object',
            example: { category: 'food', difficulty: 'easy' },
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
    description: 'Internal server error during form questions retrieval',
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
      return this.formQuestionService.findByLevel(contentItemId);
    }
    return this.formQuestionService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get form question by ID',
    description: 'Retrieves a specific form question by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Form question ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Form question retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example: 'What is your favorite Indonesian dish?',
        },
        instructions: {
          type: 'string',
          example:
            'Please provide a detailed answer about your favorite Indonesian cuisine.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { category: 'food', difficulty: 'easy' },
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
    description: 'Invalid form question ID parameter',
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
    description: 'Form question not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'FormQuestion with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during form question retrieval',
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
    return this.formQuestionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update form question',
    description:
      'Updates a form question with new information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Form question ID',
    example: 1,
  })
  @ApiBody({
    description: 'Form question update data',
    type: UpdateFormQuestionDto,
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          maxLength: 500,
          description: 'The form question text',
          example: 'What is your favorite traditional Indonesian dish and why?',
        },
        instructions: {
          type: 'string',
          description: 'Instructions for answering the question',
          example:
            'Please provide a detailed answer including the dish name, ingredients, and personal reasons.',
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
          description: 'Additional metadata for the form question',
          example: {
            category: 'food',
            difficulty: 'intermediate',
            points: 15,
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
            'What is your favorite traditional Indonesian dish and why?',
        },
      },
      updateMultipleFields: {
        summary: 'Update multiple fields',
        value: {
          question: 'Describe your experience with Indonesian street food.',
          instructions:
            'Include details about specific dishes, locations, and memorable experiences.',
          metadata: {
            category: 'food',
            difficulty: 'intermediate',
            points: 20,
            updated: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Form question updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example: 'What is your favorite traditional Indonesian dish and why?',
        },
        instructions: {
          type: 'string',
          example:
            'Please provide a detailed answer including the dish name, ingredients, and personal reasons.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 2 },
        metadata: {
          type: 'object',
          example: {
            category: 'food',
            difficulty: 'intermediate',
            points: 15,
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
    description: 'Form question not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'FormQuestion with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during form question update',
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
    @Body() updateFormQuestionDto: UpdateFormQuestionDto,
  ) {
    return this.formQuestionService.update(id, updateFormQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete form question',
    description:
      'Soft deletes a form question by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Form question ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Form question deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        question: {
          type: 'string',
          example: 'What is your favorite Indonesian dish?',
        },
        instructions: {
          type: 'string',
          example:
            'Please provide a detailed answer about your favorite Indonesian cuisine.',
          nullable: true,
        },
        content_item_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { category: 'food', difficulty: 'easy' },
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
    description: 'Invalid form question ID parameter',
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
    description: 'Form question not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'FormQuestion with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during form question deletion',
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
    return this.formQuestionService.remove(id);
  }
}
