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
import { RoleplayAttemptService } from './roleplay-attempt.service';
import { CreateRoleplayAttemptDto, UpdateRoleplayAttemptDto } from './dto';

@ApiTags('Roleplay Attempts')
@Controller('roleplay-attempt')
export class RoleplayAttemptController {
  constructor(
    private readonly roleplayAttemptService: RoleplayAttemptService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new roleplay attempt',
    description: 'Creates a new roleplay attempt for a user',
  })
  @ApiBody({
    type: CreateRoleplayAttemptDto,
    description: 'Roleplay attempt creation data',
    examples: {
      example1: {
        summary: 'New roleplay attempt',
        value: {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          roleplay_id: 1,
          score: 85,
          completed: false,
          attempt_number: 1,
          feedback: 'Good start, needs improvement in communication',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Roleplay attempt created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        user_id: { type: 'number', example: 123 },
        roleplay_id: { type: 'number', example: 456 },
        score: { type: 'number', example: 85.5, nullable: true },
        completed: { type: 'boolean', example: false },
        attempt_number: { type: 'number', example: 1 },
        feedback: {
          type: 'string',
          example: 'Good effort! Try to be more expressive.',
          nullable: true,
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        deleted_at: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createRoleplayAttemptDto: CreateRoleplayAttemptDto) {
    return this.roleplayAttemptService.create(createRoleplayAttemptDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all roleplay attempts with optional filtering',
    description:
      'Retrieves all roleplay attempts or filters by userId or roleplayId',
  })
  @ApiQuery({
    name: 'userId',
    type: 'string',
    required: false,
    description: 'Optional user ID to filter attempts',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'roleplayId',
    type: 'number',
    required: false,
    description: 'Optional roleplay ID to filter attempts',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of roleplay attempts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          user_id: { type: 'number', example: 123 },
          roleplay_id: { type: 'number', example: 456 },
          score: { type: 'number', example: 85.5, nullable: true },
          completed: { type: 'boolean', example: false },
          attempt_number: { type: 'number', example: 1 },
          feedback: {
            type: 'string',
            example: 'Good effort! Try to be more expressive.',
            nullable: true,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          deleted_at: {
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
    description: 'Invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(
    @Query('userId') userId?: string,
    @Query('roleplayId', ParseIntPipe) roleplayId?: number,
  ) {
    if (userId) {
      return this.roleplayAttemptService.findByUser(userId);
    }
    if (roleplayId) {
      return this.roleplayAttemptService.findByRoleplay(roleplayId);
    }
    return this.roleplayAttemptService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get roleplay attempt by ID',
    description:
      'Retrieves a specific roleplay attempt by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the roleplay attempt',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay attempt retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        user_id: { type: 'number', example: 123 },
        roleplay_id: { type: 'number', example: 456 },
        score: { type: 'number', example: 85.5, nullable: true },
        completed: { type: 'boolean', example: false },
        attempt_number: { type: 'number', example: 1 },
        feedback: {
          type: 'string',
          example: 'Good effort! Try to be more expressive.',
          nullable: true,
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        deleted_at: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay attempt not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay attempt not found' },
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleplayAttemptService.findOne(id);
  }

  @Get('user/:userId/roleplay/:roleplayId')
  @ApiOperation({
    summary: 'Get roleplay attempts by user and roleplay',
    description:
      'Retrieves all attempts for a specific user and roleplay combination',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'roleplayId',
    type: 'number',
    description: 'The unique identifier of the roleplay',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of roleplay attempts successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          user_id: { type: 'string', format: 'uuid' },
          roleplay_id: { type: 'number' },
          score: { type: 'number' },
          completed: { type: 'boolean' },
          attempt_number: { type: 'number' },
          feedback: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID or roleplay ID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findByUserAndRoleplay(
    @Param('userId') userId: string,
    @Param('roleplayId', ParseIntPipe) roleplayId: number,
  ) {
    return this.roleplayAttemptService.findByUserAndRoleplay(
      userId,
      roleplayId,
    );
  }

  @Post('complete')
  @ApiOperation({
    summary: 'Mark roleplay attempt as completed',
    description:
      'Marks a roleplay attempt as completed with optional score and feedback',
  })
  @ApiBody({
    description: 'Completion data for the roleplay attempt',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        roleplayId: { type: 'number' },
        score: { type: 'number', minimum: 0 },
        feedback: { type: 'string' },
      },
      required: ['userId', 'roleplayId'],
    },
    examples: {
      example1: {
        summary: 'Complete with score and feedback',
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          roleplayId: 1,
          score: 90,
          feedback: 'Excellent communication skills demonstrated',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay attempt successfully marked as completed',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        user_id: { type: 'string', format: 'uuid' },
        roleplay_id: { type: 'number' },
        score: { type: 'number' },
        completed: { type: 'boolean', example: true },
        attempt_number: { type: 'number' },
        feedback: { type: 'string' },
        completed_at: { type: 'string', format: 'date-time' },
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
  @ApiNotFoundResponse({
    description: 'Roleplay attempt not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay attempt not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  markCompleted(
    @Body()
    body: {
      userId: string;
      roleplayId: number;
      score?: number;
      feedback?: string;
    },
  ) {
    return this.roleplayAttemptService.markCompleted(
      body.userId,
      body.roleplayId,
      body.score,
      body.feedback,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update roleplay attempt',
    description:
      'Updates an existing roleplay attempt with the provided information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the roleplay attempt to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoleplayAttemptDto,
    description: 'Roleplay attempt update data (partial)',
    examples: {
      example1: {
        summary: 'Update score and feedback',
        value: {
          score: 95,
          feedback: 'Improved performance with excellent results',
          completed: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay attempt successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        user_id: { type: 'string', format: 'uuid' },
        roleplay_id: { type: 'number' },
        score: { type: 'number' },
        completed: { type: 'boolean' },
        attempt_number: { type: 'number' },
        feedback: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay attempt not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay attempt not found' },
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleplayAttemptDto: UpdateRoleplayAttemptDto,
  ) {
    return this.roleplayAttemptService.update(id, updateRoleplayAttemptDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete roleplay attempt',
    description: 'Permanently deletes a roleplay attempt from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the roleplay attempt to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay attempt deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Roleplay attempt deleted successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay attempt not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay attempt not found' },
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleplayAttemptService.remove(id);
  }
}
