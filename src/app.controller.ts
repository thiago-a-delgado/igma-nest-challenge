import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * @ignore
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * @ignore 
   */
  @Get()
  getWelcome(): string {
    return this.appService.getWelcome();
  }
}
