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
} from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto } from './dto';

@ApiTags('Quizzes')
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new quiz',
    description: 'Creates a new quiz with the provided information',
  })
  @ApiBody({
    type: CreateQuizDto,
    description: 'Quiz creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Quiz successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        contentItemId: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all quizzes or quizzes by content item',
    description:
      'Retrieves all quizzes or filters by contentItemId if provided',
  })
  @ApiQuery({
    name: 'contentItemId',
    type: 'number',
    required: false,
    description: 'Optional content item ID to filter quizzes',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of quizzes successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          description: { type: 'string' },
          contentItemId: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid contentItemId format (must be a number)',
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
  findAll(@Query('contentItemId') contentItemId?: string) {
    if (contentItemId) {
      return this.quizService.findByLevel(contentItemId);
    }
    return this.quizService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get quiz by ID',
    description: 'Retrieves a specific quiz by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the quiz',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        contentItemId: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Quiz not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quiz not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format',
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update quiz',
    description: 'Updates an existing quiz with the provided information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the quiz to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateQuizDto,
    description: 'Quiz update data (partial)',
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        contentItemId: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Quiz not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quiz not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or ID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete quiz',
    description: 'Permanently deletes a quiz from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the quiz to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quiz deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Quiz not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quiz not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format',
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.remove(id);
  }
}
