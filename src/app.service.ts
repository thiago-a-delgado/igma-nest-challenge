import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * @ignore 
   */
  getWelcome(): string {
    return 'Igma Challenge API';
  }
}
