import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { Public } from '../auth/decorators/public.decorator';
import { RoleplayTurnService } from './roleplay-turn.service';
import { CreateRoleplayTurnDto, UpdateRoleplayTurnDto } from './dto';

@ApiTags('roleplay-turn')
@Controller('roleplay-turn')
export class RoleplayTurnController {
  constructor(private readonly roleplayTurnService: RoleplayTurnService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new roleplay turn',
    description:
      'Creates a new turn in a roleplay conversation between user and character',
  })
  @ApiBody({
    type: CreateRoleplayTurnDto,
    description: 'Roleplay turn data',
    examples: {
      userTurn: {
        summary: 'User turn example',
        value: {
          speaker: 'user',
          message: 'Hello, how are you today?',
          turn_order: 1,
          roleplay_id: 1,
          metadata: { emotion: 'friendly' },
        },
      },
      characterTurn: {
        summary: 'Character turn example',
        value: {
          speaker: 'character',
          message: 'I am doing well, thank you for asking!',
          turn_order: 2,
          roleplay_id: 1,
          metadata: { emotion: 'cheerful' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Roleplay turn created successfully',
    schema: {
      example: {
        id: 1,
        speaker: 'user',
        message: 'Hello, how are you today?',
        turn_order: 1,
        roleplay_id: 1,
        metadata: { emotion: 'friendly' },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'speaker must be one of the following values: user, character',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  create(@Body() createRoleplayTurnDto: CreateRoleplayTurnDto) {
    return this.roleplayTurnService.create(createRoleplayTurnDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all roleplay turns',
    description:
      'Retrieves all roleplay turns or filters by roleplay ID if provided',
  })
  @ApiQuery({
    name: 'roleplayId',
    required: false,
    type: String,
    description: 'Filter turns by roleplay ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'List of roleplay turns retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          speaker: 'user',
          message: 'Hello, how are you today?',
          turn_order: 1,
          roleplay_id: 1,
          metadata: { emotion: 'friendly' },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          speaker: 'character',
          message: 'I am doing well, thank you for asking!',
          turn_order: 2,
          roleplay_id: 1,
          metadata: { emotion: 'cheerful' },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  findAll(@Query('roleplayId') roleplayId?: string) {
    if (roleplayId) {
      return this.roleplayTurnService.findByRoleplay(+roleplayId);
    }
    return this.roleplayTurnService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get a roleplay turn by ID',
    description: 'Retrieves a specific roleplay turn by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Roleplay turn ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay turn retrieved successfully',
    schema: {
      example: {
        id: 1,
        speaker: 'user',
        message: 'Hello, how are you today?',
        turn_order: 1,
        roleplay_id: 1,
        metadata: { emotion: 'friendly' },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay turn not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Roleplay turn not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.roleplayTurnService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a roleplay turn',
    description: 'Updates an existing roleplay turn with new data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Roleplay turn ID',
    example: '1',
  })
  @ApiBody({
    type: UpdateRoleplayTurnDto,
    description: 'Updated roleplay turn data',
    examples: {
      updateMessage: {
        summary: 'Update message example',
        value: {
          message: 'Hello, how are you doing today?',
          metadata: { emotion: 'friendly', edited: true },
        },
      },
      updateSpeaker: {
        summary: 'Update speaker example',
        value: {
          speaker: 'character',
          turn_order: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay turn updated successfully',
    schema: {
      example: {
        id: 1,
        speaker: 'user',
        message: 'Hello, how are you doing today?',
        turn_order: 1,
        roleplay_id: 1,
        metadata: { emotion: 'friendly', edited: true },
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T01:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'speaker must be one of the following values: user, character',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay turn not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Roleplay turn not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateRoleplayTurnDto: UpdateRoleplayTurnDto,
  ) {
    return this.roleplayTurnService.update(+id, updateRoleplayTurnDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a roleplay turn',
    description: 'Deletes a specific roleplay turn by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Roleplay turn ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay turn deleted successfully',
    schema: {
      example: {
        message: 'Roleplay turn deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay turn not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Roleplay turn not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.roleplayTurnService.remove(+id);
  }
}
