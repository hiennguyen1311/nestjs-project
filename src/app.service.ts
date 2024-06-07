import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInitStatus(): string {
    return 'Server is running';
  }
}
