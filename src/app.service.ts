import { Injectable } from '@nestjs/common';

/**
 * @ignore
 */
@Injectable()
export class AppService {
  /**
   * @ignore 
   */
  getWelcome(): string {
    return 'Igma Challenge API';
  }
}
