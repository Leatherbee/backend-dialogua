import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponse> {
    if (!refreshTokenDto.refresh_token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return this.authService.refresh(refreshTokenDto.refresh_token);
  }
}
