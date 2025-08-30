import { Controller, Get } from '@nestjs/common';
import { Public } from './public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor() { }

  @Get('health')
  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  getHealth() {
    return {};
  }
}
