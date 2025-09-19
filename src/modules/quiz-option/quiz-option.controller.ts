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
import { QuizOptionService } from './quiz-option.service';
import { CreateQuizOptionDto, UpdateQuizOptionDto } from './dto';

@ApiTags('Quiz Options')
@Controller('quiz-options')
export class QuizOptionController {
  constructor(private readonly quizOptionService: QuizOptionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new quiz option',
    description:
      'Creates a new quiz option with text, correctness flag, and metadata for a specific quiz',
  })
  @ApiBody({
    description: 'Quiz option creation data',
    type: CreateQuizOptionDto,
    schema: {
      type: 'object',
      properties: {
        option_text: {
          type: 'string',
          maxLength: 255,
          description: 'The text content of the quiz option',
          example: 'Nasi Gudeg',
        },
        is_correct: {
          type: 'boolean',
          description: 'Whether this option is the correct answer',
          example: true,
        },
        quiz_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the quiz this option belongs to',
          example: 1,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the quiz option',
          example: {
            explanation: 'Traditional Javanese dish',
            difficulty: 'easy',
            points: 5,
          },
          nullable: true,
        },
      },
      required: ['option_text', 'is_correct', 'quiz_id'],
    },
    examples: {
      correctOption: {
        summary: 'Correct quiz option',
        value: {
          option_text: 'Nasi Gudeg',
          is_correct: true,
          quiz_id: 1,
          metadata: {
            explanation: 'Traditional Javanese dish from Yogyakarta',
            points: 5,
          },
        },
      },
      incorrectOption: {
        summary: 'Incorrect quiz option',
        value: {
          option_text: 'Sushi',
          is_correct: false,
          quiz_id: 1,
          metadata: {
            explanation: 'This is Japanese, not Indonesian cuisine',
            points: 0,
          },
        },
      },
      simpleOption: {
        summary: 'Simple option without metadata',
        value: {
          option_text: 'Rendang',
          is_correct: false,
          quiz_id: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Quiz option created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        option_text: { type: 'string', example: 'Nasi Gudeg' },
        is_correct: { type: 'boolean', example: true },
        quiz_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: {
            explanation: 'Traditional Javanese dish from Yogyakarta',
            points: 5,
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
    description: 'Internal server error during quiz option creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createQuizOptionDto: CreateQuizOptionDto) {
    return this.quizOptionService.create(createQuizOptionDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all quiz options',
    description:
      'Retrieves all quiz options with optional filtering by quiz ID',
  })
  @ApiQuery({
    name: 'quizId',
    type: 'integer',
    required: false,
    description: 'Filter by quiz ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz options retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          option_text: { type: 'string', example: 'Nasi Gudeg' },
          is_correct: { type: 'boolean', example: true },
          quiz_id: { type: 'integer', example: 1 },
          metadata: {
            type: 'object',
            example: {
              explanation: 'Traditional Javanese dish from Yogyakarta',
              points: 5,
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
  @ApiBadRequestResponse({
    description: 'Invalid quiz ID parameter',
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during quiz options retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(@Query('quizId', ParseIntPipe) quizId?: number) {
    if (quizId) {
      return this.quizOptionService.findByQuiz(quizId);
    }
    return this.quizOptionService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get quiz option by ID',
    description: 'Retrieves a specific quiz option by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Quiz option ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz option retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        option_text: { type: 'string', example: 'Nasi Gudeg' },
        is_correct: { type: 'boolean', example: true },
        quiz_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: {
            explanation: 'Traditional Javanese dish from Yogyakarta',
            points: 5,
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
  })
  @ApiBadRequestResponse({
    description: 'Invalid quiz option ID parameter',
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
    description: 'Quiz option not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'QuizOption with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during quiz option retrieval',
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
    return this.quizOptionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update quiz option',
    description:
      'Updates a quiz option with new information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Quiz option ID',
    example: 1,
  })
  @ApiBody({
    description: 'Quiz option update data',
    type: UpdateQuizOptionDto,
    schema: {
      type: 'object',
      properties: {
        option_text: {
          type: 'string',
          maxLength: 255,
          description: 'The text content of the quiz option',
          example: 'Nasi Gudeg (Traditional Javanese dish)',
        },
        is_correct: {
          type: 'boolean',
          description: 'Whether this option is the correct answer',
          example: true,
        },
        quiz_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the quiz this option belongs to',
          example: 2,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the quiz option',
          example: {
            explanation: 'Updated explanation with more details',
            difficulty: 'medium',
            points: 8,
            updated: true,
          },
          nullable: true,
        },
      },
    },
    examples: {
      updateText: {
        summary: 'Update option text only',
        value: {
          option_text: 'Nasi Gudeg (Traditional Javanese dish)',
        },
      },
      updateCorrectness: {
        summary: 'Update correctness flag',
        value: {
          is_correct: false,
        },
      },
      updateMultipleFields: {
        summary: 'Update multiple fields',
        value: {
          option_text: 'Rendang (Spicy meat dish)',
          is_correct: true,
          metadata: {
            explanation: 'Traditional Minangkabau dish',
            difficulty: 'medium',
            points: 10,
            updated: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz option updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        option_text: {
          type: 'string',
          example: 'Nasi Gudeg (Traditional Javanese dish)',
        },
        is_correct: { type: 'boolean', example: true },
        quiz_id: { type: 'integer', example: 2 },
        metadata: {
          type: 'object',
          example: {
            explanation: 'Updated explanation with more details',
            difficulty: 'medium',
            points: 8,
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
    description: 'Quiz option not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'QuizOption with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during quiz option update',
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
    @Body() updateQuizOptionDto: UpdateQuizOptionDto,
  ) {
    return this.quizOptionService.update(id, updateQuizOptionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete quiz option',
    description:
      'Soft deletes a quiz option by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Quiz option ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz option deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        option_text: { type: 'string', example: 'Nasi Gudeg' },
        is_correct: { type: 'boolean', example: true },
        quiz_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: {
            explanation: 'Traditional Javanese dish from Yogyakarta',
            points: 5,
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
    description: 'Invalid quiz option ID parameter',
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
    description: 'Quiz option not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'QuizOption with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during quiz option deletion',
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
    return this.quizOptionService.remove(id);
  }
}
