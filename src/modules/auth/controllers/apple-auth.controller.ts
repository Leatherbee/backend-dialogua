import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth/apple')
export class AppleAuthController {
  @Get()
  @UseGuards(AuthGuard('apple'))
  @ApiOperation({ summary: 'Initiate Apple authentication' })
  @ApiResponse({
    status: 200,
    description: 'Redirects to Apple for authentication',
  })
  async appleAuth() {
    // The actual implementation is handled by the AppleStrategy
    // This just initiates the OAuth flow
  }

  @Get('callback')
  @UseGuards(AuthGuard('apple'))
  @ApiOperation({ summary: 'Apple authentication callback' })
  @ApiResponse({
    status: 200,
    description: 'Handles the Apple authentication callback',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async appleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // This route will be called after successful Apple authentication
    // The user will be attached to the request by the passport strategy
    const user = req.user;

    // Redirect to frontend with tokens
    // In a real application, you would generate a JWT and redirect to your frontend
    // with the token in the URL or in a secure HTTP-only cookie
    return res.redirect(`/auth/success?token=${user['access_token']}`);
  }
}
