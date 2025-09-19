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
import { UserDashboardService } from './user-dashboard.service';

@ApiTags('User Dashboard')
@Controller('user')
export class UserDashboardController {
  constructor(private readonly userDashboardService: UserDashboardService) {}

  @Public()
  @Get(':userId/dashboard')
  @ApiOperation({
    summary: 'Get user dashboard with all programs, units, levels and progress',
    description:
      'Returns a consolidated view of all programs, units, levels with user progress status. This endpoint provides all data needed for the mobile app navigation in a single call.',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The unique identifier of the user',
    example: 'user-123',
  })
  @ApiResponse({
    status: 200,
    description: 'User dashboard data successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: 'user-123' },
            totalProgress: { type: 'number', example: 65.5 },
            completedLevels: { type: 'number', example: 3 },
            totalLevels: { type: 'number', example: 5 },
          },
        },
        programs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              code: { type: 'string', example: 'BIPA1' },
              name: {
                  type: 'string',
                  example: 'Bahasa Indonesia untuk Penutur Asing Level 1',
                },
              metadata: { type: 'object' },
              units: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    code: { type: 'string', example: 'UNIT1' },
                    title: { type: 'string', example: 'Perkenalan' },
                    position: { type: 'number', example: 1 },
                    metadata: { type: 'object' },
                    levels: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          name: { type: 'string', example: 'Level 1 - Perkenalan' },
                          position: { type: 'number', example: 1 },
                          isLocked: { type: 'boolean', example: false },
                          isCompleted: { type: 'boolean', example: true },
                          progress: { type: 'number', example: 100 },
                          contentCount: { type: 'number', example: 4 },
                          completedContent: { type: 'number', example: 4 },
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
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid user ID format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
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
  getUserDashboard(@Param('userId') userId: string) {
    return this.userDashboardService.getUserDashboard(userId);
  }
}