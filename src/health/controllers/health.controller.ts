import { Controller, Get } from '@nestjs/common';
import { Public } from '../../modules/auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  checkHealth(): { status: string; timestamp: number } {
    return {
      status: 'ok',
      timestamp: Date.now(),
    };
  }
}
