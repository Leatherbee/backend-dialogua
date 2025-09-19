import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { LevelContentService } from './level-content.service';

@ApiTags('Level Content')
@Controller('level')
export class LevelContentController {
  constructor(private readonly levelContentService: LevelContentService) {}

  @Public()
  @Get(':levelId/content')
  @ApiOperation({
    summary: 'Get complete level content including quizzes and roleplays',
    description:
      'Returns all content for a specific level including quizzes with options and roleplays with turns. This endpoint provides all data needed for a level in a single call.',
  })
  @ApiParam({
    name: 'levelId',
    type: 'string',
    description: 'The unique identifier of the level',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Level content successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        level: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Level 1 - Perkenalan' },
            description: { type: 'string', example: 'Introduction level' },
            position: { type: 'number', example: 1 },
            metadata: { type: 'object' },
          },
        },
        content: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              content_type: {
                type: 'string',
                enum: ['quiz', 'roleplay'],
                example: 'quiz',
              },
              title: { type: 'string', example: 'Pilih Sapaan yang Tepat' },
              description: {
                type: 'string',
                example: 'Choose the appropriate greeting',
              },
              position: { type: 'number', example: 1 },
              metadata: { type: 'object' },
              quiz: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'number', example: 1 },
                  question: {
                    type: 'string',
                    example: 'What is the correct greeting?',
                  },
                  explanation: {
                    type: 'string',
                    example: 'Explanation of the answer',
                  },
                  metadata: { type: 'object' },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number', example: 1 },
                        option_text: {
                          type: 'string',
                          example: 'Selamat pagi',
                        },
                        is_correct: { type: 'boolean', example: true },
                        position: { type: 'number', example: 1 },
                        metadata: { type: 'object' },
                      },
                    },
                  },
                },
              },
              roleplay: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'number', example: 1 },
                  scenario: {
                    type: 'string',
                    example: 'Airport check-in scenario',
                  },
                  instructions: {
                    type: 'string',
                    example: 'Practice greeting at airport',
                  },
                  character_name: {
                    type: 'string',
                    example: 'Airport Officer',
                  },
                  character_description: {
                    type: 'string',
                    example: 'Friendly airport staff',
                  },
                  metadata: { type: 'object' },
                  turns: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number', example: 1 },
                        speaker: {
                          type: 'string',
                          enum: ['user', 'character'],
                          example: 'character',
                        },
                        message: {
                          type: 'string',
                          example: 'Selamat pagi. Selamat datang di Indonesia.',
                        },
                        turn_order: { type: 'number', example: 1 },
                        metadata: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid level ID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid level ID format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Level not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Level not found' },
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
  getLevelContent(@Param('levelId') levelId: string) {
    return this.levelContentService.getLevelContent(levelId);
  }
}
