import { Controller, Get } from '@nestjs/common';
import { Public } from './public.decorator';

@Controller()
export class AppController {
  constructor() { }

  @Get('health')
  @Public()
  getHealth() {
    return {};
  }
}
