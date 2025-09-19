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
} from '@nestjs/swagger';
import { UserLevelProgressService } from './user-level-progress.service';
import { CreateUserLevelProgressDto, UpdateUserLevelProgressDto } from './dto';

@ApiTags('User Level Progress')
@Controller('user-level-progress')
export class UserLevelProgressController {
  constructor(
    private readonly userLevelProgressService: UserLevelProgressService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create user level progress',
    description:
      'Creates a new user level progress record to track user progress on a specific level',
  })
  @ApiBody({
    type: CreateUserLevelProgressDto,
    description: 'User level progress creation data',
    examples: {
      example1: {
        summary: 'Basic progress record',
        value: {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          level_id: 1,
          completed: false,
          score: 0,
          attempts: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User level progress successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        user_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        level_id: { type: 'number', example: 1 },
        completed: { type: 'boolean', example: false },
        score: { type: 'number', nullable: true, example: 85 },
        attempts: { type: 'number', example: 1 },
        completed_at: {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            first_name: { type: 'string', nullable: true },
            last_name: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
          },
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
  create(@Body() createUserLevelProgressDto: CreateUserLevelProgressDto) {
    return this.userLevelProgressService.create(createUserLevelProgressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user level progress records',
    description:
      'Retrieves all user level progress records or filters by user ID or level ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter progress records by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'unitLevelId',
    required: false,
    type: Number,
    description: 'Filter progress records by unit level ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of user level progress records successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          user_id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          level_id: { type: 'number', example: 1 },
          completed: { type: 'boolean', example: true },
          score: { type: 'number', nullable: true, example: 85 },
          attempts: { type: 'number', example: 3 },
          completed_at: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              first_name: { type: 'string', nullable: true },
              last_name: { type: 'string', nullable: true },
              email: { type: 'string', format: 'email' },
            },
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
        message: {
          type: 'string',
          example: 'Invalid levelId parameter',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findAll(
    @Query('userId') userId?: string,
    @Query('unitLevelId', ParseIntPipe) unitLevelId?: number,
  ) {
    if (userId) {
      return this.userLevelProgressService.findByUser(userId);
    }
    if (unitLevelId) {
      return this.userLevelProgressService.findByUnitLevel(unitLevelId);
    }
    return this.userLevelProgressService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user level progress by ID',
    description: 'Retrieves a specific user level progress record by its ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User level progress record ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User level progress record successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        user_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        level_id: { type: 'number', example: 1 },
        completed: { type: 'boolean', example: true },
        score: { type: 'number', nullable: true, example: 85 },
        attempts: { type: 'number', example: 3 },
        completed_at: {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            first_name: { type: 'string', nullable: true },
            last_name: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID parameter',
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
    description: 'User level progress record not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'UserLevelProgress with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userLevelProgressService.findOne(id);
  }

  @Get('user/:userId/unit-level/:unitLevelId')
  @ApiOperation({
    summary: 'Get user progress for specific unit level',
    description: "Retrieves a user's progress record for a specific unit level",
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'unitLevelId',
    type: Number,
    description: 'Unit Level ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User level progress record successfully retrieved',
    schema: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'number', example: 1 },
        user_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        level_id: { type: 'number', example: 1 },
        completed: { type: 'boolean', example: true },
        score: { type: 'number', nullable: true, example: 85 },
        attempts: { type: 'number', example: 3 },
        completed_at: {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            first_name: { type: 'string', nullable: true },
            last_name: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid parameters',
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
  findByUserAndLevel(
    @Param('userId') userId: string,
    @Param('unitLevelId', ParseIntPipe) unitLevelId: number,
  ) {
    return this.userLevelProgressService.findByUserAndUnitLevel(
      userId,
      unitLevelId,
    );
  }

  @Post('complete')
  @ApiOperation({
    summary: 'Mark level as completed',
    description:
      "Marks a level as completed for a user, creating a progress record if it doesn't exist or updating the existing one",
  })
  @ApiBody({
    description: 'Level completion data',
    schema: {
      type: 'object',
      required: ['userId', 'unitLevelId'],
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        unitLevelId: { type: 'number', example: 1 },
        score: {
          type: 'number',
          minimum: 0,
          example: 85,
          description: 'Optional score for the completion',
        },
      },
    },
    examples: {
      withScore: {
        summary: 'Complete with score',
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          unitLevelId: 1,
          score: 85,
        },
      },
      withoutScore: {
        summary: 'Complete without score',
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          unitLevelId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Level successfully marked as completed',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        user_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        level_id: { type: 'number', example: 1 },
        completed: { type: 'boolean', example: true },
        score: { type: 'number', nullable: true, example: 85 },
        attempts: { type: 'number', example: 1 },
        completed_at: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  markCompleted(
    @Body() body: { userId: string; unitLevelId: number; score?: number },
  ) {
    return this.userLevelProgressService.markCompleted(
      body.userId,
      body.unitLevelId,
      body.score,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user level progress',
    description: 'Updates an existing user level progress record',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User level progress record ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserLevelProgressDto,
    description: 'User level progress update data',
    examples: {
      updateScore: {
        summary: 'Update score',
        value: {
          score: 95,
        },
      },
      markCompleted: {
        summary: 'Mark as completed',
        value: {
          completed: true,
          score: 88,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User level progress successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        user_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        level_id: { type: 'number', example: 1 },
        completed: { type: 'boolean', example: true },
        score: { type: 'number', nullable: true, example: 95 },
        attempts: { type: 'number', example: 2 },
        completed_at: {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            first_name: { type: 'string', nullable: true },
            last_name: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
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
        error: { type: 'string' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User level progress record not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'UserLevelProgress with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserLevelProgressDto: UpdateUserLevelProgressDto,
  ) {
    return this.userLevelProgressService.update(id, updateUserLevelProgressDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user level progress',
    description: 'Deletes a user level progress record by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User level progress record ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User level progress successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User level progress deleted successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID parameter',
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
    description: 'User level progress record not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'UserLevelProgress with ID 1 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userLevelProgressService.remove(id);
  }
}
