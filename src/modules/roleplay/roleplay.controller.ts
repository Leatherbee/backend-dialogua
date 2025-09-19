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
import { RoleplayService } from './roleplay.service';
import {
  CreateRoleplayDto,
  UpdateRoleplayDto,
  ProcessSpeechDto,
  ProcessSpeechResponseDto,
} from './dto';
import { Roleplay } from './entities/roleplay.entity';

@ApiTags('Roleplays')
@Controller('roleplay')
export class RoleplayController {
  constructor(private readonly roleplayService: RoleplayService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new roleplay scenario',
    description:
      'Creates a new roleplay scenario with the provided information',
  })
  @ApiBody({
    type: CreateRoleplayDto,
    description: 'Roleplay creation data',
    examples: {
      example1: {
        summary: 'Customer service roleplay',
        value: {
          scenario:
            'You are a customer service representative helping a frustrated customer',
          instructions: 'Be empathetic and professional',
          character_name: 'Sarah',
          character_description: 'Experienced customer service representative',
          content_item_id: 1,
          metadata: { difficulty: 'intermediate' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Roleplay scenario successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        scenario: { type: 'string' },
        instructions: { type: 'string' },
        character_name: { type: 'string' },
        character_description: { type: 'string' },
        content_item_id: { type: 'number' },
        metadata: { type: 'object' },
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
  create(@Body() createRoleplayDto: CreateRoleplayDto) {
    return this.roleplayService.create(createRoleplayDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all roleplay scenarios or filter by content item',
    description:
      'Retrieves all roleplay scenarios or filters by contentItemId if provided',
  })
  @ApiQuery({
    name: 'contentItemId',
    type: 'string',
    required: false,
    description: 'Optional content item ID to filter roleplay scenarios',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'List of roleplay scenarios successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          scenario: { type: 'string' },
          instructions: { type: 'string' },
          character_name: { type: 'string' },
          character_description: { type: 'string' },
          content_item_id: { type: 'number' },
          metadata: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid contentItemId format',
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
  findAll(@Query('contentItemId') contentItemId?: string) {
    if (contentItemId) {
      return this.roleplayService.findByLevel(contentItemId);
    }
    return this.roleplayService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get roleplay scenario by ID',
    description:
      'Retrieves a specific roleplay scenario by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The unique identifier of the roleplay scenario',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay scenario successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        scenario: { type: 'string' },
        instructions: { type: 'string' },
        character_name: { type: 'string' },
        character_description: { type: 'string' },
        content_item_id: { type: 'number' },
        metadata: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay scenario not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay not found' },
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
  findOne(@Param('id') id: string) {
    return this.roleplayService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update roleplay scenario',
    description:
      'Updates an existing roleplay scenario with the provided information',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The unique identifier of the roleplay scenario to update',
    example: '1',
  })
  @ApiBody({
    type: UpdateRoleplayDto,
    description: 'Roleplay update data (partial)',
    examples: {
      example1: {
        summary: 'Update scenario description',
        value: {
          scenario: 'Updated scenario description',
          instructions: 'Updated instructions',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay scenario successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        scenario: { type: 'string' },
        instructions: { type: 'string' },
        character_name: { type: 'string' },
        character_description: { type: 'string' },
        content_item_id: { type: 'number' },
        metadata: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay scenario not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay not found' },
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
  async update(
    @Param('id') id: string,
    @Body() updateRoleplayDto: UpdateRoleplayDto,
  ): Promise<Roleplay> {
    return await this.roleplayService.update(+id, updateRoleplayDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete roleplay scenario',
    description: 'Permanently deletes a roleplay scenario from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The unique identifier of the roleplay scenario to delete',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Roleplay scenario successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay scenario not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay not found' },
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
  remove(@Param('id') id: string) {
    return this.roleplayService.remove(+id);
  }

  @Post(':id/process-speech')
  @ApiOperation({
    summary: 'Process speech input for roleplay',
    description:
      'Processes audio input, converts it to text, generates AI response based on roleplay character, and returns the conversation data',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The unique identifier of the roleplay scenario',
    example: '1',
  })
  @ApiBody({
    type: ProcessSpeechDto,
    description: 'Speech processing data including audio input',
    examples: {
      example1: {
        summary: 'Process audio input',
        value: {
          audioData: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10...',
          roleplayId: 1,
          language: 'en-US',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Speech successfully processed and response generated',
    type: ProcessSpeechResponseDto,
    schema: {
      type: 'object',
      properties: {
        transcribedText: {
          type: 'string',
          example: 'Hello, how are you today?',
        },
        aiResponse: {
          type: 'string',
          example:
            'I am doing well, thank you for asking! How can I help you today?',
        },
        turnOrder: {
          type: 'number',
          example: 5,
        },
        metadata: {
          type: 'object',
          properties: {
            confidence: { type: 'number', example: 0.95 },
            processingTime: { type: 'number', example: 1.2 },
            language: { type: 'string', example: 'en-US' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Roleplay scenario not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Roleplay not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or audio format',
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
    description: 'Speech processing failed or internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async processSpeech(
    @Param('id') id: string,
    @Body() processSpeechDto: ProcessSpeechDto,
  ): Promise<ProcessSpeechResponseDto> {
    return this.roleplayService.processSpeech(+id, processSpeechDto);
  }
}
