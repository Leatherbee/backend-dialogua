import { Controller, Get, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  @Get()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the profile of the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        sub: { type: 'string', format: 'uuid' },
        iat: { type: 'number', description: 'Issued at timestamp' },
        exp: { type: 'number', description: 'Expiration timestamp' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
